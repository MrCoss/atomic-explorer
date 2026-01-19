import React, { useState, useEffect } from 'react';
import { Timer, Zap } from 'lucide-react';
import { ARCADE_LEVELS } from '../../data/gameData'; // Imports 118 Levels
import useAudio from '../../hooks/useAudio';

const GameSymbolMatch = ({ onExit }) => {
  const { play } = useAudio();
  const [round, setRound] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (gameOver) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { setGameOver(true); play('error'); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameOver]);

  const nextRound = () => {
    // RANDOMIZE: Pick 1 from the 118 generated levels
    const level = ARCADE_LEVELS[Math.floor(Math.random() * ARCADE_LEVELS.length)];
    // We reshuffle the options here just to be safe
    const shuffled = [...level.options].sort(() => Math.random() - 0.5);
    setRound({ ...level, options: shuffled });
  };

  useEffect(() => { nextRound(); }, []);

  const handleChoice = (symbol) => {
    if (gameOver) return;
    if (symbol === round.correct) {
        play('click'); setScore(s => s + 1); nextRound();
    } else {
        play('error'); setScore(s => Math.max(0, s - 5));
    }
  };

  if (gameOver) {
      return (
          <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in">
              <h1 className="text-4xl font-bold text-white mb-2">TIME'S UP</h1>
              <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl mb-8">
                  <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Final Score</div>
                  <div className="text-6xl font-mono text-cyan-400 font-bold">{score}</div>
              </div>
              <div className="flex gap-4">
                  <button onClick={() => { setGameOver(false); setScore(0); setTimeLeft(30); nextRound(); }} className="bg-cyan-600 hover:bg-cyan-500 px-8 py-3 rounded-xl text-white font-bold transition-all">Retry</button>
                  <button onClick={onExit} className="bg-slate-800 hover:bg-slate-700 px-8 py-3 rounded-xl text-white font-bold transition-all">Exit</button>
              </div>
          </div>
      );
  }

  if (!round) return null;

  return (
    <div className="h-full flex flex-col max-w-xl mx-auto p-4 items-center justify-center">
        <div className="w-full flex justify-between mb-8 px-4">
            <div className={`flex items-center gap-2 font-mono font-bold text-2xl ${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-amber-400'}`}><Timer /> {timeLeft}s</div>
            <div className="flex items-center gap-2 font-mono font-bold text-2xl text-cyan-400"><Zap /> {score}</div>
        </div>
        <div className="mb-10 text-center">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">TAP THE SYMBOL FOR</div>
            <div className="text-5xl md:text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(6,182,212,0.5)] tracking-tight">{round.name}</div>
        </div>
        <div className="grid grid-cols-2 gap-4 w-full">
            {round.options.map((sym, i) => (
                <button key={i} onMouseDown={() => handleChoice(sym)} className="h-32 bg-slate-800 hover:bg-cyan-600 border-2 border-slate-700 hover:border-cyan-400 rounded-2xl text-4xl font-bold text-white transition-all active:scale-95 shadow-lg flex items-center justify-center">{sym}</button>
            ))}
        </div>
    </div>
  );
};
export default GameSymbolMatch;