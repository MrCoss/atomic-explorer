import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Cpu, X, Trash2, Zap, Database, Atom, Microscope, 
  ChevronDown, Activity, Terminal
} from 'lucide-react';
import { useGemini } from '../../hooks/useGemini';
import useAudio from '../../hooks/useAudio';

const ChatInterface = ({ activeElement, onClose }) => {
  const { chat, loading } = useGemini();
  const { play } = useAudio();
  
  // NOTE: Removed internal 'isMinimized' state.
  // Minimizing now calls the parent's onClose method to hide the sidebar completely.

  const INITIAL_MESSAGE = { 
    role: 'model', 
    content: `**NEURAL LINK ESTABLISHED.**\nI am ready to analyze chemical structures and reaction data.` 
  };

  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  // --- HANDLERS ---

  const handleClear = (e) => {
    e.stopPropagation();
    play('click');
    setMessages([INITIAL_MESSAGE]);
  };

  // Both Minimize and Close buttons now trigger the full hide
  const handleClose = () => {
    play('click');
    if (onClose) onClose();
  };

  const handleSend = async (textOverride = null) => {
    const rawText = textOverride || input;
    if (!rawText.trim() || loading || isTyping) return;

    setInput("");
    play('click');
    
    const userMsg = { role: 'user', content: rawText };
    setMessages(prev => [...prev, userMsg]);
    
    setIsTyping(true);
    play('scan');

    try {
      const responseText = await chat(rawText, messages);
      play('success');
      setMessages(prev => [...prev, { role: 'model', content: responseText }]);
    } catch (err) {
      console.error("Chat Error:", err);
      play('error');
      setMessages(prev => [...prev, { role: 'model', content: "⚠️ **NETWORK ERROR:** Uplink unstable. Please retry." }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping, loading]);

  const suggestions = activeElement ? [
    { label: "Properties", icon: <Zap size={12} />, prompt: `What are the key chemical properties of ${activeElement.name}?` },
    { label: "Isotopes", icon: <Atom size={12} />, prompt: `Tell me about the isotopes of ${activeElement.name}.` },
    { label: "Uses", icon: <Database size={12} />, prompt: `What are 3 common industrial uses for ${activeElement.name}?` },
  ] : [
    { label: "Bonding", icon: <Microscope size={12} />, prompt: "Explain Ionic vs Covalent bonding." },
    { label: "Orbitals", icon: <Atom size={12} />, prompt: "Explain electron orbitals simply." },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-[#0a0a12] border-l border-white/10 font-sans relative shadow-2xl overflow-hidden">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* --- HEADER --- */}
      <div className="h-14 px-4 bg-slate-900/80 backdrop-blur-md flex items-center justify-between border-b border-white/10 z-20 shrink-0 select-none">
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
             <Cpu size={16} />
          </div>
          <div className="flex flex-col">
             <span className="text-[10px] font-bold text-white tracking-[0.2em] uppercase">Gemini Core</span>
             <span className="text-[8px] text-emerald-500 font-mono flex items-center gap-1">
                <Activity size={8} /> STABLE CONNECTION
             </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
            <button onClick={handleClear} className="p-2 text-slate-500 hover:text-red-400 hover:bg-white/5 rounded transition-colors" title="Clear Memory">
                <Trash2 size={14} />
            </button>
            {/* Minimize Button (Chevron) -> Hides Sidebar */}
            <button onClick={handleClose} className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded transition-colors" title="Hide Panel">
                <ChevronDown size={16} />
            </button>
            {/* Close Button (X) -> Hides Sidebar */}
            <button onClick={handleClose} className="p-2 text-slate-500 hover:text-white hover:bg-red-500/20 rounded transition-colors" title="Close Module">
                <X size={16} />
            </button>
        </div>
      </div>

      {/* --- MESSAGES --- */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar z-10 scroll-smooth" ref={scrollRef}>
        {messages.map((m, i) => (
            <div key={i} className={`flex w-full ${m.role === 'model' ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                 <div className={`
                    max-w-[90%] p-3 rounded-xl text-sm leading-relaxed relative shadow-md
                    ${m.role === 'model' 
                       ? 'bg-slate-900/80 border border-slate-700 text-slate-300 rounded-tl-none' 
                       : 'bg-gradient-to-br from-cyan-700 to-blue-700 text-white rounded-tr-none shadow-cyan-900/20'}
                 `}>
                    {m.role === 'model' && (
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5 opacity-50">
                            <Terminal size={10} />
                            <span className="text-[8px] uppercase tracking-widest font-mono">System Response</span>
                        </div>
                    )}
                    
                    <div className="whitespace-pre-wrap font-light">
                        {m.content.split(/(\*\*.*?\*\*)/).map((part, idx) => 
                            part.startsWith('**') 
                            ? <strong key={idx} className="text-cyan-200 font-bold">{part.slice(2, -2)}</strong> 
                            : part
                        )}
                    </div>
                 </div>
            </div>
        ))}

        {(loading || isTyping) && (
           <div className="flex justify-start animate-in fade-in">
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 flex items-center gap-3">
                 <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                 </div>
                 <span className="text-[10px] text-cyan-500 font-mono uppercase tracking-widest">Computing</span>
              </div>
           </div>
        )}
      </div>

      {/* --- INPUT AREA --- */}
      <div className="p-4 bg-[#050508]/80 backdrop-blur-xl border-t border-white/10 z-20 space-y-3">
         
         <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar mask-gradient-right">
            {suggestions.map((s, i) => (
               <button 
                 key={i} 
                 onClick={() => handleSend(s.prompt)}
                 disabled={loading || isTyping}
                 className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/50 rounded-full text-[10px] text-slate-400 hover:text-cyan-300 font-mono transition-all whitespace-nowrap active:scale-95"
               >
                 {s.icon} {s.label}
               </button>
            ))}
         </div>

         <div className="flex gap-2 relative bg-slate-900 p-1.5 rounded-xl border border-slate-800 focus-within:border-cyan-500/50 focus-within:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all">
            <textarea 
               ref={textareaRef}
               className="flex-1 bg-transparent border-none text-white px-3 py-2 text-xs focus:outline-none placeholder:text-slate-600 font-mono resize-none custom-scrollbar"
               placeholder={activeElement ? `Querying database for ${activeElement.name}...` : "Enter command..."}
               value={input}
               onChange={e => setInput(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
               rows={1}
               disabled={loading || isTyping}
               style={{ minHeight: '40px', maxHeight: '100px' }}
            />
            <button 
              onClick={() => handleSend()} 
              disabled={loading || isTyping || !input.trim()}
              className="px-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition-all shadow-lg active:scale-95 flex items-center justify-center"
            >
               <Send size={14} />
            </button>
         </div>
      </div>

    </div>
  );
};

export default ChatInterface;