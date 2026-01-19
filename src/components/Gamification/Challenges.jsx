import React, { useState } from 'react';
import { 
  Gamepad2, Brain, Zap, Keyboard, ChevronRight, 
  Scale, Layers, FlaskConical 
} from 'lucide-react';

// --- IMPORT ALL 6 GAMES ---
import GameMCQ from './GameMCQ';
import GameSymbolMatch from './GameSymbolMatch';
import GameFillBlanks from './GameFillBlanks';
import GameAtomicWar from './GameAtomicWar';
import GameSorter from './GameSorter';
import GameFusion from './GameFusion';

import useAudio from '../../hooks/useAudio';

const Challenges = () => {
  const { play } = useAudio();
  const [activeGame, setActiveGame] = useState(null);

  // --- GAME ROUTER ---
  if (activeGame === 'mcq') return <GameMCQ onExit={() => setActiveGame(null)} />;
  if (activeGame === 'match') return <GameSymbolMatch onExit={() => setActiveGame(null)} />;
  if (activeGame === 'type') return <GameFillBlanks onExit={() => setActiveGame(null)} />;
  if (activeGame === 'war') return <GameAtomicWar onExit={() => setActiveGame(null)} />;
  if (activeGame === 'sort') return <GameSorter onExit={() => setActiveGame(null)} />;
  if (activeGame === 'fusion') return <GameFusion onExit={() => setActiveGame(null)} />;

  // --- MAIN MENU ---
  return (
    <div className="h-full w-full bg-slate-950 p-6 md:p-10 overflow-y-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
           <Gamepad2 className="text-cyan-400" /> Challenge Arcade
        </h1>
        <p className="text-slate-400">Select a training module to begin.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
         
         {/* 1. ATOMIC TRIVIA */}
         <GameCard 
            icon={<Brain size={24}/>} 
            color="cyan" 
            title="Atomic Trivia" 
            desc="Test your knowledge with multiple choice questions."
            onClick={() => { setActiveGame('mcq'); play('click'); }} 
         />

         {/* 2. SPEED SYMBOLS */}
         <GameCard 
            icon={<Zap size={24}/>} 
            color="amber" 
            title="Speed Symbols" 
            desc="Race against the clock! Match symbols fast."
            onClick={() => { setActiveGame('match'); play('click'); }} 
         />

         {/* 3. DATA ENTRY */}
         <GameCard 
            icon={<Keyboard size={24}/>} 
            color="emerald" 
            title="Data Entry" 
            desc="Type the full name of the element correctly."
            onClick={() => { setActiveGame('type'); play('click'); }} 
         />

         {/* 4. ATOMIC WAR */}
         <GameCard 
            icon={<Scale size={24}/>} 
            color="red" 
            title="Atomic War" 
            desc="Bet on which element has the higher atomic mass."
            onClick={() => { setActiveGame('war'); play('click'); }} 
         />

         {/* 5. CHROMA SORT */}
         <GameCard 
            icon={<Layers size={24}/>} 
            color="purple" 
            title="Chroma Sort" 
            desc="Sort elements into their correct chemical families."
            onClick={() => { setActiveGame('sort'); play('click'); }} 
         />

         {/* 6. FUSION LAB */}
         <GameCard 
            icon={<FlaskConical size={24}/>} 
            color="indigo" 
            title="Fusion Lab" 
            desc="Add atomic numbers together to create new elements."
            onClick={() => { setActiveGame('fusion'); play('click'); }} 
         />

      </div>
    </div>
  );
};

// --- HELPER COMPONENT FOR CARDS ---
const GameCard = ({ icon, color, title, desc, onClick }) => {
    // Styling maps
    const colors = {
        cyan: "bg-cyan-500/20 text-cyan-400 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:bg-cyan-600",
        amber: "bg-amber-500/20 text-amber-400 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:bg-amber-600",
        emerald: "bg-emerald-500/20 text-emerald-400 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:bg-emerald-600",
        red: "bg-red-500/20 text-red-400 hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:bg-red-600",
        purple: "bg-purple-500/20 text-purple-400 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:bg-purple-600",
        indigo: "bg-indigo-500/20 text-indigo-400 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:bg-indigo-600",
    };
    
    // Default fallback
    const theme = colors[color] || colors.cyan;
    const btnTheme = theme.split(' ').pop(); // Extract just the hover color for the button

    return (
        <div className={`bg-slate-900/50 border border-slate-700 rounded-2xl p-6 flex flex-col transition-all group shadow-lg hover:border-opacity-100 hover:-translate-y-1`}>
            {/* Icon Box */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${theme.split(' hover')[0]}`}>
                {icon}
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-400 text-sm mb-6 flex-1 leading-relaxed">{desc}</p>
            
            <button onClick={onClick} className={`w-full py-3 bg-slate-800 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${btnTheme}`}>
                Play <ChevronRight size={16} />
            </button>
        </div>
    );
};

export default Challenges;