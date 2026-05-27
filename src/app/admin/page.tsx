"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import MagneticButton from "@/components/MagneticButton";

export default function AdminLoginPage() {
  const router = useRouter();
  const [adminId, setAdminId] = useState("");
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminId, password: passcode }),
      });
      if (!res.ok) throw new Error("Invalid admin credentials");
      const data = await res.json();
      if (data.role !== "admin") throw new Error("Not an admin account");
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role);
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="absolute top-[30%] left-[40%] w-96 h-96 bg-volt/10 blur-[120px] rounded-full z-0" />
      
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel w-full max-w-sm p-10 relative z-10 border border-white/5">
        <h1 className="text-3xl font-black italic font-serif text-center mb-8 uppercase text-white"><span className="text-stroke">Restricted</span> Access</h1>
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-8 text-xs uppercase tracking-widest text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-widest">Admin ID</label>
            <input required type="password" value={adminId} onChange={(e) => setAdminId(e.target.value)} className="glass-input" />
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-widest">Passcode</label>
            <input required type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} className="glass-input" />
          </div>
          <div className="pt-4">
            <MagneticButton onClick={() => {}} className="w-full !bg-white !text-black hover:!bg-gray-200" variant="ghost">
              {loading ? "Authenticating..." : "Override Protocol"}
            </MagneticButton>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
