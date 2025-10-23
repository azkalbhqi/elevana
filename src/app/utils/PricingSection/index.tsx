"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

export default function PricingSection() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  const prices = {
    monthly: {
      basic: "Rp99.000",
      pro: "Rp299.000",
      enterprise: "Rp699.000",
    },
    annual: {
      basic: "Rp1.500.000",
      pro: "Rp3.000.000",
      enterprise: "Rp5.000.000",
    },
  };

  return (
    <section className="py-20 px-6 ">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold text-gray-900"
        >
          Clear and Fair Pricing for Everyone.
        </motion.h2>
        <p className="mt-3 text-gray-600">
          Choose a plan that fits your needs — upgrade anytime.
        </p>

        {/* Billing Toggle */}
        <div className="mt-8 flex justify-center">
          <div className="bg-gray-100 rounded-full p-1 flex">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
                billing === "monthly"
                  ? "bg-white text-gray-900 shadow"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
                billing === "annual"
                  ? "bg-white text-gray-900 shadow"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Annual
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Basic */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 flex flex-col"
          >
            <h3 className="text-lg font-semibold text-gray-900">Basic</h3>
            <p className="text-gray-500 text-sm mt-1">
              Perfect for individuals and small teams.
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={billing}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.4 }}
                className="mt-6"
              >
                <span className="text-4xl font-bold text-gray-900">
                  {prices[billing].basic}
                </span>
                <span className="text-gray-500 text-sm ml-1">
                  {billing === "monthly" ? "/month" : "/year"}
                </span>
              </motion.div>
            </AnimatePresence>
            <ul className="mt-6 space-y-3 text-sm text-gray-600 flex-1">
              <li className="flex items-center gap-2">
                <Check className="text-teal-500" size={16} /> 1 project access
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-teal-500" size={16} /> Basic analytics
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-teal-500" size={16} /> Email support
              </li>
            </ul>
            <button className="mt-8 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition">
              Current Plan
            </button>
          </motion.div>

          {/* Pro (Highlighted) */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-2 border-teal-600 rounded-2xl shadow-lg p-8 relative flex flex-col"
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-teal-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                Most Popular
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Pro</h3>
            <p className="text-gray-500 text-sm mt-1">
              For professionals who want more control.
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={billing}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.4 }}
                className="mt-6"
              >
                <span className="text-4xl font-bold text-gray-900">
                  {prices[billing].pro}
                </span>
                <span className="text-gray-500 text-sm ml-1">
                  {billing === "monthly" ? "/month" : "/year"}
                </span>
              </motion.div>
            </AnimatePresence>
            <ul className="mt-6 space-y-3 text-sm text-gray-600 flex-1">
              <li className="flex items-center gap-2">
                <Check className="text-teal-500" size={16} /> Up to 10 projects
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-teal-500" size={16} /> Advanced analytics
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-teal-500" size={16} /> Priority support
              </li>
            </ul>
            <button className="mt-8 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition">
              Upgrade to Pro
            </button>
          </motion.div>

          {/* Enterprise */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 flex flex-col"
          >
            <h3 className="text-lg font-semibold text-gray-900">Enterprise</h3>
            <p className="text-gray-500 text-sm mt-1">
              Best for organizations needing full power.
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={billing}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.4 }}
                className="mt-6"
              >
                <span className="text-4xl font-bold text-gray-900">
                  {prices[billing].enterprise}
                </span>
                <span className="text-gray-500 text-sm ml-1">
                  {billing === "monthly" ? "/month" : "/year"}
                </span>
              </motion.div>
            </AnimatePresence>
            <ul className="mt-6 space-y-3 text-sm text-gray-600 flex-1">
              <li className="flex items-center gap-2">
                <Check className="text-teal-500" size={16} /> Unlimited projects
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-teal-500" size={16} /> Custom integrations
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-teal-500" size={16} /> Dedicated manager
              </li>
            </ul>
            <button className="mt-8 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition">
              Upgrade to Premium
            </button>
          </motion.div>
        </div>

        <p className="mt-10 text-sm text-gray-500">
          30-day money-back guarantee on all plans.
        </p>
      </div>
    </section>
  );
}
