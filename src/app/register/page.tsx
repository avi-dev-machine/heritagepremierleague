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
    <div className="min-h-screen flex flex-col lg:flex-row relative bg-carbon text-white">
      <div className="ambient-orb orb-volt top-[10%] left-[-10%] opacity-20" />
      <div className="ambient-orb orb-white bottom-[-10%] right-[-10%] opacity-10" />

      {/* Left Pane - Cinematic Storytelling */}
      <div className="lg:w-[40%] lg:h-screen lg:sticky top-0 p-8 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/5 relative z-10 bg-black/40 backdrop-blur-md">
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold mb-4">Draft Registration</p>
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl lg:text-6xl font-black font-serif italic mb-6 leading-[0.9]">
              ENTER<br/><span className="text-stroke">THE LEAGUE</span>
            </h1>
            <p className="text-gray-400 tracking-widest uppercase text-xs mb-12 max-w-sm leading-relaxed border-l-2 border-volt pl-4">
              This isn't just football. This is your franchise story. Fill out your details to enter the auction pool.
            </p>
          </motion.div>
        </div>

        {/* Dynamic Progress Indicator */}
        <div className="space-y-4 mb-8 lg:mb-0">
          <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Step {step} of 4</p>
          <div className="flex gap-2 w-full max-w-[200px]">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-volt' : 'bg-white/10'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Right Pane - Multi-Step Form */}
      <div className="lg:w-[60%] p-6 md:p-12 lg:p-24 relative z-10 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-full max-w-2xl">
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-8 text-xs uppercase tracking-widest text-center font-bold">
              {error}
            </motion.div>
          )}

          <div className="glass-panel p-6 md:p-12 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h3 className="text-2xl font-serif italic border-b border-white/5 pb-4 text-white">01. Personal Info</h3>
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-2 uppercase tracking-widest font-bold">Full Name</label>
                    <input required type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="glass-input" placeholder="e.g. Lionel Messi" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] text-gray-400 mb-2 uppercase tracking-widest font-bold">Email</label>
                      <input required type="email" name="email" value={formData.email} onChange={handleChange} className="glass-input" placeholder="player@example.com" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 mb-2 uppercase tracking-widest font-bold">WhatsApp No.</label>
                      <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="glass-input" placeholder="+91..." />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-2 uppercase tracking-widest font-bold">Dashboard Password</label>
                    <input required type="password" name="password" value={formData.password} onChange={handleChange} className="glass-input" placeholder="••••••••" />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h3 className="text-2xl font-serif italic border-b border-white/5 pb-4 text-white">02. Academic Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] text-gray-400 mb-2 uppercase tracking-widest font-bold">Department</label>
                      <input required type="text" name="department" value={formData.department} onChange={handleChange} className="glass-input" placeholder="e.g. Computer Science" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 mb-2 uppercase tracking-widest font-bold">Year of Study</label>
                      <input required type="text" name="year_of_study" value={formData.year_of_study} onChange={handleChange} className="glass-input" placeholder="e.g. 3rd Year" />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h3 className="text-2xl font-serif italic border-b border-white/5 pb-4 text-white">03. Football Profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((num) => (
                      <div key={num}>
                        <label className="block text-[10px] text-gray-400 mb-2 uppercase tracking-widest font-bold">Pref {num} {num===1&&"*"}</label>
                        <select name={`pref_position_${num}`} value={(formData as any)[`pref_position_${num}`]} onChange={handleChange} className="glass-input px-3 py-4 text-sm bg-black/50">
                          <option value="">Select...</option>
                          {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 mb-2 uppercase tracking-widest font-bold">About Your Playstyle</label>
                    <textarea name="about" value={formData.about} onChange={handleChange} rows={4} className="glass-input resize-none" placeholder="Describe your strengths, mentality, or football journey..." />
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <h3 className="text-2xl font-serif italic border-b border-white/5 pb-4 text-white">04. Verification & Fee</h3>
                  
                  <div className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-white/5 p-6 rounded-2xl border border-white/10">
                    <TiltCard className="shrink-0 bg-white p-3 rounded-xl">
                      <div className="w-32 h-32 relative">
                        <Image src="/upi2.png" alt="UPI QR Code" fill sizes="128px" className="object-contain" />
                      </div>
                    </TiltCard>
                    <div className="text-center md:text-left space-y-4">
                      <p className="text-xl font-serif italic text-white">Entry Fee: <span className="text-volt font-black">₹250</span></p>
                      <p className="text-xs text-gray-400 uppercase tracking-widest leading-relaxed">Scan the QR code to pay the draft fee. Your application will only be verified after payment confirmation.</p>
                    </div>
                  </div>

                  <div className="space-y-6 pt-4">
                    <div>
                      <label className="block text-[10px] text-gray-400 mb-3 uppercase tracking-widest font-bold">Upload Payment Screenshot *</label>
                      <input required type="file" accept="image/*" onChange={(e) => handleFileChange(e, setPaymentScreenshot)} className="w-full text-sm text-gray-400 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-[10px] file:uppercase file:tracking-widest file:font-bold file:bg-volt/20 file:text-volt hover:file:bg-volt/30 transition-colors cursor-pointer border border-dashed border-white/20 p-4 rounded-xl" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 mb-3 uppercase tracking-widest font-bold">Upload Face Photo (Draft Avatar) *</label>
                      <input required type="file" accept="image/*" onChange={(e) => handleFileChange(e, setAvatar)} className="w-full text-sm text-gray-400 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-[10px] file:uppercase file:tracking-widest file:font-bold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-colors cursor-pointer border border-dashed border-white/20 p-4 rounded-xl" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Navigation */}
            <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-6">
              <button 
                type="button" 
                onClick={prevStep} 
                className={`flex items-center gap-2 text-xs uppercase tracking-widest font-bold transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:text-white'}`}
              >
                <ArrowLeft size={16} /> Back
              </button>
              
              {step < 4 ? (
                <MagneticButton type="button" onClick={nextStep} variant="primary" className="!py-3 !px-8 text-xs">
                  Next Step <ArrowRight size={16} className="ml-2 inline" />
                </MagneticButton>
              ) : (
                <MagneticButton type="button" onClick={handleSubmit} variant={loading ? "ghost" : "primary"} className="!py-3 !px-8 text-xs">
                  {loading ? "Processing..." : "Submit to Draft"}
                </MagneticButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
