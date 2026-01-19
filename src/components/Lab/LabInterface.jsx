import React, { useState, useEffect, useRef } from 'react';
import { 
  FlaskConical, RotateCcw, Zap, Atom, 
  Microscope, Dna, Activity, Scan, Biohazard, ShieldAlert, CheckCircle2 
} from 'lucide-react';
import useAudio from '../../hooks/useAudio';
// 1. IMPORT THE NEW LOGIC ENGINE
import { getReactionResult } from '../../data/reactionLogic'; 
import ReactionVisual from './ReactionVisual'; 

const LabInterface = ({ labElements, clearLab, onRemove }) => {
  const { play } = useAudio();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const resultRef = useRef(null);

  useEffect(() => {
    if (result && window.innerWidth < 768 && resultRef.current) {
      setTimeout(() => {
        resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [result]);

  const handleMix = () => {
    if (labElements.length < 2) return;
    
    setResult(null);
    setLoading(true);
    play('mix'); 

    // Simulate "Calculation Time" for effect (1.5 seconds)
    setTimeout(() => {
        // 2. GET RESULT FROM LOCAL DATABASE (No AI)
        const reactionData = getReactionResult(labElements[0], labElements[1]);
        
        setResult(reactionData);
        setLoading(false);

        // Sound Logic
        if (reactionData.type === 'inert' || reactionData.type === 'neutral') play('fail');
        else if (reactionData.type === 'explosive' || reactionData.dangerLevel === 'Critical') play('error');
        else play('success');

    }, 1500);
  };

  const handleClear = () => {
    play('click');
    clearLab();
    setResult(null);
  };

  return (
    <div className="h-full w-full flex flex-col lg:flex-row bg-slate-950 overflow-hidden relative font-sans">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      {/* --- LEFT PANEL: REACTOR CORE --- */}
      <div className="flex-1 flex flex-col relative z-10 border-b lg:border-b-0 lg:border-r border-white/10">
        
        {/* Header HUD */}
        <div className="h-16 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-md border-b border-white/5">
           <div className="flex items-center gap-3">
             <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-20" />
                <FlaskConical size={20} className="text-cyan-400 relative z-10" />
             </div>
             <div>
                <h2 className="text-sm font-bold text-white tracking-[0.2em]">SYNTHESIS CORE</h2>
                <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                   <span className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                   {loading ? 'PROCESSING...' : 'SYSTEM READY'}
                </div>
             </div>
           </div>
           
           <button onClick={handleClear} className="group flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all">
             <RotateCcw size={14} className="text-slate-400 group-hover:rotate-180 transition-transform duration-500" /> 
             <span className="text-xs font-bold text-slate-300">PURGE</span>
           </button>
        </div>

        {/* Main Interaction Stage */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
           
           {/* Decor Rings */}
           <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full pointer-events-none" />
           <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full border-dashed animate-spin-slow pointer-events-none" />

           {(loading || (result && result.visuals)) ? (
              <div className="w-full h-full max-w-lg relative animate-in zoom-in duration-500 z-20">
                 <ReactionVisual 
                    loading={loading} 
                    type={result?.type || 'neutral'} 
                    description={result?.visuals}
                    dangerLevel={result?.dangerLevel}
                 />
              </div>
           ) : (
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 z-20">
                 <SocketBox index="A" element={labElements[0]} onRemove={() => onRemove(labElements[0]?.uid)} />
                 
                 <div className="flex flex-col md:flex-row items-center gap-2 opacity-80">
                    <div className="w-1 h-8 md:w-16 md:h-1 bg-gradient-to-b md:bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                    <div className={`relative w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-500 ${labElements.length === 2 ? 'border-cyan-400 bg-cyan-950/50 shadow-[0_0_25px_rgba(6,182,212,0.4)]' : 'border-slate-700 bg-slate-900'}`}>
                       <Dna size={20} className={labElements.length === 2 ? 'text-cyan-400' : 'text-slate-600'} />
                    </div>
                    <div className="w-1 h-8 md:w-16 md:h-1 bg-gradient-to-b md:bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                 </div>

                 <SocketBox index="B" element={labElements[1]} onRemove={() => onRemove(labElements[1]?.uid)} />
              </div>
           )}
        </div>

        {/* Action Bar */}
        <div className="h-24 bg-slate-900/80 border-t border-white/5 p-4 flex items-center justify-between px-8 backdrop-blur-md relative z-30">
           <div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Reaction Chamber</div>
              <div className="text-xl font-mono text-white flex items-center gap-2">
                 {labElements.length === 0 ? <span className="text-slate-600">EMPTY</span> :
                  labElements.length === 1 ? <span className="text-yellow-500">PARTIAL LOAD</span> :
                  <span className="text-cyan-400">CHARGED</span>}
              </div>
           </div>

           <button 
             onClick={handleMix}
             disabled={labElements.length < 2 || loading}
             className={`group relative px-8 py-4 rounded-xl font-bold tracking-widest text-sm uppercase transition-all overflow-hidden ${labElements.length < 2 ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' : 'bg-white text-black hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)] border border-transparent'}`}
           >
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
             <span className="flex items-center gap-2 relative z-10">
               {loading ? <Scan className="animate-spin" size={18}/> : <Zap size={18} className="fill-current" />}
               {loading ? 'ANALYZING' : 'INITIATE'}
             </span>
           </button>
        </div>
      </div>

      {/* --- RIGHT PANEL: RESULTS --- */}
      <div ref={resultRef} className="w-full lg:w-[450px] bg-[#0b0c15] border-l border-white/10 relative z-20 shadow-2xl flex flex-col min-h-[300px]">
         <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(6,182,212,0.02)_50%,transparent_100%)] bg-[length:100%_4px] pointer-events-none" />

         {result && !loading ? (
            <div className="flex-1 flex flex-col overflow-hidden animate-in slide-in-from-right-8 duration-500">
               <div className={`p-6 border-b ${result.dangerLevel === 'Critical' ? 'bg-red-950/30 border-red-500/30' : result.type === 'inert' ? 'bg-slate-900 border-slate-800' : 'bg-emerald-950/30 border-emerald-500/30'}`}>
                  <div className="flex justify-between items-start mb-2">
                     <div className={`p-3 rounded-lg border ${result.dangerLevel === 'Critical' ? 'bg-red-500/10 border-red-500/50 text-red-500' : result.type === 'inert' ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'}`}>
                        {result.dangerLevel === 'Critical' ? <Biohazard size={24} /> : result.type === 'inert' ? <ShieldAlert size={24} /> : <CheckCircle2 size={24} />}
                     </div>
                     <div className="text-right">
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Safety Level</div>
                        <div className={`text-sm font-bold uppercase ${result.dangerLevel === 'Critical' ? 'text-red-500' : 'text-slate-300'}`}>{result.dangerLevel || "Unknown"}</div>
                     </div>
                  </div>
                  <h2 className="text-2xl font-black text-white mt-4 leading-none">{result.name}</h2>
               </div>

               <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                  {result.type !== 'inert' && result.type !== 'neutral' && (
                     <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4 relative group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 rounded-l-xl opacity-50 group-hover:opacity-100 transition-opacity" />
                        <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold mb-2 block">Molecular Formula</span>
                        <span className="text-3xl font-mono text-white font-medium">{result.formula}</span>
                     </div>
                  )}

                  <div className="space-y-2">
                     <h3 className="text-xs text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2"><Activity size={14} /> Analysis Data</h3>
                     <p className="text-sm text-slate-300 leading-7 font-light">{result.desc}</p>
                  </div>
               </div>
            </div>
         ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-40">
               <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-6"><Microscope size={32} className="text-slate-500" /></div>
               <h3 className="text-sm font-bold text-white tracking-[0.2em] mb-2">AWAITING INPUT</h3>
               <p className="text-xs text-slate-500 font-mono">Combine elements in the synthesis core to begin analysis.</p>
            </div>
         )}
      </div>
    </div>
  );
};

const SocketBox = ({ index, element, onRemove }) => (
    <div className={`relative w-32 h-44 md:w-48 md:h-64 rounded-2xl border flex flex-col items-center justify-center transition-all duration-500 group ${element ? 'bg-slate-900/80 border-cyan-500/50 shadow-[0_0_40px_rgba(6,182,212,0.15)] scale-105' : 'bg-white/5 border-dashed border-white/10 hover:border-white/30 hover:bg-white/10'}`}>
      {element ? (
        <div className="flex flex-col items-center animate-in zoom-in duration-300 relative z-10">
            <span className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-4 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{element.symbol}</span>
            <span className="text-[10px] font-bold bg-cyan-950/50 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/30 uppercase tracking-wider">{element.name}</span>
            <button onClick={onRemove} className="absolute -top-12 -right-12 group-hover:-top-4 group-hover:-right-4 w-8 h-8 bg-red-500/10 border border-red-500/50 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500 hover:text-white"><RotateCcw size={14} /></button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 opacity-20"><div className="text-4xl font-black text-slate-700">{index}</div><div className="text-[10px] font-mono uppercase tracking-widest">Empty Slot</div></div>
      )}
      <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l transition-colors ${element ? 'border-cyan-500' : 'border-slate-600'}`} />
      <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r transition-colors ${element ? 'border-cyan-500' : 'border-slate-600'}`} />
      <div className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l transition-colors ${element ? 'border-cyan-500' : 'border-slate-600'}`} />
      <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r transition-colors ${element ? 'border-cyan-500' : 'border-slate-600'}`} />
    </div>
);

export default LabInterface;