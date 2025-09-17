"use client";

import { useState, useEffect } from "react";
import { signUp, logIn, logOut } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) router.push("/");
    });
    return () => unsubscribe();
  }, [router]);

  const handleAuth = async () => {
    try {
      if (isRegister) {
        const res = await signUp(email, password);
        setUser(res.user);
      } else {
        const res = await logIn(email, password);
        setUser(res.user);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-96"
      >
        <h1 className="text-2xl font-bold text-teal-700 mb-6 text-center">
          {isRegister ? "Create Account" : "Login"}
        </h1>

        {!user ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={isRegister ? "register" : "login"}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.35 }}
            >
              <input
                type="email"
                placeholder="Email"
                className="w-full mb-3 p-2 border rounded-lg text-gray-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full mb-3 p-2 border rounded-lg text-gray-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                onClick={handleAuth}
                className="w-full bg-teal-600 text-white py-2 rounded-lg shadow-md hover:bg-teal-700 transition"
              >
                {isRegister ? "Sign Up" : "Login"}
              </motion.button>

              <p className="text-sm mt-4 text-gray-600 text-center">
                {isRegister
                  ? "Already have an account?"
                  : "Don’t have an account?"}{" "}
                <span
                  className="text-teal-600 cursor-pointer font-medium"
                  onClick={() => setIsRegister(!isRegister)}
                >
                  {isRegister ? "Login here" : "Register here"}
                </span>
              </p>
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <p className="mb-4 text-gray-700">Welcome, {user.email}</p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={async () => {
                await logOut();
                setUser(null);
              }}
              className="w-full bg-red-500 text-white py-2 rounded-lg shadow-md hover:bg-red-600 transition"
            >
              Logout
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
