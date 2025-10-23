"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MessageCircle } from "lucide-react";
import DoctorCard from "../utils/doctor-card";

interface Doctor {
  id: string;
  name: string;
  experience: string;
  rating: number;
  reviews: number;
  isOnline: boolean;
  imageUrl: string;
  createdAt: string;
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "online" | "none">("none");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "doctors"));
        const doctorList: Doctor[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Doctor[];
        setTimeout(() => {
          // smooth transition delay
          setDoctors(doctorList);
          setLoading(false);
        }, 600);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors
    .filter((doc) => doc.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "online")
        return (b.isOnline ? 1 : 0) - (a.isOnline ? 1 : 0);
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white px-6 py-12 mt-10">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-center text-teal-800 mb-10"
      >
        Meet Our Doctors
      </motion.h1>

      {/* Search & Sort Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-6xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Search doctor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-xl text-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
        />

        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as "rating" | "online" | "none")
          }
          className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-xl text-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
        >
          <option value="none">Sort By</option>
          <option value="rating">Highest Rating</option>
          <option value="online">Online First</option>
        </select>
      </div>

      {/* Floating Chat Button */}
      <Link
        href="/ai"
        className="fixed bottom-10 right-10 bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-105"
      >
        <MessageCircle size={20} />
        <span className="font-medium">Consult with AI</span>
      </Link>

      {/* Loading Skeletons */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4"
              >
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
                <div className="flex justify-center gap-2 mt-4">
                  <div className="h-3 bg-gray-200 rounded w-10" />
                  <div className="h-3 bg-gray-200 rounded w-10" />
                </div>
              </div>
            ))}
        </div>
      ) : filteredDoctors.length === 0 ? (
        <p className="text-center text-gray-600 mt-10">
          No doctors available
        </p>
      ) : (
        <motion.div
          layout
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
        >
          <AnimatePresence>
            {filteredDoctors.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link href={`/consult/${doc.id}`}>
                  <DoctorCard
                    name={doc.name}
                    experience={`Berpengalaman ${doc.experience}`}
                    rating={doc.rating}
                    reviews={doc.reviews}
                    isOnline={doc.isOnline}
                    imageUrl={doc.imageUrl}
                    onChatClick={() => alert(`Chat with ${doc.name}`)}
                  />
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
