"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import MagneticButton from "@/components/MagneticButton";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const registered = searchParams.get("registered");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Invalid credentials");
      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role);
      router.push(data.role === "admin" ? "/admin/dashboard" : "/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel w-full max-w-md p-10 relative overflow-hidden group">
      <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
      
      <div className="mb-10">
        <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] mb-2">Welcome Back</p>
        <h1 className="text-4xl font-black font-serif italic text-white">Player <span className="text-stroke">Login</span></h1>
      </div>

      {registered && <div className="bg-white/5 border border-white/10 text-white p-4 rounded-xl mb-8 text-xs uppercase tracking-widest text-center">Registration successful! Please login.</div>}
      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 text-xs uppercase tracking-widest text-center">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-widest">Email (or ID)</label>
          <input required type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="glass-input" />
        </div>
        <div>
          <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-widest">Password</label>
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="glass-input" />
        </div>
        
        <div className="pt-4">
           <MagneticButton type="submit" className="w-full" variant={loading ? "ghost" : "primary"} disabled={loading}>
             {loading ? "Authenticating..." : "Enter Portal"}
           </MagneticButton>
        </div>
      </form>

      <div className="mt-8 text-center text-[10px] uppercase tracking-widest text-gray-500">
        Don&apos;t have an account? <Link href="/register" className="text-white hover:underline">Register Now</Link>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="ambient-orb orb-volt bottom-[10%] right-[20%] opacity-10" />
      <Suspense fallback={<div className="font-serif italic text-xl">Loading...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
