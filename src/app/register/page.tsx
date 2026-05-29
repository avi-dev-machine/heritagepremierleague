"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { uploadToCloudinary } from "@/lib/cloudinary";
import TiltCard from "@/components/TiltCard";
import MagneticButton from "@/components/MagneticButton";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

const POSITIONS = ["Attacker", "Midfielder", "Defender", "Goalkeeper"];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: "", phone: "", email: "", password: "",
    year_of_study: "", department: "",
    pref_position_1: "", pref_position_2: "", pref_position_3: "",
    about: "",
  });

  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (e.target.files && e.target.files[0]) setter(e.target.files[0]);
  };

  const validateStep = () => {
    setError("");
    if (step === 1) {
      if (!formData.full_name || !formData.email || !formData.phone || !formData.password) {
        setError("Please fill all required fields in Step 1."); return false;
      }
    } else if (step === 2) {
      if (!formData.department || !formData.year_of_study) {
        setError("Please fill all required fields in Step 2."); return false;
      }
    } else if (step === 3) {
      if (!formData.pref_position_1) {
        setError("First preference position is required."); return false;
      }
    } else if (step === 4) {
      if (!paymentScreenshot || !avatar) {
        setError("Both Payment Screenshot and Avatar are required."); return false;
      }
    }
    return true;
  };

  const nextStep = () => { if (validateStep()) setStep(s => s + 1); };
  const prevStep = () => { setError(""); setStep(s => s - 1); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;
    setLoading(true); setError("");

    try {
      if (!paymentScreenshot || !avatar) throw new Error("Verification media missing.");
      const payment_screenshot = await uploadToCloudinary(paymentScreenshot);
      const avatar_url = await uploadToCloudinary(avatar);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, payment_screenshot, avatar_url }),
      });

      if (!res.ok) {
        const errData = await res.json();
        let errMsg = "Registration failed";
        if (errData.detail) {
          if (typeof errData.detail === "string") {
            errMsg = errData.detail;
          } else if (Array.isArray(errData.detail)) {
            errMsg = errData.detail.map((e: any) => e.msg).join(", ");
          } else {
            errMsg = JSON.stringify(errData.detail);
          }
        }
        throw new Error(errMsg);
      }
      setSuccess(true);
      setTimeout(() => router.push("/login?registered=true"), 3000);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-obsidian">
        <div className="ambient-orb orb-volt top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40 scale-150 animate-pulse" />
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="z-10 text-center flex flex-col items-center">
          <CheckCircle2 size={80} className="text-volt mb-6" />
          <h1 className="text-4xl md:text-6xl font-black font-serif italic mb-4">REGISTRATION <span className="text-stroke">SUBMITTED</span></h1>
          <p className="text-gray-400 tracking-[0.2em] uppercase text-sm">Your verification is under review.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-carbon text-white overflow-hidden">
      <div className="ambient-orb orb-volt top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 scale-150" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="z-10 text-center flex flex-col items-center p-8 md:p-16 bg-black/40 backdrop-blur-md rounded-3xl border border-white/10 max-w-2xl mx-4">
        <h1 className="text-4xl md:text-6xl font-black font-serif italic mb-6">REGISTRATIONS <span className="text-stroke">CLOSED</span></h1>
        <p className="text-gray-400 tracking-[0.2em] uppercase text-sm mb-8 leading-relaxed">
          Thank you for your overwhelming response. The draft registration is now officially closed.
        </p>
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>
      </motion.div>
    </div>
  );
}
