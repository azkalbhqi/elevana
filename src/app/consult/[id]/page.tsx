"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface Doctor {
  id: string;
  name: string;
  experience: string;
  rating: number;
  reviews: number;
  isOnline: boolean;
  imageUrl: string;
  desc : string;
}

export default function DoctorDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchDoctor = async () => {
      try {
        const docRef = doc(db, "doctors", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as Omit<Doctor, "id">;
          setDoctor({ id: docSnap.id, ...data });
        } else {
          setDoctor(null);
        }
      } catch (error) {
        console.error("Error fetching doctor:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading doctor data...
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Doctor not found.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-auto p-6 bg-white rounded-2xl shadow-md">
       <button
          onClick={() => router.push('/consult')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 text-gray-700 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium"></span>
    </button>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <img
          src={doctor.imageUrl}
          alt={doctor.name}
          className="w-40 h-40 object-cover rounded-full border-4 border-blue-200"
        />
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">{doctor.name}</h1>
          <p className="text-gray-500 mt-1">Experienced in {doctor.experience}</p>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-yellow-500 text-lg">⭐ {doctor.rating}</span>
            <span className="text-gray-500 text-sm">
              ({doctor.reviews} reviews)
            </span>
          </div>
          <div className="mt-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                doctor.isOnline
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {doctor.isOnline ? "Online Now" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t pt-4">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">About Doctor</h2>
        <p className="text-gray-600 leading-relaxed">
          {doctor.desc}.
        </p>
      </div>
    </div>
  );
}
