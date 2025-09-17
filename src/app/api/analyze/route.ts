import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";
import { analyzeWithGemini } from "@/lib/gemini";

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*/g, "") // hapus **bold**
    .replace(/#+/g, "")   // hapus # heading
    .replace(/[_`]/g, ""); // hapus _, ` kalau ada
}

export async function GET(req: Request) {
  try {
    // Ambil token dari header
    const authHeader = req.headers.get("authorization");
    console.log("Authorization header:", authHeader); // Debugging

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: Missing or invalid token" },
        { status: 401 }
      );
    }

    const idToken = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = await adminAuth.verifyIdToken(idToken);
      console.log("Decoded token:", decoded); // Debugging
    } catch (err) {
      console.error("Token verification failed:", err);
      return NextResponse.json(
        { error: "Unauthorized: Invalid or expired token" },
        { status: 401 }
      );
    }

    const userId = decoded.uid;

    // Ambil tanggal sekarang & 7 hari kebelakang
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    // Query moods dari user yg login
    const snapshot = await adminDb
      .collection("users")
      .doc(userId)
      .collection("moods")
      .where("createdAt", ">=", Timestamp.fromDate(sevenDaysAgo))
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ message: "No mood data found" });
    }

    // Kumpulin data dengan aman
    const moods: string[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      const createdAt =
        data.createdAt?.toDate instanceof Function
          ? data.createdAt.toDate()
          : new Date();
      const moodText = typeof data.mood === "string" ? data.mood : "No mood provided";
      return `${createdAt.toDateString()}: ${moodText}`;
    });

    // Prompt buat Gemini
    const prompt = `
    Berikut adalah catatan mood user selama 7 hari terakhir:
    ${moods.join("\n")}

    Tolong analisa perubahan moodnya:
    - Apakah membaik atau memburuk?
    - Pola harian yang terlihat?
    - Insight untuk kesehatan mentalnya.
    `;

    const analysis = await analyzeWithGemini(prompt);
    
    // Ensure analysis is a string or an array of strings
    const analysisText = Array.isArray(analysis) ? analysis.join("\n") : String(analysis);
    const cleanedAnalysis = stripMarkdown(analysisText);
    
    return NextResponse.json({
      rawData: moods,
      analysis: cleanedAnalysis,
    });
  } catch (err: any) {
    console.error("Analyze error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to analyze" },
      { status: 500 }
    );
  }
}
