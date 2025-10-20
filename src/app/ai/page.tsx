"use client";

import { useState, useEffect, useRef } from "react";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function AiPage() {
  const [user, setUser] = useState<any>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState<{ role: string; text: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ✅ Pantau perubahan user login
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  // ✅ Ambil chat lama dari Firestore
  useEffect(() => {
    if (!user?.uid) return;

    const fetchChats = async () => {
      const docRef = doc(db, "aiChat", user.uid);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        setChats(snapshot.data().chat || []);
      } else {
        await setDoc(docRef, { chat: [] });
      }
    };

    fetchChats();
  }, [user?.uid]);

  // ✅ Auto scroll ke bawah tiap ada pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, loading]);

  // ✅ Kirim pesan dan simpan ke Firestore
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !user?.uid) return;

    const userMsg = { role: "user", text: input };
    setChats((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();
      const aiMsg = { role: "ai", text: data.text };

      setChats((prev) => [...prev, aiMsg]);

      const docRef = doc(db, "aiChat", user.uid);
      await setDoc(
        docRef,
        { chat: arrayUnion(userMsg, aiMsg) },
        { merge: true }
      );
    } catch (err) {
      console.error(err);
      setChats((prev) => [
        ...prev,
        { role: "ai", text: "⚠️ Terjadi kesalahan." },
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  }

  return (
    <div className="flex flex-col justify-between min-h-screen bg-gradient-to-b from-teal-100 to-white">
    {/* Chat container */}
    <div className="w-full max-w-2xl mx-auto flex flex-col space-y-4 flex-1 py-10">
    {/* Jika belum ada chat, tampilkan hero text */}
    {chats.length === 0 && !loading ? (
      <div className="flex flex-col items-center justify-center text-center flex-1 text-gray-700">
        <h1 className="text-2xl md:text-3xl font-semibold text-teal-600">
          Hello I’m <span className="text-teal-500 font-bold">Elevana Ai</span>
        </h1>
        <p className="text-gray-500 mt-2">Ask me Anything</p>
      </div>
    ) : (
      <>
        {chats.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-3 rounded-2xl shadow-md text-sm md:text-base max-w-[75%] transition-all duration-300 ${
                msg.role === "user"
                  ? "bg-teal-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 text-gray-500 px-4 py-3 rounded-2xl max-w-[70%] shadow-sm animate-pulse">
              Mengetik...
            </div>
          </div>
        )}

        {/* Ref untuk auto scroll */}
        <div ref={messagesEndRef} />
      </>
    )}
  </div>
  

      {/* Input area */}
      <form
        onSubmit={handleSubmit}
        className="w-full flex justify-center items-center p-3 bg-white sticky bottom-0"
      >
        <div className="flex items-center gap-2 w-full max-w-md">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Elevana Ai..."
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-teal-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-teal-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>

    </div>
  );
}
