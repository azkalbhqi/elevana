'use client'
import { motion } from "framer-motion";

export default function Home() {

  return (
    <main className="min-h-screen flex flex-col font-sans text-gray-800 ">
      {/* Hero */}
      <section
        id="home"
        className="h-screen flex flex-col items-center justify-center text-center px-16 pt-32 pb-24 bg-gradient-to-b from-teal-50 to-white"
      >
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-gray-800 mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          ELEVANA: Elevate Your Mind, Embrace Your Peace
        </motion.h1>
        <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl">
          Access tools and resources to support your mental well-being.  
          You’re not alone — start your journey today.
        </p>
        <motion.a
          href="#resources"
          className="px-6 py-3 rounded-2xl bg-teal-600 text-white font-medium shadow-lg hover:bg-teal-700 transition"
          whileHover={{ scale: 1.05 }}
        >
          Explore Resources
        </motion.a>
      </section>

     {/* Key Features */}
      <section
        id="resources"
        className="min-h-screen flex flex-col justify-center px-6 py-16 bg-gradient-to-b from-white to-teal-100"
      >
        <h2 className="text-3xl font-bold text-center mb-10 text-teal-700">
          Our Core Offerings
        </h2>
        <div className="grid md:grid-cols-3 gap-8 px-16">
          {[
            { title: "Guided Meditation", desc: "Relax with expert-led audio sessions.", icon: "🧘" },
            { title: "Therapist Directory", desc: "Connect with licensed professionals.", icon: "👩‍⚕️" },
            { title: "Self-Care Tools", desc: "Daily tips & exercises to build resilience.", icon: "🌱" }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="p-6 rounded-2xl shadow-md bg-white text-center hover:shadow-lg hover:-translate-y-1 transition border border-teal-100"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-teal-700">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-teal-50 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="italic text-gray-700 text-lg mb-6">
            “ELEVANA helped me find peace in my day.”
          </blockquote>
          <p className="text-gray-600 mb-2">Join 10,000+ users finding calm</p>
          <div className="flex justify-center space-x-4">
            <span className="px-4 py-2 rounded-full bg-white shadow text-sm text-gray-600">✅ Certified Mental Health Partner</span>
            <span className="px-4 py-2 rounded-full bg-white shadow text-sm text-gray-600">🌍 Global Wellness Initiative</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-gray-300 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-xl mb-2">ELEVANA</h3>
            <p>Your companion for mental wellness.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="hover:text-white">Home</a></li>
              <li><a href="#resources" className="hover:text-white">Resources</a></li>
              <li><a href="#about" className="hover:text-white">About</a></li>
              <li><a href="#contact" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Contact</h4>
            <p>Email: <a href="mailto:support@elevana.com" className="text-teal-400 hover:underline">support@elevana.com</a></p>
            <p className="mt-2">© {new Date().getFullYear()} ELEVANA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
