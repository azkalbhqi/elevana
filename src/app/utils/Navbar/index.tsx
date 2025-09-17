'use client'
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Navbar = () =>{
    
    const [menuOpen, setMenuOpen] = useState(false);
    return(
        <header className="w-full fixed top-0 left-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
            {/* Logo */}
            <div className="text-2xl font-bold text-teal-600">ELEVANA</div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
                <Link href="/" className="hover:text-teal-600">Home</Link>
                <Link href="/your-page" className="hover:text-teal-600">Your Page</Link>
                <Link href="/consult" className="hover:text-teal-600">Consult</Link>
                <Link href="/story" className="hover:text-teal-600">Story</Link>
                <Link href="/profile" className="hover:text-teal-600">Profile</Link>
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
                    <Link href="/your-page" className="hover:text-teal-600">Resources</Link>
                    <Link href="/consult" className="hover:text-teal-600">About</Link>
                    <Link href="/story" className="hover:text-teal-600">Contact</Link>
                    <Link href="/profile" className="hover:text-teal-600">Profile</Link>
                </nav>
            </div>
            )}
            </header>
    )
}


export default Navbar;

