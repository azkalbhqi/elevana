"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { logOut } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();

  // Listen for auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/auth/login");
      } else {
        setUser(currentUser);

        // Load profile from Firestore
        const docRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          setForm(snap.data() as any);
        } else {
          // initialize with email
          setForm({
            fullName: currentUser.displayName || "",
            email: currentUser.email || "",
            phone: "",
            address: "",
          });
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSave = async () => {
    if (!user) return;

    await setDoc(doc(db, "users", user.uid), form, { merge: true });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">About</h1>

        <div className="space-y-4">
          {/* Full Name */}
          <div className="flex justify-between text-gray-700">
            <span className="font-medium text-gray-700">Full Name</span>
            {isEditing ? (
              <input
                type="text"
                className="border rounded px-2 py-1 w-2/3"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            ) : (
              <span>{form.fullName || "Not set"}</span>
            )}
          </div>

          {/* Email */}
          <div className="flex justify-between text-gray-700">
            <span className="font-medium text-gray-600">Email</span>
            <span>{form.email}</span>
          </div>

          {/* Phone */}
          <div className="flex justify-between text-gray-700">
            <span className="font-medium text-gray-600">Phone</span>
            {isEditing ? (
              <input
                type="text"
                className="border rounded px-2 py-1 w-2/3"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            ) : (
              <span>{form.phone || "Not set"}</span>
            )}
          </div>

          {/* Address */}
          <div className="flex justify-between text-gray-700">
            <span className="font-medium text-gray-700">Address</span>
            {isEditing ? (
              <input
                type="text"
                className="border rounded px-2 py-1 w-2/3"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />
            ) : (
              <span>{form.address || "Not set"}</span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex justify-between text-gray-700">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Edit
            </button>
          )}

          <button
            onClick={async () => {
              await logOut();
              router.push("/auth/login");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
