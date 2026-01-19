import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Atom3D from '../3D/Atom3D';
// FIXED: Added 'Activity' to the imports list below
import { 
  FlaskConical, X, Sparkles, Scale, Thermometer, 
  Box, ScanLine, Atom, Cpu, Database, Microscope, Share2, AlertTriangle, Activity 
} from 'lucide-react';
import useAudio from '../../hooks/useAudio';
import { sendMessageToGemini } from "../../services/aihub";
import { getElementColor } from '../../data/elements'; 

const ElementOverlay = ({ element, onClose, onAddToLab }) => {
  const { play } = useAudio();
  const [aiData, setAiData] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!element) return;
    let isActive = true;

    const fetchAiData = async () => {
      setLoadingAi(true);
      setAiData(null);
      
      const prompt = `
        Tell me about the element ${element.name} (${element.symbol}).
        Return strictly valid JSON with this format:
        {
          "funFact": "One short, surprising scientific fact about it.",
          "uses": "A short list of 3 common real-world uses."
        }
      `;

      try {
        const responseText = await sendMessageToGemini(prompt);
        const jsonMatch = responseText.match(/\{[\s\S]*\}/); 
        const cleanJson = jsonMatch ? jsonMatch[0] : null;
        
        if (cleanJson) {
            const data = JSON.parse(cleanJson);
            if (isActive) setAiData(data);
        } else {
            throw new Error("Invalid JSON");
        }
      } catch (err) {
        // Silent fail - UI handles null state
        if (isActive) {
             setAiData({
                funFact: "Data transmission interrupted. Elemental properties remain stable.",
                uses: "Research, Industry, Education"
            });
        }
      } finally {
        if (isActive) setLoadingAi(false);
      }
    };

    fetchAiData();
    return () => { isActive = false; };
  }, [element]);

  if (!mounted || !element) return null;

  const handleAdd = (e) => {
    e.stopPropagation();
    play('add'); 
    onAddToLab(element, e);
  };

  const atomicNumber = element.number || "?";
  const massDisplay = element.atomic_mass ? `${element.atomic_mass.toFixed(2)} u` : 'N/A';
  const categoryDisplay = element.category ? element.category.replace('-', ' ') : "Unknown Series";
  
  // Safe color access
  const atomColor = (typeof getElementColor === 'function') 
    ? getElementColor(element.symbol) 
    : "#00FFFF"; 

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      
      <div className="w-full max-w-6xl bg-[#0a0a12]/95 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl relative flex flex-col max-h-[95vh] overflow-hidden group">
        
        <div className="absolute inset-0 bg-slate-950 opacity-90 pointer-events-none" />
        <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Header */}
        <div className="relative shrink-0 p-6 md:p-8 flex items-start justify-between z-20 border-b border-white/5">
            <div className="flex items-center gap-6">
                <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl border border-white/10 backdrop-blur-sm" />
                    <span className="relative text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 z-10">
                        {element.symbol}
                    </span>
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            #{atomicNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            {element.phase || "Solid"}
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">{element.name}</h2>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mt-1">{categoryDisplay}</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                 <button onClick={handleAdd} className="hidden md:flex px-6 py-3 bg-white text-black rounded-xl font-bold text-sm items-center gap-2 hover:scale-105 active:scale-95 transition-all">
                    <FlaskConical size={18} /> ADD TO LAB
                 </button>
                 <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-all">
                    <X size={24} />
                 </button>
            </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
            <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* 3D Model Section */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="relative w-full aspect-square bg-[#050508] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                        {Atom3D ? (
                            <Atom3D atomicNumber={parseInt(atomicNumber) || 1} color={atomColor} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-500">3D Module Loading...</div>
                        )}
                    </div>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
                        <StatCell label="Atomic Mass" value={massDisplay} icon={Scale} />
                        <StatCell label="Density" value={element.density ? `${element.density} g/cm³` : 'N/A'} icon={Box} />
                        <StatCell label="Melting Point" value={element.melt ? `${element.melt} K` : 'N/A'} icon={Thermometer} />
                        <StatCell label="Boiling Point" value={element.boil ? `${element.boil} K` : 'N/A'} icon={Activity} />
                    </div>
                </div>

                {/* AI & Info Section */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Database size={16} className="text-cyan-400" /> Database Entry
                        </h3>
                        <p className="text-slate-300 leading-relaxed font-light">
                             {element.summary || element.desc || "Standard database description unavailable."}
                        </p>
                    </div>

                    <div className="flex-1 bg-black/80 rounded-2xl border border-purple-500/30 overflow-hidden flex flex-col min-h-[250px]">
                        <div className="h-10 bg-purple-900/20 border-b border-purple-500/20 flex items-center px-4 gap-2 text-purple-300">
                            <Cpu size={12} /> <span className="text-[10px] font-bold tracking-widest">GEMINI.AI_ANALYSIS</span>
                        </div>
                        <div className="flex-1 p-6 font-mono text-sm relative">
                             {loadingAi ? (
                                <div className="text-green-400 animate-pulse">{`> Decrypting data packets...`}</div>
                             ) : aiData ? (
                                <div className="space-y-6 animate-in fade-in">
                                    <div>
                                        <div className="flex items-center gap-2 text-purple-400 mb-2"><Sparkles size={14} /><span className="font-bold uppercase text-xs">Fun Fact</span></div>
                                        <p className="text-slate-300 pl-3 border-l-2 border-purple-500/30">{aiData.funFact}</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 text-cyan-400 mb-2"><Microscope size={14} /><span className="font-bold uppercase text-xs">Applications</span></div>
                                        <p className="text-slate-300 pl-3 border-l-2 border-cyan-500/30">{aiData.uses}</p>
                                    </div>
                                </div>
                             ) : (
                                <div className="h-full flex flex-col items-center justify-center opacity-50">
                                    <AlertTriangle size={24} className="mb-2 text-red-400" />
                                    <p className="text-slate-500 text-xs">AI Connection Offline</p>
                                </div>
                             )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

const StatCell = ({ label, value, icon: Icon }) => (
    <div className="bg-slate-900/50 p-4 hover:bg-slate-800/50 transition-colors">
        <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase">{label}</span>
            {Icon && <Icon size={14} className="text-slate-600" />}
        </div>
        <span className="text-lg font-mono font-medium text-white">{value}</span>
    </div>
);

export default ElementOverlay;