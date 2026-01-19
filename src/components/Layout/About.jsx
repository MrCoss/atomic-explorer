import React from 'react';
import { 
  Github, Linkedin, Globe, Cpu, Code, Layers, 
  Database, ExternalLink, Sparkles, Zap, Terminal, ShieldCheck, BrainCircuit 
} from 'lucide-react';

const About = () => {
  
  const socialLinks = {
    github: "https://github.com/MrCoss",
    linkedin: "https://linkedin.com/in/costaspinto",
    portfolio: "https://costas-portfolio-ai.vercel.app" 
  };

  const techStack = [
    { name: "React.js 18", icon: Code, color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10" },
    { name: "Tailwind CSS", icon: Layers, color: "text-cyan-400", border: "border-cyan-500/30", bg: "bg-cyan-500/10" },
    { name: "Three.js (R3F)", icon: Database, color: "text-orange-400", border: "border-orange-500/30", bg: "bg-orange-500/10" },
    { name: "Vite", icon: Zap, color: "text-yellow-400", border: "border-yellow-500/30", bg: "bg-yellow-500/10" },
  ];

  // List of models from your aihub.js configuration
  const aiModels = [
    "Meta Llama 3.1 (405B/70B)",
    "Google Gemini 2.0 Flash",
    "Qwen 2.5 (Visual/Coder)",
    "Google Gemma 2 & 3",
    "Microsoft Phi-3 Mini",
    "Mistral 7B & Zephyr"
  ];

  return (
    <div className="h-full w-full overflow-y-auto custom-scrollbar relative bg-slate-950 animate-in slide-in-from-bottom-10 duration-500">
      
      {/* Background FX */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none fixed" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none fixed" />

      <div className="max-w-5xl mx-auto p-6 md:p-12 relative z-10 space-y-12 pb-24">
        
        {/* 1. Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/30 text-cyan-400 text-[10px] font-mono tracking-widest uppercase mb-2 animate-pulse">
            <Terminal size={12} /> System Architecture v1.0
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
            ATOMIC <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">EXPLORER</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-light">
            An advanced interactive simulation visualizing the fundamental building blocks of the universe. 
            Powered by neural networks and real-time 3D rendering.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* 2. Developer Identity Card (Left Col) */}
            <div className="lg:col-span-5">
                <div className="h-full bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-1 shadow-2xl relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="bg-slate-950/80 rounded-xl p-8 h-full flex flex-col items-center text-center relative z-10 border border-black/50">
                        {/* Avatar */}
                        <div className="relative mb-6">
                            <div className="w-28 h-28 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center relative z-10 overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                                <span className="text-3xl font-bold text-cyan-500 font-mono">CP</span>
                            </div>
                            {/* Rotating Rings */}
                            <div className="absolute inset-[-8px] border border-cyan-500/30 rounded-full border-dashed animate-spin-slow" />
                            <div className="absolute inset-[-15px] border border-slate-700/30 rounded-full" />
                            
                            <div className="absolute bottom-0 right-0 bg-slate-900 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/50 flex items-center gap-1 z-20">
                                <ShieldCheck size={10} /> VERIFIED
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-1">Costas Pinto</h3>
                        <p className="text-cyan-500 font-mono text-xs uppercase tracking-widest mb-6">Lead Architect & AI Engineer</p>

                        {/* Social Matrix */}
                        <div className="w-full grid grid-cols-1 gap-3">
                            <SocialButton href={socialLinks.portfolio} icon={Globe} label="VISIT PORTFOLIO" delay="0" highlight />
                            <SocialButton href={socialLinks.github} icon={Github} label="GITHUB REPO" delay="100" />
                            <SocialButton href={socialLinks.linkedin} icon={Linkedin} label="LINKEDIN PROFILE" delay="200" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Tech Specs & Data (Right Col) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
                
                {/* Tech Stack Modules */}
                <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Cpu size={14} className="text-cyan-500" /> Core Modules
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {techStack.map((tech, idx) => (
                            <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg border ${tech.border} ${tech.bg} hover:brightness-125 transition-all cursor-default`}>
                                <tech.icon size={18} className={tech.color} />
                                <span className="text-slate-200 text-sm font-bold">{tech.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Neural Architecture Section */}
                <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <BrainCircuit size={14} className="text-purple-500" /> Neural Network Swarm
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                        {aiModels.map((model, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-400 font-mono border-l-2 border-purple-500/20 pl-2">
                                <span className="w-1 h-1 bg-purple-500 rounded-full" />
                                {model}
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Data */}
                <div className="flex-1 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Database size={14} className="text-cyan-500" /> Data Integrity
                        </h4>
                        <ul className="space-y-4">
                            <DataRow label="Atomic Standard" value="IUPAC Weights (2025)" />
                            <DataRow label="AI Model" value="Google Gemini 1.5 Flash" />
                            <DataRow label="Rendering Engine" value="WebGL 2.0 (Three.js)" />
                            <DataRow label="Environment" value="React 18 / Vite" />
                        </ul>
                    </div>

                    <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-end">
                        <div className="text-[10px] text-slate-600 font-mono">
                            SESSION ID: <span className="text-slate-400">{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                        </div>
                        <div className="text-right">
                            <span className="block text-[10px] text-slate-600 uppercase font-mono">Version</span>
                            <span className="text-white font-mono font-bold text-sm">v1.2.0-stable</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>

      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const SocialButton = ({ href, icon: Icon, label, delay, highlight }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className={`
      group flex items-center justify-between px-4 py-3 border rounded-lg transition-all active:scale-98
      ${highlight 
        ? 'bg-cyan-600 hover:bg-cyan-500 border-cyan-400 text-white shadow-lg shadow-cyan-900/20' 
        : 'bg-slate-800/50 hover:bg-cyan-900/20 border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-white'}
    `}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center gap-3">
        <Icon size={18} className={highlight ? "text-white" : "text-slate-400 group-hover:text-cyan-400 transition-colors"} />
        <span className="text-xs font-bold tracking-wider">{label}</span>
    </div>
    <ExternalLink size={12} className={`opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 ${highlight ? 'text-white' : 'text-cyan-500'}`} />
  </a>
);

const DataRow = ({ label, value }) => (
    <li className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0">
        <span className="text-sm text-slate-400">{label}</span>
        <span className="text-sm font-mono text-cyan-100">{value}</span>
    </li>
);

export default About;