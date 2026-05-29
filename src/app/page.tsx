"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import TiltCard from "@/components/TiltCard";
import MagneticButton from "@/components/MagneticButton";
import { ArrowRight, Trophy, Users, Calendar, MapPin, Banknote } from "lucide-react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 100]);
  
  return (
    <div ref={containerRef} className="min-h-[250vh] relative bg-carbon text-white overflow-hidden">
      
      {/* ─────────────────────────────────────────────────────────
          SECTION 1: HERO
      ───────────────────────────────────────────────────────── */}
      <motion.section 
        style={{ opacity: heroOpacity, y: heroY }}
        className="h-screen sticky top-0 flex flex-col justify-center items-center text-center px-4 sm:px-6 overflow-hidden"
      >
        {/* Background Video Layer */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover opacity-50 mix-blend-lighten grayscale-[0.2]"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          {/* Aggressive gradient overlay to make text pop */}
          <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-carbon/50 to-transparent" />
        </div>

        <div className="ambient-orb orb-volt top-[-10%] left-[-10%] opacity-20 scale-[2]" />
        
        {/* Pitch Lines Decoration */}
        <div className="absolute bottom-0 w-full h-[40vh] border-t-2 border-white/10 [transform:perspective(500px)_rotateX(70deg)] opacity-30 z-0">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-48 h-48 border-2 border-white/10 rounded-full -translate-y-1/2" />
          <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-0 border-l-2 border-white/10" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="z-10 w-full max-w-7xl mx-auto flex flex-col items-center"
        >
          <p className="tracking-[0.5em] uppercase text-xs md:text-sm text-volt mb-6 font-bold flex items-center justify-center gap-4">
            <span className="w-8 h-[2px] bg-volt" /> THE ULTIMATE FRANCHISE DRAFT <span className="w-8 h-[2px] bg-volt" />
          </p>
          <h1 className="text-[12vw] sm:text-[10vw] md:text-[9vw] leading-[0.85] tracking-tighter mb-6 relative">
            <span className="font-serif italic font-black text-stroke">HERITAGE</span>
            <br />
            <span className="font-black text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">PREMIER</span>
            <br />
            <span className="font-serif italic text-volt drop-shadow-[0_0_40px_rgba(204,255,0,0.3)]">LEAGUE</span>
          </h1>
          <p className="text-sm md:text-lg tracking-[0.2em] uppercase text-gray-400 font-light mt-10 max-w-2xl mx-auto border-l-2 border-volt pl-4 text-left">
            Honor the past. <span className="text-white font-bold">Play for the legacy.</span>
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center items-center w-full">
            <div className="w-full sm:w-auto py-4 px-8 sm:px-12 text-sm uppercase tracking-widest font-black text-gray-400 border border-gray-600/50 rounded-full bg-white/5 text-center">
              REGISTRATIONS ARE CLOSED. THANK YOU.
            </div>
            <Link href="/login" className="w-full sm:w-auto">
              <MagneticButton variant="ghost" className="!py-4 !px-8 sm:!px-12 text-sm uppercase tracking-widest font-bold !text-white hover:!text-volt w-full sm:w-auto">
                PLAYER LOGIN
              </MagneticButton>
            </Link>
          </div>
        </motion.div>
      </motion.section>

      {/* ─────────────────────────────────────────────────────────
          SECTION 2: TOURNAMENT DETAILS (BENTO GRID)
      ───────────────────────────────────────────────────────── */}
      <section className="min-h-screen relative z-20 py-20 md:py-32 px-4 sm:px-6">
        <div className="absolute inset-0 bg-carbon" />
        
        {/* Dynamic footballer silhouette overlay */}
        <div className="absolute inset-y-0 right-0 w-[60%] bg-[url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1500&auto=format&fit=crop')] bg-cover bg-left opacity-[0.03] mix-blend-screen grayscale" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mb-16 md:mb-24 text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-8"
          >
            <div>
              <h2 className="text-4xl md:text-7xl font-black font-serif italic mb-4">THE <span className="text-stroke">ARENA</span></h2>
              <p className="text-gray-400 uppercase tracking-widest text-sm font-bold"><span className="text-volt">•</span> Where legends are drafted.</p>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-volt font-mono text-xl">HPL / 2026</p>
            </div>
          </motion.div>

          <div className="bento-grid">
            <TiltCard className="col-span-12 lg:col-span-8 glass-panel p-8 md:p-12 relative overflow-hidden group border-white/5 bg-white/[0.01]">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518605368461-1ee7cece22a1?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity mix-blend-overlay grayscale" />
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-volt/10 rounded-full blur-[100px] group-hover:bg-volt/20 transition-colors" />
              <div className="relative z-10 flex flex-col justify-between h-full min-h-[300px]">
                <Calendar size={40} className="text-volt mb-8" />
                <div>
                  <h3 className="text-4xl md:text-6xl font-black font-serif italic mb-2">June 6, 2026</h3>
                  <p className="text-sm uppercase tracking-widest text-gray-400 font-bold">Tournament Kickoff</p>
                </div>
              </div>
            </TiltCard>

            <TiltCard className="col-span-12 lg:col-span-4 glass-panel p-8 md:p-12 relative overflow-hidden group border-white/5 bg-white/[0.01]">
              <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-white/5 rounded-full blur-[80px] group-hover:bg-white/10 transition-colors" />
              <div className="relative z-10 flex flex-col justify-between h-full min-h-[300px]">
                <MapPin size={40} className="text-white mb-8" />
                <div>
                  <h3 className="text-3xl font-black mb-2">Gods Turf</h3>
                  <p className="text-xs uppercase tracking-widest text-gray-400">Kolkata, India</p>
                </div>
              </div>
            </TiltCard>

            <TiltCard className="col-span-12 md:col-span-6 lg:col-span-4 glass-panel p-8 border-white/5 bg-white/[0.01]">
              <Users size={32} className="text-gray-400 mb-6" />
              <h3 className="text-2xl font-black mb-1">8 Franchises</h3>
              <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Auction Format</p>
            </TiltCard>

            <TiltCard className="col-span-12 md:col-span-6 lg:col-span-4 glass-panel p-8 border-white/5 bg-white/[0.01]">
              <Trophy size={32} className="text-gray-400 mb-6" />
              <h3 className="text-2xl font-black mb-1">League + Knockout</h3>
              <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Tournament Flow</p>
            </TiltCard>

            <TiltCard className="col-span-12 lg:col-span-4 glass-panel p-8 border-volt/20 bg-volt/[0.02]">
              <Banknote size={32} className="text-volt mb-6" />
              <h3 className="text-2xl font-black mb-1">₹250</h3>
              <p className="text-xs uppercase tracking-widest text-volt/70 font-bold">Player Draft Fee</p>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          SECTION 3: REGISTRATION CTA
      ───────────────────────────────────────────────────────── */}
      <section className="min-h-[70vh] relative z-20 flex flex-col justify-center items-center text-center px-4 sm:px-6 border-t border-white/5 bg-carbon overflow-hidden">
        {/* Stadium light beams */}
        <div className="absolute top-0 left-[30%] w-[2px] h-full bg-gradient-to-b from-white/0 via-white/10 to-white/0 transform rotate-[35deg]" />
        <div className="absolute top-0 right-[30%] w-[2px] h-full bg-gradient-to-b from-white/0 via-white/10 to-white/0 transform -rotate-[35deg]" />
        
        {/* Cinematic texture overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551280857-2b9bbe5260fc?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-5 mix-blend-screen grayscale blur-[2px]" />

        <div className="ambient-orb orb-white top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 opacity-[0.05] scale-[2]" />
        
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="z-10 bg-black/40 backdrop-blur-md p-6 sm:p-8 md:p-16 rounded-3xl border border-white/10 w-full max-w-4xl">
          <h2 className="text-3xl sm:text-4xl md:text-7xl font-black font-serif italic mb-6">
            LACE UP YOUR BOOTS.<br/>
            YOUR <span className="text-stroke">LEGACY AWAITS.</span>
          </h2>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <div className="w-full sm:w-auto py-5 px-10 text-sm uppercase tracking-widest font-black text-gray-400 border border-gray-600/50 rounded-full bg-white/5 text-center">
              REGISTRATIONS ARE CLOSED. THANK YOU.
            </div>
            <Link href="/login" className="w-full sm:w-auto">
              <MagneticButton variant="ghost" className="!py-5 !px-10 text-sm uppercase tracking-widest font-bold !text-white hover:!text-volt border border-white/10 w-full sm:w-auto">
                PLAYER LOGIN
              </MagneticButton>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-20 border-t border-white/10 py-12 text-center bg-black">
        <h1 className="text-2xl font-black font-serif italic mb-2 tracking-tighter">HERITAGE PREMIER LEAGUE</h1>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">© 2026. All rights reserved.</p>
      </footer>

    </div>
  );
}
