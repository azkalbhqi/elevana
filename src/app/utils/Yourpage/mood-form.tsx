"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { motion } from "framer-motion";

// Mood options
const moods = [
  { label: "Mad", icon: "😡", value: "mad" },
  { label: "Sad", icon: "😢", value: "sad" },
  { label: "Normal", icon: "😐", value: "normal" },
  { label: "Happy", icon: "😊", value: "happy" },
  { label: "Super Happy", icon: "🤩", value: "super_happy" },
];

export default function MoodForm() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Listen to auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    if (!user) {
      alert("You must be logged in to submit your mood!");
      return;
    }
    if (!selectedMood) {
      alert("Please select your mood!");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "users", user.uid, "moods"), {
        mood: selectedMood,
        description,
        createdAt: serverTimestamp(),
      });

      alert("Mood saved successfully 🎉");
      setSelectedMood(null);
      setDescription("");
    } catch (err: any) {
      console.error(err);
      alert("Error saving mood: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold text-teal-700 mb-4 text-center">
        How’s your mood today?
      </h2>

      {/* Mood buttons */}
      <div className="flex justify-between mb-6">
        {moods.map((mood) => (
          <motion.button
            key={mood.value}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelectedMood(mood.value)}
            className={`flex flex-col items-center justify-center p-3 rounded-xl transition 
              ${
                selectedMood === mood.value
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
          >
            <span className="text-2xl">{mood.icon}</span>
            <span className="text-sm mt-1">{mood.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Description */}
      <textarea
        placeholder="Write about your day..."
        className="w-full p-3 border rounded-lg text-gray-700 mb-4"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
      />

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg transition disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Mood"}
      </button>
    </div>
  );
}
