import React, { useState, useEffect } from 'react';
import { Layers, XCircle, CheckCircle2 } from 'lucide-react';
import { ELEMENTS } from '../../data/elements';
import useAudio from '../../hooks/useAudio';

const GameSorter = ({ onExit }) => {
  const { play } = useAudio();
  const [target, setTarget] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const nextRound = () => {
    setFeedback(null);
    const t = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
    
    // Get distinct categories
    const allCats = [...new Set(ELEMENTS.map(e => e.category))];
    const wrongCats = allCats.filter(c => c !== t.category).sort(() => Math.random() - 0.5).slice(0, 2);
    const roundOptions = [...wrongCats, t.category].sort(() => Math.random() - 0.5);

    setTarget(t);
    setOptions(roundOptions);
  };

  useEffect(() => { nextRound(); }, []);

  const handleChoice = (cat) => {
    if (feedback) return;
    if (cat === target.category) {
        play('success');
        setFeedback('correct');
        setScore(s => s + 50);
        setTimeout(nextRound, 1000);
    } else {
        play('error');
        setFeedback('wrong');
        setScore(s => Math.max(0, s - 25));
        setTimeout(() => setFeedback(null), 1000);
    }
  };

  if (!target) return null;

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
        <button onClick={onExit} className="absolute top-4 left-4 text-slate-500 hover:text-white text-xs font-bold uppercase tracking-widest">Exit</button>
        <div className="absolute top-4 right-4 text-cyan-400 font-mono font-bold text-xl">SCORE: {score}</div>

        <div className="text-center mb-10 animate-in zoom-in">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">CLASSIFY THIS ELEMENT</div>
            <div className={`inline-flex flex-col items-center justify-center w-40 h-40 bg-slate-900 border-4 ${feedback === 'correct' ? 'border-emerald-500' : feedback === 'wrong' ? 'border-red-500' : 'border-slate-700'} rounded-3xl shadow-2xl transition-all`}>
                <div className="text-6xl font-bold text-white mb-2">{target.symbol}</div>
                <div className="text-xs text-slate-400 uppercase font-bold">{target.name}</div>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-3 w-full max-w-sm">
            {options.map((cat, i) => (
                <button 
                    key={i} 
                    onClick={() => handleChoice(cat)}
                    className="p-4 bg-slate-800 hover:bg-cyan-900/50 border border-slate-700 hover:border-cyan-500 rounded-xl text-white font-bold text-sm uppercase transition-all flex justify-between items-center group"
                >
                    {cat}
                    <Layers size={16} className="text-slate-600 group-hover:text-cyan-400" />
                </button>
            ))}
        </div>
    </div>
  );
};
export default GameSorter;