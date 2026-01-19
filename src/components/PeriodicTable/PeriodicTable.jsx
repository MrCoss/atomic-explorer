import React from 'react';
import ElementCard from './ElementCard';
import { CATEGORY_COLORS } from '../../data/elements';
import { Layers, Info, Atom } from 'lucide-react';

const PeriodicTable = ({ elements, onHover, onSelect, activeElement }) => {
  
  const categories = [...new Set(elements.map(e => e.category))].filter(Boolean);

  const getLegendDotColor = (category) => {
      const classes = CATEGORY_COLORS[category] || '';
      // Simple parse to find bg color class
      const bgPart = classes.split(' ').find(c => c.startsWith('from-'));
      if (!bgPart) return 'bg-slate-500';
      
      if (bgPart.includes('red')) return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
      if (bgPart.includes('orange')) return 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]';
      if (bgPart.includes('yellow')) return 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]';
      if (bgPart.includes('green') || bgPart.includes('emerald')) return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]';
      if (bgPart.includes('teal') || bgPart.includes('cyan')) return 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]';
      if (bgPart.includes('blue') || bgPart.includes('sky')) return 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]';
      if (bgPart.includes('indigo')) return 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]';
      if (bgPart.includes('violet') || bgPart.includes('purple')) return 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]';
      if (bgPart.includes('pink') || bgPart.includes('rose')) return 'bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]';
      return 'bg-slate-500';
  };

  return (
    <div className="w-full h-full overflow-auto p-4 md:p-8 custom-scrollbar bg-slate-950 relative">
      
      {/* BACKGROUND GRID */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
      
      {/* MAIN GRID CONTAINER */}
      <div 
        className="grid gap-3 mx-auto pb-40 relative z-10"
        style={{ 
          gridTemplateColumns: 'repeat(18, minmax(60px, 1fr))',
          gridTemplateRows: 'repeat(10, minmax(80px, 1fr))',
          minWidth: '1200px', 
          maxWidth: '1800px'
        }}
      >
        {/* RENDER ELEMENTS */}
        {elements.map((el) => (
          <ElementCard 
            key={el.number || el.z} 
            element={el} 
            isHovered={activeElement && (activeElement.number === el.number)}
            onHover={onHover}
            onClick={onSelect}
          />
        ))}

        {/* --- TITLE HUD (Row 1, Left) --- */}
        <div 
            style={{ gridColumn: '3 / 10', gridRow: '1 / 2' }}
            className="hidden lg:flex flex-col justify-center pl-4 pointer-events-none"
        >
             <h1 className="text-5xl font-black text-white tracking-tighter mb-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                 PERIODIC TABLE
             </h1>
             <div className="flex items-center gap-3">
                 <div className="h-0.5 w-12 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                 <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-[0.4em]">
                     Interactive Arrangement v3.0
                 </span>
             </div>
        </div>

        {/* --- INFO BOX (Row 1, Right - SAFEST SPOT) --- */}
        <div 
            style={{ gridColumn: '11 / 18', gridRow: '1 / 2' }}
            className="hidden lg:flex items-center justify-end pr-4 pointer-events-none"
        >
             <div className="text-right backdrop-blur-sm bg-slate-900/40 p-4 rounded-xl border border-slate-800/50 border-r-4 border-r-cyan-500">
                 <div className="flex items-center justify-end gap-2 mb-1 text-cyan-400">
                     <span className="relative flex h-2 w-2">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                     </span>
                     <span className="text-xs font-bold uppercase tracking-widest">System Online</span>
                 </div>
                 <p className="text-xs text-slate-400 font-mono">
                     Select element for <span className="text-white">Gemini AI Analysis</span>.
                 </p>
             </div>
        </div>

        {/* --- LEGEND HUD (Rows 2-3, Cols 3-12 - THE GAP) --- */}
        <div 
            style={{ gridColumn: '3 / 13', gridRow: '2 / 4' }}
            className="hidden lg:flex flex-col justify-start pl-4 pt-6 pointer-events-none"
        >
            <div className="backdrop-blur-md bg-slate-900/60 border border-slate-700/50 p-6 rounded-2xl relative overflow-hidden shadow-2xl">
                <div className="absolute -top-4 -right-4 opacity-10">
                    <Atom size={100} className="text-slate-400 animate-spin-slow" />
                </div>
                <h3 className="text-slate-300 font-bold uppercase tracking-[0.2em] text-[10px] mb-4 flex items-center gap-2 border-b border-slate-700 pb-2 w-fit">
                    <Layers size={12} className="text-cyan-500" /> Element Families
                </h3>
                <div className="flex flex-wrap gap-2 max-w-3xl">
                    {categories.map(cat => (
                        <div key={cat} className="group flex items-center gap-2 bg-slate-950/80 px-2.5 py-1.5 rounded border border-slate-800 hover:border-slate-600 transition-all cursor-help">
                            <div className={`w-2 h-2 rounded-sm ${getLegendDotColor(cat)}`} />
                            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wide group-hover:text-white transition-colors">
                                {cat.replace('-', ' ')}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* --- SPACERS --- */}
        <div style={{ gridColumn: '3', gridRow: '6' }} className="relative group flex flex-col items-center justify-center opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
            <div className="h-full w-full border-2 border-dashed border-slate-700 rounded-lg flex items-center justify-center bg-slate-900/30">
                <span className="text-[10px] font-mono text-slate-400 group-hover:text-cyan-400">57-71</span>
            </div>
            <div className="absolute top-full h-4 w-px bg-slate-700" />
        </div>
        <div style={{ gridColumn: '3', gridRow: '7' }} className="relative group flex flex-col items-center justify-center opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
            <div className="h-full w-full border-2 border-dashed border-slate-700 rounded-lg flex items-center justify-center bg-slate-900/30">
                <span className="text-[10px] font-mono text-slate-400 group-hover:text-cyan-400">89-103</span>
            </div>
            <div className="absolute top-full h-4 w-px bg-slate-700" />
        </div>

      </div>
    </div>
  );
};

export default PeriodicTable;