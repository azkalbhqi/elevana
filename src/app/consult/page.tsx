"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Doctors`);
        if (!res.ok) throw new Error("Failed to fetch doctors");

        const data: Doctor[] = await res.json();
        setDoctors(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error:", err);
      } finally {
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
    <div className="min-h-screen bg-teal-50 px-6 py-12 mt-10">
      <h1 className="text-3xl font-bold text-center text-teal-800 mb-10">
        Meet Our Doctors
      </h1>

      {/* Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-6xl mx-auto mb-8">
        {/* Search */}
        <input
          type="text"
          placeholder="Search doctor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-xl text-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
        />

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as "rating" | "online" | "none")
          }
          className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-xl text-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          <option value="none">Sort By</option>
          <option value="rating">Highest Rating</option>
          <option value="online">Online First</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading doctors...</p>
      ) : filteredDoctors.length === 0 ? (
        <p className="text-center text-gray-600">No doctors available</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {filteredDoctors.map((doc) => (
            <Link href={`/consult/${doc.id}`} key={doc.id}>
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
          ))}
        </div>
      )}
    </div>
  );
}
