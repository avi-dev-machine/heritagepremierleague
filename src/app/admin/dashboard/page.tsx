"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, LogOut, Eye } from "lucide-react";
import { motion } from "framer-motion";
import MagneticButton from "@/components/MagneticButton";

export default function AdminDashboard() {
  const router = useRouter();
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") { router.push("/admin"); return; }
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const token = localStorage.getItem("token");
`${process.env.NEXT_PUBLIC_API_URL}/admin/players`, { headers: { `Authorization": `Bearer ${token}` } });
      if (res.ok) setPlayers(await res.json());
    } finally { setLoading(false); }
  };

  const handleAction = async (playerId: string, action: "verify" | "reject") => {
    try {
      const token = localStorage.getItem("token");
      const endpoint = action === "verify" ? "/admin/verify-player" : "/admin/reject-player";
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ player_id: playerId })
      });
      if (res.ok) { fetchPlayers(); if (selectedPlayer?.id === playerId) setSelectedPlayer(null); } 
      else { const err = await res.json(); alert(err.detail || `Failed to ${action} player`); }
    } catch (e) { alert("Network error"); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-serif text-2xl italic">Loading...</div>;

  return (
    <div className="min-h-screen p-6 md:p-12 relative">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex justify-between items-end pb-6 border-b border-white/10">
          <div>
            <p className="text-[10px] text-volt uppercase tracking-widest mb-2 font-bold">Command Center</p>
            <h1 className="text-3xl md:text-5xl font-black font-serif italic text-white"><span className="text-stroke">Admin</span> Dashboard</h1>
          </div>
          <button onClick={() => { localStorage.clear(); router.push("/"); }} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs uppercase tracking-widest font-bold">
            <LogOut size={16} /> Exit
          </button>
        </header>

        <div className="glass-panel overflow-x-auto p-4 md:p-8">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="text-[10px] text-gray-500 uppercase tracking-widest border-b border-white/10">
                <th className="pb-4 font-normal">Name</th>
                <th className="pb-4 font-normal">Dept / Year</th>
                <th className="pb-4 font-normal">Status</th>
                <th className="pb-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {players.map(p => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <td className="py-4 font-serif text-lg">{p.full_name}</td>
                  <td className="py-4 text-gray-400">{p.department} - {p.year_of_study}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold border ${p.payment_verified ? 'bg-volt/10 border-volt/30 text-volt shadow-[0_0_10px_rgba(204,255,0,0.2)]' : p.auction_status === 'rejected' ? 'bg-red-900/20 border-red-900/50 text-red-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                      {p.payment_verified ? 'VERIFIED' : p.auction_status === 'rejected' ? 'REJECTED' : 'UNVERIFIED'}
                    </span>
                  </td>
                  <td className="py-4 flex gap-3 justify-end opacity-50 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setSelectedPlayer(p)} className="text-gray-400 hover:text-white"><Eye size={18} /></button>
                    {!p.payment_verified && p.auction_status !== 'rejected' && (
                      <>
                        <button onClick={() => handleAction(p.id, "verify")} className="text-white hover:text-volt"><Check size={18} /></button>
                        <button onClick={() => handleAction(p.id, "reject")} className="text-red-500 hover:text-red-400"><X size={18} /></button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {players.length === 0 && (
                <tr><td colSpan={4} className="py-12 text-center text-gray-500 font-serif italic text-lg">No registrations found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 md:p-12 relative border border-white/20">
            <button onClick={() => setSelectedPlayer(null)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"><X size={24} /></button>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Player Dossier</p>
            <h2 className="text-4xl font-black font-serif italic mb-10 text-white">{selectedPlayer.full_name}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <img src={selectedPlayer.avatar_url || '/globe.svg'} alt="Avatar" className="w-48 h-48 rounded-2xl object-cover border border-white/10 grayscale hover:grayscale-0 transition-all duration-500" />
                <div><p className="text-[10px] text-gray-500 uppercase tracking-widest">Email</p><p className="font-bold">{selectedPlayer.email}</p></div>
                <div><p className="text-[10px] text-gray-500 uppercase tracking-widest">WhatsApp</p><p className="font-bold">{selectedPlayer.phone}</p></div>
              </div>
              <div className="space-y-6">
                <div><p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Position 1</p><p className="font-serif text-xl italic text-volt">{selectedPlayer.pref_position_1}</p></div>
                <div><p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Position 2</p><p className="font-serif text-xl italic text-white">{selectedPlayer.pref_position_2 || '-'}</p></div>
                <div><p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Position 3</p><p className="font-serif text-xl italic text-gray-500">{selectedPlayer.pref_position_3 || '-'}</p></div>
              </div>
            </div>

            <div className="mt-12 pt-12 border-t border-white/10">
              <h3 className="text-[10px] text-gray-500 uppercase tracking-widest mb-6">Payment Proof</h3>
              {selectedPlayer.payment_screenshot ? (
                <a href={selectedPlayer.payment_screenshot} target="_blank" rel="noreferrer">
                  <img src={selectedPlayer.payment_screenshot} alt="Payment" className="max-w-2xl w-full rounded-2xl border border-white/10 hover:opacity-80 transition-opacity" />
                </a>
              ) : (
                <p className="text-gray-500 font-serif italic">No proof provided.</p>
              )}
            </div>

            {!selectedPlayer.payment_verified && selectedPlayer.auction_status !== 'rejected' && (
               <div className="mt-12 flex gap-6">
                 <MagneticButton onClick={() => handleAction(selectedPlayer.id, "verify")} className="flex-1 !bg-volt !text-carbon hover:!bg-white" variant="primary">Authorize & Notify</MagneticButton>
                 <MagneticButton onClick={() => handleAction(selectedPlayer.id, "reject")} className="flex-1 !bg-transparent !text-red-500 !border-red-500/50 hover:!bg-red-500/10" variant="secondary">Reject Dossier</MagneticButton>
               </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
