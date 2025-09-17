"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";
import MoodForm from "../utils/Yourpage/mood-form";
import MoodCalendar from "../utils/Yourpage/mood-calendar";
import AnalysisCard from "../utils/Analyze-card";
import { RotateCcw } from "lucide-react";

interface AnalyzeResponse {
  rawData: string[];
  analysis: string;
}

const provider = new GoogleAuthProvider();

const Page = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pantau login user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchAnalysis = async (forceReload = false) => {
    if (!user) {
      setError("Please login first");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // kalau force reload, hapus cache
      if (forceReload) {
        localStorage.removeItem(`moodAnalysis_${user.uid}`);
      }

      const cached = localStorage.getItem(`moodAnalysis_${user.uid}`);
      if (cached && !forceReload) {
        setData(JSON.parse(cached));
        setLoading(false);
        return;
      }

      const token = await user.getIdToken();
      const res = await fetch("/api/analyze", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to fetch analysis");
      }

      const json = await res.json();
      setData(json);

      localStorage.setItem(`moodAnalysis_${user.uid}`, JSON.stringify(json));
    } catch (err: any) {
      console.error("Failed to fetch analysis:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchAnalysis();
  }, [user]);

  return (
    <div className="h-full flex flex-col md:flex-row">
      {/* Kiri (Calendar) */}
      <div className="w-full md:w-1/3 bg-gray-50">
        <MoodCalendar />
      </div>

      {/* Kanan (Timeline) */}
      <div className="w-full md:w-2/3 bg-teal-50 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">AI Analyzer</h1>
          {user && (
            <button
              onClick={() => fetchAnalysis(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition"
            >
              <RotateCcw className="w-4 h-4 text-teal-600" />
              Reload
            </button>
          )}
        </div>

        {!user && (
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4"
          >
            Login with Google
          </button>
        )}

        {loading && (
          <div className="min-h-[200px] flex items-center text-lg font-semibold">
            Loading analysis...
          </div>
        )}

        {!loading && error && (
          <div className="min-h-[200px] flex items-center justify-center text-red-500">
            {error}
          </div>
        )}

        {!loading && data && (
          <div className="max-w-2xl p-4">
            <AnalysisCard analysis={data.analysis} rawData={data.rawData} />
          </div>
        )}

        {/* Floating Button */}
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 px-6 py-3 bg-teal-600 text-white font-semibold rounded-full shadow-lg hover:bg-teal-700 transition flex items-center justify-center"
        >
          <span className="block sm:hidden text-2xl">+</span>
          <span className="hidden sm:block">Share Your Mood</span>
        </button>

        {open && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="relative bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg">
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
              <MoodForm />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
