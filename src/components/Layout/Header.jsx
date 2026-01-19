import React from 'react';
import { Atom, FlaskConical, Gamepad2, Info, Activity } from 'lucide-react';

const NavButton = ({ active, onClick, icon: Icon, label, count }) => (
  <button 
    onClick={onClick}
    className={`
      relative h-10 px-4 md:px-6 rounded-lg text-xs md:text-sm font-bold tracking-wide transition-all flex items-center gap-2 group overflow-hidden
      ${active 
        ? 'text-cyan-400 bg-cyan-950/30 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]' 
        : 'text-slate-400 border border-transparent hover:text-white hover:bg-white/5'
      }
    `}
  >
    {/* Active Glow Bar */}
    {active && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)]" />}
    
    <Icon size={16} className={`relative z-10 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
    
    <span className="relative z-10 hidden md:inline">{label}</span>
    
    {/* Notification Badge (For Lab) */}
    {count > 0 && (
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 text-[9px] text-black font-bold items-center justify-center">
          {count}
        </span>
      </span>
    )}
  </button>
);

const Header = ({ activeTab, setActiveTab, labCount }) => {
  return (
    <header className="h-20 px-6 bg-[#0a0a12]/80 backdrop-blur-xl border-b border-white/10 flex justify-between items-center z-50 absolute top-0 inset-x-0 shadow-2xl">
      
      {/* Background Noise Texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />

      {/* --- LOGO SECTION --- */}
      <div className="flex items-center gap-4 relative z-10">
        <div className="relative group cursor-default">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative w-10 h-10 bg-slate-900 border border-slate-700 rounded-lg flex items-center justify-center">
            <Atom className="w-5 h-5 text-cyan-400 animate-[spin_8s_linear_infinite]" />
          </div>
        </div>
        
        <div className="flex flex-col">
          {/* Main Title */}
          <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-slate-400 tracking-tighter leading-none">
            ATOMIC<span className="text-cyan-500">EXPLORER</span>
          </h1>
          
          {/* Subtitle / Branding */}
          <div className="flex items-center gap-2 mt-1">
             <div className="flex gap-0.5">
                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse delay-75" />
                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse delay-150" />
             </div>
             <span className="text-[9px] font-mono text-slate-500 tracking-widest uppercase">
               by <span className="text-slate-300 font-bold">JHT Smart Steps Learning</span>
             </span>
          </div>
        </div>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="flex items-center gap-2 p-1.5 bg-black/40 border border-white/5 rounded-xl backdrop-blur-md relative z-10">
        <NavButton active={activeTab === 'table'} onClick={() => setActiveTab('table')} icon={Atom} label="Table" />
        <NavButton active={activeTab === 'lab'} onClick={() => setActiveTab('lab')} icon={FlaskConical} label="Lab" count={labCount} />
        <NavButton active={activeTab === 'game'} onClick={() => setActiveTab('game')} icon={Gamepad2} label="Challenges" />
        <NavButton active={activeTab === 'about'} onClick={() => setActiveTab('about')} icon={Info} label="About" />
      </nav>

    </header>
  );
};

export default Header;