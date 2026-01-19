import React from 'react';
import { 
  Sparkles, Zap, Biohazard, Ban, Atom, 
  Loader2, ShieldCheck, AlertOctagon, Activity 
} from 'lucide-react';

const ReactionVisual = ({ type, loading, description, dangerLevel }) => {
  
  // --- STATE LOGIC ---
  const isCritical = dangerLevel === 'Critical';
  const isToxic = type === 'toxic' || (dangerLevel === 'High' && type !== 'explosive');
  const isExplosive = type === 'explosive' || type === 'ionic';
  const isInert = type === 'inert' || type === 'neutral';
  const isSynthesis = type === 'synthesis' || type === 'covalent';

  return (
    <div className="absolute inset-0 w-full h-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 group select-none">
      
      {/* CSS Animations */}
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 0.8; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-2px, 2px); }
          75% { transform: translate(2px, -2px); }
        }
      `}</style>

      {/* --- BACKGROUND LAYERS --- */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,27,1),rgba(18,18,27,0.8))] z-0" />
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Active State Background Tint */}
      <div className={`absolute inset-0 transition-opacity duration-1000 z-0
        ${loading ? 'bg-cyan-900/20' : 
          isCritical ? 'bg-red-900/30' : 
          isToxic ? 'bg-green-900/20' : 
          isExplosive ? 'bg-orange-900/20' : 
          isSynthesis ? 'bg-blue-900/20' : 'bg-slate-900/50'}
      `} />

      {/* Scanline Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent z-10 pointer-events-none" style={{ animation: 'scanline 3s linear infinite' }} />


      {/* --- CONTENT LAYER --- */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        
        {/* 1. LOADING STATE */}
        {loading && (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative">
              {/* Outer Ring */}
              <div className="w-24 h-24 rounded-full border-2 border-slate-800 border-t-cyan-500 animate-spin" />
              {/* Inner Ring */}
              <div className="absolute inset-2 rounded-full border-2 border-slate-800 border-b-cyan-400 animate-spin-slow duration-75" />
              {/* Core */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={24} className="text-cyan-400 animate-spin" />
              </div>
            </div>
            <div className="flex flex-col items-center">
                <span className="text-cyan-400 font-bold tracking-[0.2em] text-xs animate-pulse">SIMULATING REACTION</span>
                <span className="text-slate-600 font-mono text-[10px]">CALCULATING BOND ANGLES...</span>
            </div>
          </div>
        )}

        {/* 2. COMPLETED STATES */}
        {!loading && (
          <>
            {/* SYNTHESIS (Clean Blue/Cyan) */}
            {isSynthesis && (
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
                {/* Floating Particles */}
                {[...Array(6)].map((_, i) => (
                   <div key={i} className="absolute w-2 h-2 bg-cyan-400 rounded-full blur-[1px]" 
                        style={{ 
                            top: `${20 + Math.random() * 60}%`, 
                            left: `${20 + Math.random() * 60}%`,
                            animation: `float ${3 + Math.random()}s infinite ease-in-out alternate`
                        }} 
                   />
                ))}
                <div className="flex flex-col items-center gap-3">
                    <div className="w-20 h-20 bg-cyan-950/50 rounded-full border border-cyan-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.3)] backdrop-blur-md">
                        <Atom size={40} className="text-cyan-400 animate-spin-slow" />
                    </div>
                    <div className="px-3 py-1 bg-cyan-950/80 border border-cyan-500/30 rounded text-[10px] text-cyan-300 font-bold uppercase tracking-widest">
                        Synthesis Stable
                    </div>
                </div>
              </div>
            )}

            {/* HIGH ENERGY (Explosive/Ionic) */}
            {isExplosive && (
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                {/* Shockwaves */}
                <div className="absolute w-64 h-64 border-2 border-orange-500/30 rounded-full" style={{ animation: 'pulse-ring 2s infinite' }} />
                <div className="absolute w-64 h-64 border-2 border-yellow-500/30 rounded-full" style={{ animation: 'pulse-ring 2s infinite 0.5s' }} />
                
                <div className="flex flex-col items-center gap-3 z-10" style={{ animation: 'shake 0.5s infinite' }}>
                    <div className="relative">
                        <div className="absolute inset-0 bg-orange-500 blur-xl opacity-50 animate-pulse" />
                        <Zap size={64} className="text-yellow-400 relative z-10 drop-shadow-lg" fill="currentColor" />
                    </div>
                    <span className="text-yellow-200 font-black text-xl uppercase tracking-tighter drop-shadow-md">Energy Spike</span>
                </div>
              </div>
            )}

            {/* TOXIC / CRITICAL */}
            {(isToxic || isCritical) && (
              <div className="relative w-full h-full flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] bg-opacity-10">
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/40 via-transparent to-transparent" />
                
                {/* Fumes */}
                {[...Array(10)].map((_, i) => (
                   <div key={i} className="absolute bg-green-500/20 rounded-full blur-xl"
                        style={{
                            width: Math.random() * 60 + 20 + 'px',
                            height: Math.random() * 60 + 20 + 'px',
                            bottom: '-20px',
                            left: `${Math.random() * 100}%`,
                            animation: `float ${4 + Math.random() * 2}s infinite linear`
                        }}
                   />
                ))}

                <div className="flex flex-col items-center gap-4 z-10">
                    <div className="w-24 h-24 bg-black/40 border-2 border-red-500 rounded-xl flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.4)]">
                        {isCritical ? <AlertOctagon size={48} className="text-red-500 animate-pulse" /> : <Biohazard size={48} className="text-green-500 animate-pulse" />}
                    </div>
                    <div className={`px-4 py-1 rounded border font-bold uppercase tracking-widest text-xs
                        ${isCritical ? 'bg-red-950 border-red-500 text-red-500' : 'bg-green-950 border-green-500 text-green-500'}
                    `}>
                        {isCritical ? 'CONTAINMENT BREACH' : 'TOXIC HAZARD'}
                    </div>
                </div>
              </div>
            )}

            {/* INERT / FAILED */}
            {isInert && (
              <div className="flex flex-col items-center justify-center gap-4 opacity-50">
                 <Ban size={48} className="text-slate-500" />
                 <span className="text-slate-400 font-mono text-xs uppercase tracking-widest border border-slate-700 px-3 py-1 rounded">No Reaction</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* --- HUD FOOTER (Description) --- */}
      {!loading && description && (
        <div className="absolute bottom-0 left-0 right-0 p-4 z-30">
            <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 flex items-start gap-3 shadow-xl">
                <div className={`mt-0.5 ${isCritical ? 'text-red-500' : isToxic ? 'text-green-500' : isExplosive ? 'text-orange-500' : isSynthesis ? 'text-cyan-500' : 'text-slate-500'}`}>
                    <Activity size={16} />
                </div>
                <div className="flex-1">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Simulation Log</div>
                    <p className="text-xs text-slate-200 leading-relaxed font-light">{description}</p>
                </div>
            </div>
        </div>
      )}

      {/* --- TECH DECOR CORNERS --- */}
      <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/20" />
      <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/20" />
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/20" />
      <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/20" />

    </div>
  );
};

export default ReactionVisual;