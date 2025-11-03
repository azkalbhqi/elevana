import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Doctor {
  id: string;
  name: string;
  experience: string;
  rating: number;
  reviews: number;
  isOnline: boolean;
  imageUrl: string;
  createdAt: string;
}

export function useDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "online" | "none">("none");

  // 🔹 Fetch doctors data from Firestore
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "doctors"));
        const doctorList: Doctor[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Doctor[];

        setTimeout(() => {
          setDoctors(doctorList);
          setLoading(false);
        }, 600);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError("Failed to fetch doctors");
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // 🔹 Derived filtered and sorted doctors
  const filteredDoctors = doctors
    .filter((doc) => doc.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "online")
        return (b.isOnline ? 1 : 0) - (a.isOnline ? 1 : 0);
      return 0;
    });

  return {
    doctors,
    filteredDoctors,
    loading,
    error,
    search,
    setSearch,
    sortBy,
    setSortBy,
  };
}
