"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2500;
    const intervalTime = 20;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const rawProgress = (currentStep / steps) * 100;
      const easedProgress = 100 - 100 * Math.pow(1 - rawProgress / 100, 3);
      
      if (currentStep >= steps) {
        setProgress(100);
        clearInterval(timer);
        setTimeout(() => {
          setLoading(false);
        }, 600);
      } else {
        setProgress(Math.floor(easedProgress));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  if (!loading) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="preloader"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, y: "-100vh", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-carbon overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551280857-2b9bbe5260fc?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-screen grayscale" />
        <div className="absolute inset-0 noise-overlay opacity-50" />
        <div className="ambient-orb orb-volt top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 scale-[2]" />
        
        <div className="relative z-10 flex flex-col items-center">
          {/* Huge Progress Background Text */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-[25vw] md:text-[20vw] font-black font-serif italic text-white/5 leading-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap blur-sm"
          >
            {progress}
          </motion.div>

          {/* Spinning Neon Soccer Ball */}
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 2, ease: "linear", repeat: Infinity }}
            className="mb-8 relative"
          >
            <div className="absolute inset-0 bg-volt blur-2xl opacity-50 rounded-full scale-150" />
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 text-volt drop-shadow-[0_0_15px_rgba(204,255,0,0.8)]">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
              <path d="M2 12h20"></path>
            </svg>
          </motion.div>

          <h1 className="text-4xl md:text-8xl font-black font-serif italic text-white drop-shadow-2xl z-20 mb-6 relative uppercase">
            <span className="text-stroke">KICK</span> OFF
            <motion.div 
              className="absolute -bottom-2 left-0 h-1 bg-volt shadow-[0_0_15px_rgba(204,255,0,0.6)]"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </h1>
          
          <div className="text-volt font-mono text-xl md:text-3xl tracking-[0.3em] z-20 font-bold drop-shadow-[0_0_10px_rgba(204,255,0,0.5)]">
            {progress.toString().padStart(3, '0')} %
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
