"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// tipe mood
type Mood = {
  id: string;
  mood: "mad" | "sad" | "normal" | "happy" | "superhappy";
  description: string;
  createdAt: Date;
};

const moodIcons: Record<Mood["mood"], string> = {
  mad: "😡",
  sad: "😢",
  normal: "😐",
  happy: "😊",
  superhappy: "🤩",
};

export default function MoodCalendar() {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const ref = collection(db, "users", user.uid, "moods");
      const querySnapshot = await getDocs(ref);

      const data: Mood[] = querySnapshot.docs.map((doc) => {
        const d = doc.data();
        const created =
          d.createdAt?.toDate?.() instanceof Date
            ? d.createdAt.toDate()
            : new Date(d.createdAt || Date.now());

        return {
          id: doc.id,
          mood: d.mood,
          description: d.description,
          createdAt: created,
        };
      });

      setMoods(data);
    });

    return () => unsubscribe();
  }, []);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay(); // offset hari pertama

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

  return (
    <div className="h-full w-full bg-white border-r border-gray-200 p-4 flex flex-col overflow-y-auto">
      <h2 className="text-xl font-bold text-teal-800 mb-4">Jurnal Harian</h2>

      {/* Header bulan */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="px-2 py-1 bg-gray-200 rounded">
          ◀
        </button>
        <span className="font-semibold text-lg">
          {monthNames[month]} {year}
        </span>
        <button onClick={nextMonth} className="px-2 py-1 bg-gray-200 rounded">
          ▶
        </button>
      </div>

      {/* Grid kalender */}
      <div className="grid grid-cols-7 gap-2 text-center mb-6">
        {["S", "S", "R", "K", "J", "S", "M"].map((d, i) => (
          <span key={i} className="font-semibold text-gray-600">
            {d}
          </span>
        ))}

        {/* Kosongin sebelum hari pertama */}
        {Array.from({ length: firstDay }, (_, i) => (
          <div key={`empty-${i}`} className="w-10 h-10" />
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const mood = moods.find(
            (m) =>
              m.createdAt.getDate() === day &&
              m.createdAt.getMonth() === month &&
              m.createdAt.getFullYear() === year
          );

          return (
            <div
              key={day}
              className={`w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition 
                ${mood ? "bg-teal-100 hover:bg-teal-200" : "bg-gray-100 hover:bg-gray-200"}`}
              onClick={() => mood && setSelectedMood(mood)}
            >
              {mood ? moodIcons[mood.mood] : day}
            </div>
          );
        })}
      </div>

      {/* Timeline view */}
      <div className="flex-1 overflow-y-auto">
        <h3 className="text-lg font-semibold text-teal-700 mb-2">Timeline</h3>
        <div className="space-y-3">
          {moods
            .filter(
              (m) =>
                m.createdAt.getMonth() === month &&
                m.createdAt.getFullYear() === year
            )
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .map((mood) => (
              <div
                key={mood.id}
                className="p-3 bg-teal-50 rounded-lg shadow-sm cursor-pointer hover:bg-teal-100"
                onClick={() => setSelectedMood(mood)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{moodIcons[mood.mood]}</span>
                  <div>
                    <p className="text-sm text-gray-500">
                      {mood.createdAt.toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p className="font-medium text-gray-800 line-clamp-1">
                      {mood.description || "Tidak ada deskripsi."}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Modal detail mood */}
      {selectedMood && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-md relative">
            <button
              onClick={() => setSelectedMood(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
            <div className="text-5xl mb-4 text-center">
              {moodIcons[selectedMood.mood]}
            </div>
            <h3 className="text-lg font-bold text-teal-800 mb-2 text-center">
              {selectedMood.createdAt.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </h3>
            <p className="text-gray-700 text-center">
              {selectedMood.description || "Tidak ada deskripsi."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
