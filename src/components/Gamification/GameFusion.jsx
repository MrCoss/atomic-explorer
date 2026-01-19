import React, { useState, useEffect } from 'react';
import { FlaskConical, Plus, Equal, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { ELEMENTS } from '../../data/elements';
import useAudio from '../../hooks/useAudio';

const GameFusion = ({ onExit }) => {
  const { play } = useAudio();
  const [equation, setEquation] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null); // Track user selection

  const nextRound = () => {
    setFeedback(null);
    setSelectedOption(null);
    
    // Pick two small elements (to keep sum <= 118)
    const a = ELEMENTS[Math.floor(Math.random() * 50)]; 
    const b = ELEMENTS[Math.floor(Math.random() * 50)];
    const sum = a.number + b.number;
    
    const result = ELEMENTS.find(e => e.number === sum);
    
    // Generate wrong answers (similar mass)
    const wrongs = [];
    while (wrongs.length < 3) {
        const w = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
        // Ensure unique options
        if (w.number !== sum && Math.abs(w.number - sum) < 15 && !wrongs.includes(w)) {
            wrongs.push(w);
        }
    }
    
    setEquation({ a, b, result });
    setOptions([...wrongs, result].sort(() => Math.random() - 0.5));
  };

  useEffect(() => { nextRound(); }, []);

  const handleChoice = (el) => {
    if (feedback) return;
    setSelectedOption(el);

    if (el.number === equation.result.number) {
        play('success');
        setFeedback('success');
        setScore(s => s + 100);
        setTimeout(nextRound, 1500);
    } else {
        play('error');
        setFeedback('error');
        setScore(s => Math.max(0, s - 50));
        // Give user 2 seconds to see the correct answer
        setTimeout(nextRound, 2000);
    }
  };

  if (!equation) return null;

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
        <button onClick={onExit} className="absolute top-4 left-4 text-slate-500 hover:text-white text-xs font-bold uppercase tracking-widest">Abort</button>
        <div className="absolute top-4 right-4 text-emerald-400 font-mono font-bold text-xl">ENERGY: {score}</div>

        {/* EQUATION VISUALIZER */}
        <div className="mb-12 flex items-center gap-2 md:gap-4 scale-90 md:scale-100">
            {/* ELEMENT A */}
            <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center text-2xl font-bold text-white border-2 border-slate-600">{equation.a.symbol}</div>
                <div className="mt-2 text-xs font-mono text-cyan-400">#{equation.a.number}</div>
            </div>
            
            <Plus className="text-slate-500" />
            
            {/* ELEMENT B */}
            <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center text-2xl font-bold text-white border-2 border-slate-600">{equation.b.symbol}</div>
                <div className="mt-2 text-xs font-mono text-cyan-400">#{equation.b.number}</div>
            </div>

            <ArrowRight className="text-slate-500" />

            {/* RESULT BOX (Reveals on answer) */}
            <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-bold border-4 border-dashed transition-all duration-300
                ${feedback === 'success' ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_30px_rgba(16,185,129,0.5)]' : 
                  feedback === 'error' ? 'bg-red-500 border-red-400 text-white' : 
                  'bg-slate-900 border-slate-700 text-slate-700'}
            `}>
                {feedback ? equation.result.symbol : "?"}
            </div>
        </div>

        <div className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4">Select Fusion Result</div>

        {/* OPTIONS GRID */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {options.map((opt, i) => {
                const isCorrect = opt.number === equation.result.number;
                const isSelected = selectedOption && opt.number === selectedOption.number;
                
                // Determine Button Style
                let btnStyle = "bg-slate-800 border-slate-700 hover:bg-indigo-600 hover:border-indigo-400 text-white";
                
                if (feedback) {
                    if (isCorrect) {
                        // ALWAYS highlight the correct answer Green
                        btnStyle = "bg-emerald-600 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-105";
                    } else if (isSelected) {
                        // Highlight wrong selection Red
                        btnStyle = "bg-red-600 border-red-400 text-white opacity-50";
                    } else {
                        // Dim others
                        btnStyle = "bg-slate-900 border-slate-800 text-slate-600 opacity-20";
                    }
                }

                return (
                    <button 
                        key={i} 
                        onClick={() => handleChoice(opt)}
                        disabled={feedback !== null}
                        className={`p-4 border rounded-xl font-bold text-xl transition-all duration-300 shadow-lg active:scale-95 flex flex-col items-center relative overflow-hidden group ${btnStyle}`}
                    >
                        {opt.symbol}
                        <span className={`text-[10px] font-normal uppercase mt-1 transition-colors ${feedback ? 'text-white/70' : 'text-slate-400 group-hover:text-white/70'}`}>
                            {opt.name}
                        </span>
                        
                        {/* Status Icons */}
                        {feedback && isCorrect && <CheckCircle2 className="absolute top-2 right-2 text-white/50" size={16} />}
                        {feedback && isSelected && !isCorrect && <XCircle className="absolute top-2 right-2 text-white/50" size={16} />}
                    </button>
                );
            })}
        </div>
    </div>
  );
};

export default GameFusion;