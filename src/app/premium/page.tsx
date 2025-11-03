"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Banknote, Lock } from "lucide-react";
import Swal from "sweetalert2";

export default function PremiumPage() {
  const router = useRouter();

  const priceMap: any = {
    monthly: { basic: 99000, pro: 299000, enterprise: 699000 },
    annual: { basic: 1500000, pro: 3000000, enterprise: 5000000 },
  };

  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [plan, setPlan] = useState<"basic" | "pro" | "enterprise">("pro");
  const [selected, setSelected] = useState("card");
  const [price, setPrice] = useState<number>(priceMap[billing][plan]);

  useEffect(() => {
    setPrice(priceMap[billing][plan]);
  }, [plan, billing]);

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

  const handlePayment = async () => {
    Swal.fire({
      title: "Processing your payment...",
      text: "Please wait a moment",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Simulate delay for payment process
    setTimeout(() => {
      Swal.fire({
        icon: "success",
        title: "Payment Successful!",
        text: `Your ${plan.toUpperCase()} plan is now active.`,
        confirmButtonColor: "#0d9488", // teal
        confirmButtonText: "Go to Dashboard",
      }).then(() => {
        router.push("/your-page");
      });
    }, 1800);
  };

  return (
    <section className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-200 grid md:grid-cols-2 gap-10 p-10"
      >
        {/* LEFT SIDE - Options */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Choose your plan
          </h2>

          {/* Plan selector */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {["basic", "pro", "enterprise"].map((p) => (
              <button
                key={p}
                onClick={() => setPlan(p as any)}
                className={`py-2.5 rounded-lg font-medium capitalize transition border ${
                  plan === p
                    ? "bg-teal-600 text-white border-teal-600"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Billing toggle */}
          <div className="bg-gray-100 rounded-full p-1 flex mb-8 w-fit">
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

          {/* Payment Options */}
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Payment options
          </h2>
          <div className="space-y-3">
            {["apple", "google", "card", "bank"].map((option) => (
              <button
                key={option}
                onClick={() => setSelected(option)}
                className={`w-full border rounded-lg py-3 font-medium flex justify-between px-3 transition ${
                  selected === option
                    ? "border-teal-600 bg-teal-50 text-teal-700"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                {option === "card" ? (
                  <div className="flex items-center gap-2">
                    <CreditCard size={18} />
                    <span>Pay by card</span>
                  </div>
                ) : option === "bank" ? (
                  <div className="flex items-center gap-2">
                    <Banknote size={18} />
                    <span>Internet banking</span>
                  </div>
                ) : (
                  <span className="capitalize">{option} Pay</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE - Summary */}
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Total price
            </h2>
            <p className="text-3xl font-bold text-gray-900">{formattedPrice}</p>
            <p className="text-gray-500 text-sm mt-1">
              {billing === "monthly" ? "per month" : "per year"}
            </p>

            <div className="mt-6 flex items-start gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <Lock className="text-teal-600 flex-shrink-0 mt-0.5" size={18} />
              <p>
                Your payment is 100% safe and secure. We use encryption to
                protect your data and only work with verified gateways.
              </p>
            </div>
          </div>

          <motion.button
            onClick={handlePayment}
            whileTap={{ scale: 0.96 }}
            className="mt-8 w-full py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition"
          >
            Continue →
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
