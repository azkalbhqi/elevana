"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase"; // pastikan sudah setup Firebase Auth
import { onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="text-2xl font-bold text-teal-600">ELEVANA</div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 text-gray-700 font-medium items-center">
          <Link href="/" className="hover:text-teal-600">Home</Link>
          <Link href="/your-page" className="hover:text-teal-600">Your Page</Link>
          <Link href="/consult" className="hover:text-teal-600">Consult</Link>
          <Link href="/story" className="hover:text-teal-600">Story</Link>
          <Link href="/profile" className="hover:text-teal-600">Profile</Link>

          {/* Login / Logout */}
          {user ? (
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/auth/login"
              className="ml-4 px-4 py-2 rounded bg-teal-600 text-white hover:bg-teal-700"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden p-2 text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white text-gray-700 border-t shadow-md">
          <nav className="flex flex-col items-center py-4 space-y-4">
            <Link href="/" className="hover:text-teal-600">Home</Link>
            <Link href="/your-page" className="hover:text-teal-600">Your Page</Link>
            <Link href="/consult" className="hover:text-teal-600">Consult</Link>
            <Link href="/story" className="hover:text-teal-600">Story</Link>
            <Link href="/profile" className="hover:text-teal-600">Profile</Link>

            {/* Login / Logout Mobile */}
            {user ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded bg-teal-600 text-white hover:bg-teal-700"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
