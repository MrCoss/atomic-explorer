import React, { useState, useEffect } from 'react';
import { Scale, ChevronRight, Trophy } from 'lucide-react';
import { ELEMENTS } from '../../data/elements';
import useAudio from '../../hooks/useAudio';

const GameAtomicWar = ({ onExit }) => {
  const { play } = useAudio();
  const [contenders, setContenders] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [reveal, setReveal] = useState(false);

  // Pick 2 distinct fighters
  const nextRound = () => {
    setReveal(false);
    let a = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
    let b = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
    
    // Ensure they aren't the same
    while (a.number === b.number) {
        b = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
    }
    setContenders([a, b]);
  };

  useEffect(() => { nextRound(); }, []);

  const handleChoice = (selection) => {
    if (reveal) return;
    setReveal(true);
    
    const [a, b] = contenders;
    const winner = a.number > b.number ? a : b;

    if (selection.number === winner.number) {
        play('success');
        setScore(s => s + 100);
        setStreak(s => s + 1);
        setTimeout(nextRound, 1500);
    } else {
        play('error');
        setStreak(0);
        setTimeout(nextRound, 2000);
    }
  };

  if (!contenders) return null;
  const [left, right] = contenders;

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
        <button onClick={onExit} className="absolute top-4 left-4 text-slate-500 hover:text-white text-xs font-bold uppercase tracking-widest">Retreat</button>
        
        {/* HUD */}
        <div className="absolute top-4 right-4 text-right">
            <div className="text-cyan-400 font-mono font-bold text-xl flex items-center justify-end gap-2"><Trophy size={16}/> {score}</div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-widest">Streak: {streak}</div>
        </div>

        <h2 className="text-white text-2xl font-bold mb-8 uppercase tracking-widest text-center">Which is <span className="text-amber-400">Heavier?</span></h2>

        {/* BATTLE ARENA */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-12 items-center w-full max-w-4xl">
            
            {/* FIGHTER 1 */}
            <Card element={left} onClick={() => handleChoice(left)} reveal={reveal} opponent={right} />

            <div className="text-2xl font-black text-slate-700 italic">VS</div>

            {/* FIGHTER 2 */}
            <Card element={right} onClick={() => handleChoice(right)} reveal={reveal} opponent={left} />

        </div>
    </div>
  );
};

// Sub-component for the card
const Card = ({ element, onClick, reveal, opponent }) => {
    const isWinner = reveal && element.number > opponent.number;
    const isLoser = reveal && element.number < opponent.number;
    
    let border = "border-slate-700 hover:border-cyan-500";
    if (isWinner) border = "border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)] scale-105";
    if (isLoser) border = "border-red-500 opacity-50";

    return (
        <button 
            onClick={onClick}
            disabled={reveal}
            className={`flex-1 w-full bg-slate-900 border-4 ${border} rounded-3xl p-8 flex flex-col items-center justify-center transition-all duration-500 group relative overflow-hidden`}
        >
            <div className="text-6xl font-black text-white mb-4 group-hover:scale-110 transition-transform">{element.symbol}</div>
            <div className="text-xl text-slate-400 font-mono uppercase tracking-widest">{element.name}</div>
            
            {/* HIDDEN STAT REVEAL */}
            <div className={`mt-6 text-3xl font-mono font-bold transition-all duration-500 ${reveal ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                {element.number}
            </div>
            {reveal && <div className="text-[10px] text-slate-500 uppercase font-bold">Atomic Mass</div>}
        </button>
    );
};

export default GameAtomicWar;