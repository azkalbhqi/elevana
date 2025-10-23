"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { logOut } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  // Listen for auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/auth/login");
      } else {
        setUser(currentUser);
        const docRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          setForm(snap.data() as any);
        } else {
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
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-700">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-teal-400 flex items-center justify-center text-white text-4xl font-bold">
            {form.fullName ? form.fullName[0].toUpperCase() : "U"}
          </div>
          <h1 className="text-3xl font-bold mt-4 text-gray-800">
            {form.fullName || "Your Name"}
          </h1>
          <p className="text-gray-500">{form.email}</p>
        </div>

        <div className="space-y-4 text-gray-700">
          <div className="flex justify-between">
            <span className="font-semibold">Phone</span>
            <span>{form.phone || "Not set"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Address</span>
            <span className="text-right w-1/2">{form.address || "Not set"}</span>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-lg shadow-md"
          >
            Edit Profile
          </button>
          <button
            onClick={async () => {
              await logOut();
              router.push("/auth/login");
            }}
            className="bg-red-500 hover:bg-red-600 transition text-white px-5 py-2 rounded-lg shadow-md"
          >
            Logout
          </button>
        </div>
      </motion.div>

      {/* Modal Edit Profile */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Edit Profile
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({ ...form, fullName: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Phone
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Address
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
