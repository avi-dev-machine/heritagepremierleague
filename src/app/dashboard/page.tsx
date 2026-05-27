"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, MapPin, Edit2, Save, X } from "lucide-react";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns";
import { motion } from "framer-motion";
import MagneticButton from "@/components/MagneticButton";

export default function PlayerDashboard() {
  const router = useRouter();
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [formData, setFormData] = useState({ full_name: "", phone: "", department: "", year_of_study: "", about: "" });
  const EVENT_DATE = new Date("2026-06-06T10:00:00+05:30");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    fetchProfile(token);

    const timer = setInterval(() => {
      const now = new Date();
      setTimeLeft({
        days: differenceInDays(EVENT_DATE, now),
        hours: differenceInHours(EVENT_DATE, now) % 24,
        minutes: differenceInMinutes(EVENT_DATE, now) % 60,
        seconds: differenceInSeconds(EVENT_DATE, now) % 60,
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchProfile = async (token: string) => {
    try {
      const res = await fetch("http://localhost:8000/players/me", { headers: { "Authorization": `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setPlayer(data);
        setFormData({ 
          full_name: data.full_name || "", 
          phone: data.phone || "", 
          department: data.department || "", 
          year_of_study: data.year_of_study || "", 
          about: data.about || "" 
        });
      } else router.push("/login");
    } finally { setLoading(false); }
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8000/players/me", {
      method: "PATCH", headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    if (res.ok) { setPlayer(await res.json()); setEditing(false); }
  };

  const handleLogout = () => { localStorage.clear(); router.push("/"); };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-serif text-2xl italic">Loading...</div>;
  if (!player) return null;

  return (
    <div className="min-h-screen p-6 md:p-12 relative overflow-hidden">
      <div className="ambient-orb orb-white top-[-20%] right-[-10%] opacity-10" />
      <div className="ambient-orb orb-volt bottom-[-20%] left-[-10%] opacity-10" />

      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex justify-between items-end border-b border-white/10 pb-6 relative z-10">
          <div>
            <p className="text-[10px] text-volt uppercase tracking-widest mb-2 font-bold">HPL / 2026</p>
            <h1 className="text-3xl md:text-5xl font-black font-serif italic text-white">Player <span className="text-stroke">Dashboard</span></h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm uppercase tracking-widest">
            <LogOut size={16} /> <span className="hidden md:inline">Exit</span>
          </button>
        </header>

        <div className="bento-grid">
          {/* Profile Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="col-span-12 lg:col-span-4 glass-panel p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
            
            <div className="relative mb-8">
              <img src={player.avatar_url || '/globe.svg'} alt="Avatar" className="w-32 h-32 rounded-2xl object-cover border-2 border-volt/30 transition-all duration-500" />
              <div className={`absolute -bottom-3 -right-3 px-4 py-1.5 rounded text-[10px] uppercase tracking-widest font-bold shadow-2xl backdrop-blur-md border ${player.payment_verified ? 'bg-volt/10 border-volt/50 text-volt' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                {player.payment_verified ? 'VERIFIED' : 'UNVERIFIED'}
              </div>
            </div>

            {!editing ? (
              <div className="space-y-6 relative z-10">
                <div>
                  <h2 className="text-3xl font-black font-serif italic text-white">{player.full_name}</h2>
                  <p className="text-xs uppercase tracking-widest text-volt mt-1 font-bold">{player.pref_position_1}</p>
                </div>
                
                <div className="space-y-4">
                  <div><p className="text-[10px] text-gray-500 uppercase tracking-widest">Email</p><p className="text-sm">{player.email}</p></div>
                  <div><p className="text-[10px] text-gray-500 uppercase tracking-widest">Phone</p><p className="text-sm">{player.phone}</p></div>
                  <div><p className="text-[10px] text-gray-500 uppercase tracking-widest">Academic</p><p className="text-sm">{player.department} - {player.year_of_study}</p></div>
                </div>

                <MagneticButton variant="ghost" onClick={() => setEditing(true)} className="!px-0 !justify-start !py-2 text-xs uppercase tracking-widest !text-volt hover:!text-white">
                  <Edit2 size={14} className="mr-2"/> Edit Profile
                </MagneticButton>
              </div>
            ) : (
              <div className="space-y-4 relative z-10">
                <input type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="glass-input text-sm" placeholder="Name" />
                <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="glass-input text-sm" placeholder="Phone" />
                <input type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="glass-input text-sm" placeholder="Dept" />
                <input type="text" value={formData.year_of_study} onChange={e => setFormData({...formData, year_of_study: e.target.value})} className="glass-input text-sm" placeholder="Year" />
                
                <div className="flex gap-4 pt-4">
                  <button onClick={handleUpdate} className="flex-1 bg-white text-black text-xs font-bold uppercase tracking-widest py-3 rounded-lg hover:bg-gray-200 transition-colors">Save</button>
                  <button onClick={() => setEditing(false)} className="px-4 text-gray-500 hover:text-white transition-colors"><X size={20}/></button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Countdown & Map */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-8 md:p-12 flex flex-col justify-center items-center h-[300px] relative overflow-hidden group">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-8 z-10">Time until kickoff</p>
              
              <div className="flex gap-4 md:gap-12 text-center z-10">
                <div className="flex flex-col"><span className="text-5xl md:text-8xl font-black font-serif italic text-volt drop-shadow-[0_0_20px_rgba(204,255,0,0.5)]">{timeLeft.days}</span><span className="text-[10px] text-gray-500 uppercase tracking-widest mt-2 font-bold">Days</span></div>
                <span className="text-5xl md:text-8xl font-black font-serif text-white/20">:</span>
                <div className="flex flex-col"><span className="text-5xl md:text-8xl font-black font-serif italic text-volt drop-shadow-[0_0_20px_rgba(204,255,0,0.5)]">{String(timeLeft.hours).padStart(2, '0')}</span><span className="text-[10px] text-gray-500 uppercase tracking-widest mt-2 font-bold">Hours</span></div>
                <span className="text-5xl md:text-8xl font-black font-serif text-white/20">:</span>
                <div className="flex flex-col"><span className="text-5xl md:text-8xl font-black font-serif italic text-volt drop-shadow-[0_0_20px_rgba(204,255,0,0.5)]">{String(timeLeft.minutes).padStart(2, '0')}</span><span className="text-[10px] text-gray-500 uppercase tracking-widest mt-2 font-bold">Mins</span></div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel p-2 h-[300px] relative flex flex-col overflow-hidden">
               <div className="absolute top-6 left-6 z-10 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                 <MapPin size={14} className="text-volt"/> <span className="text-xs uppercase tracking-widest font-bold">Gods Turf</span>
               </div>
               <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3685.813154466932!2d88.41573221167779!3d22.511192435131424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0273004ad50299%3A0x5261b37ef6bf36e1!2sGod&#39;s%20turf!5e0!3m2!1sen!2sin!4v1779865685150!5m2!1sen!2sin" width="100%" height="100%" style={{ border: 0, borderRadius: '20px', filter: 'grayscale(0.8) contrast(1.2)' }} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="flex-1 w-full h-full"></iframe>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
