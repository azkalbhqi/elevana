import { NextRequest } from "next/server";
import { askGemini } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { prompt, history } = await req.json();
    const text = await askGemini(prompt, history);
    return Response.json({ text });
  } catch (err: any) {
    console.error("Gemini API error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
