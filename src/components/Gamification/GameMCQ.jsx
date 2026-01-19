import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ArrowRight, Brain, Trophy } from 'lucide-react';
import { TRIVIA_DB } from '../../data/gameData'; // Imports the 472 questions
import useAudio from '../../hooks/useAudio';

const GameMCQ = ({ onExit }) => {
  const { play } = useAudio();
  const [currentQ, setCurrentQ] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);

  const loadQuestion = () => {
    setAnswered(false);
    setSelected(null);
    // RANDOMIZE: Pick 1 from the 472 generated questions
    const random = TRIVIA_DB[Math.floor(Math.random() * TRIVIA_DB.length)];
    setCurrentQ(random);
  };

  useEffect(() => { loadQuestion(); }, []);

  const handleAnswer = (opt) => {
    if (answered) return;
    setAnswered(true);
    setSelected(opt);

    if (opt === currentQ.answer) {
        play('success');
        setScore(s => s + 100);
    } else {
        play('error');
        setScore(s => Math.max(0, s - 50));
    }
  };

  if (!currentQ) return <div className="p-10 text-center text-slate-500">Initializing Core...</div>;

  return (
    <div className="h-full flex flex-col max-w-2xl mx-auto p-4 animate-in fade-in">
       <div className="flex justify-between items-center mb-8 bg-slate-900/50 p-4 rounded-xl border border-slate-700">
          <button onClick={onExit} className="text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest">Exit Quiz</button>
          <div className="text-xl font-bold text-cyan-400 flex items-center gap-2 font-mono"><Trophy size={18} /> {score} PTS</div>
       </div>

       <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl text-center mb-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500" />
          <Brain className="mx-auto text-slate-600 mb-4 group-hover:text-cyan-500 transition-colors" size={32} />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{currentQ.question}</h2>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQ.options.map((opt, i) => {
             let style = "bg-slate-800 border-slate-700 hover:border-cyan-500 hover:bg-slate-700 text-slate-300";
             if (answered) {
                 if (opt === currentQ.answer) style = "bg-emerald-900/50 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]";
                 else if (opt === selected) style = "bg-red-900/50 border-red-500 text-red-400 opacity-50";
                 else style = "bg-slate-900 border-slate-800 text-slate-600 opacity-30";
             }
             return (
                 <button key={i} onClick={() => handleAnswer(opt)} disabled={answered} className={`p-6 rounded-xl border-2 text-xl font-bold transition-all flex items-center justify-between group ${style}`}>
                    {opt}
                    {answered && opt === currentQ.answer && <CheckCircle2 />}
                    {answered && opt === selected && opt !== currentQ.answer && <XCircle />}
                 </button>
             );
          })}
       </div>

       {answered && (
           <button onClick={() => { play('scan'); loadQuestion(); }} className="mt-8 w-full bg-cyan-600 hover:bg-cyan-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 animate-in slide-in-from-bottom-4 shadow-lg shadow-cyan-900/20">
               Next Question <ArrowRight />
           </button>
       )}
    </div>
  );
};
export default GameMCQ;