import React, { useState, useEffect, useCallback } from 'react';
import { Terminal, Check, ChevronRight, Delete, RefreshCw, Heart, Trophy, AlertTriangle } from 'lucide-react';
import { SPELLING_TARGETS } from '../../data/gameData';
import useAudio from '../../hooks/useAudio';

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
const MAX_LIVES = 3;

const GameFillBlanks = ({ onExit }) => {
  const { play } = useAudio();
  
  // Game Data
  const [target, setTarget] = useState(null);
  const [puzzleState, setPuzzleState] = useState([]); 
  
  // Score & Status
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'won', 'lost'
  
  // Visuals
  const [shake, setShake] = useState(false);

  // --- INIT ROUND ---
  const nextTarget = useCallback(() => {
    const t = SPELLING_TARGETS[Math.floor(Math.random() * SPELLING_TARGETS.length)];
    setTarget(t);
    setGameState('playing');
    
    // Create Puzzle Logic
    const chars = t.name.toUpperCase().split('');
    const newPuzzle = chars.map((char, index) => {
        // Logic: Always show first letter if word is long (>4 chars)
        if (index === 0 && chars.length > 4) return { char, isHidden: false, input: '' };
        
        // Randomly hide ~40% of letters
        const shouldHide = Math.random() > 0.4; 
        return { 
            char, 
            isHidden: shouldHide, 
            input: shouldHide ? '' : char 
        };
    });

    // Safety: Ensure at least 1 letter is hidden so there is something to play
    if (!newPuzzle.some(p => p.isHidden)) {
        newPuzzle[newPuzzle.length - 1].isHidden = true;
        newPuzzle[newPuzzle.length - 1].input = '';
    }

    setPuzzleState(newPuzzle);
  }, []);

  // Start game on load
  useEffect(() => { nextTarget(); }, [nextTarget]);

  // --- RESTART GAME (After Loss) ---
  const restartGame = () => {
      setStreak(0);
      setLives(MAX_LIVES);
      nextTarget();
  };

  // --- HANDLE INPUT (Immutable) ---
  const handleInput = useCallback((key) => {
    if (gameState !== 'playing') return;

    setPuzzleState(prev => {
        // Find index of first empty hidden slot
        const firstEmptyIndex = prev.findIndex(p => p.isHidden && p.input === '');
        
        if (firstEmptyIndex === -1) return prev; // No empty slots

        play('click');

        // Return new array with updated slot
        return prev.map((item, index) => {
            if (index === firstEmptyIndex) return { ...item, input: key };
            return item;
        });
    });
  }, [gameState, play]);

  // --- HANDLE BACKSPACE (Immutable) ---
  const handleBackspace = useCallback(() => {
    if (gameState !== 'playing') return;

    setPuzzleState(prev => {
        // Find index of last filled hidden slot (search backwards)
        const reversedIndex = [...prev].reverse().findIndex(p => p.isHidden && p.input !== '');
        
        if (reversedIndex === -1) return prev; // Nothing to delete

        const actualIndex = prev.length - 1 - reversedIndex;

        play('click');

        // Return new array with cleared slot
        return prev.map((item, index) => {
            if (index === actualIndex) return { ...item, input: '' };
            return item;
        });
    });
  }, [gameState, play]);

  // --- AUTOMATIC CHECKER ---
  useEffect(() => {
    if (!target || gameState !== 'playing') return;

    // 1. Check if full
    const isFull = puzzleState.every(p => p.input !== '');
    if (!isFull) return;

    // 2. Validate
    const submission = puzzleState.map(p => p.input).join('');
    
    if (submission === target.name.toUpperCase()) {
        // WIN ROUND
        play('success');
        setGameState('won');
        setStreak(s => s + 1);
    } else {
        // WRONG GUESS
        play('error');
        setShake(true);
        setTimeout(() => setShake(false), 500);

        // Deduct Life
        setLives(l => {
            const newLives = l - 1;
            if (newLives <= 0) {
                setGameState('lost'); // Game Over
            } else {
                // If alive, clear inputs after delay so user sees mistake
                setTimeout(() => {
                    setPuzzleState(prev => prev.map(p => p.isHidden ? { ...p, input: '' } : p));
                }, 800);
            }
            return newLives;
        });
    }
  }, [puzzleState, target, gameState, play]);

  // --- PHYSICAL KEYBOARD SUPPORT ---
  useEffect(() => {
    const handleKeyDown = (e) => {
        if (e.key === 'Backspace') handleBackspace();
        else if (/^[a-zA-Z]$/.test(e.key) && e.key.length === 1) handleInput(e.key.toUpperCase());
        else if (e.key === 'Enter' && gameState === 'won') nextTarget();
        else if (e.key === 'Enter' && gameState === 'lost') restartGame();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInput, handleBackspace, gameState, nextTarget]);


  if (!target) return null;

  return (
    <div className="h-full flex flex-col items-center justify-between p-4 max-w-2xl mx-auto relative overflow-hidden">
        
        {/* --- HEADER (Lives & Streak) --- */}
        <div className="w-full flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-800">
            <button onClick={onExit} className="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-widest">Abort</button>
            
            {/* Lives Display */}
            <div className="flex gap-1">
                {[...Array(MAX_LIVES)].map((_, i) => (
                    <Heart 
                        key={i} 
                        size={20} 
                        className={`transition-all ${i < lives ? 'fill-red-500 text-red-500' : 'fill-slate-800 text-slate-800'}`} 
                    />
                ))}
            </div>

            <div className="text-emerald-500 font-mono font-bold tracking-widest flex items-center gap-2">
                <Trophy size={16} /> {streak}
            </div>
        </div>

        {/* --- MAIN GAME AREA --- */}
        <div className="flex-1 flex flex-col items-center justify-center w-full my-4 relative">
             
             {/* Element Card */}
             <div className="mb-8 flex flex-col items-center animate-in zoom-in">
                 <div className="w-24 h-24 bg-slate-900 border-2 border-slate-700 rounded-2xl flex flex-col items-center justify-center shadow-2xl relative mb-4">
                     <div className="text-sm font-bold text-slate-600 absolute top-2 right-3">{target.number}</div>
                     <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-500">{target.symbol}</div>
                 </div>
                 <div className="text-slate-400 text-xs font-mono uppercase tracking-widest">{target.category}</div>
             </div>

             {/* Puzzle Slots */}
             <div className={`flex flex-wrap justify-center gap-2 md:gap-3 ${shake ? 'animate-shake' : ''}`}>
                {puzzleState.map((slot, i) => {
                    // Visual Styles
                    let style = "w-10 h-12 md:w-12 md:h-14 rounded-lg flex items-center justify-center text-2xl font-bold font-mono border-b-4 transition-all";
                    
                    if (!slot.isHidden) {
                        // Static (Given) Letter
                        return <div key={i} className={`${style} bg-slate-800 border-slate-900 text-slate-500`}>{slot.char}</div>;
                    } else {
                        // User Input Slot
                        const filled = slot.input !== '';
                        const colorClass = filled 
                            ? "bg-cyan-600 border-cyan-800 text-white transform -translate-y-1 shadow-lg" 
                            : "bg-slate-700 border-slate-600 text-white";
                        
                        return <div key={i} className={`${style} ${colorClass}`}>{slot.input}</div>;
                    }
                })}
             </div>

             {/* --- OVERLAYS --- */}

             {/* 1. WIN SCREEN */}
             {gameState === 'won' && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-sm rounded-2xl animate-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                        <Check size={32} className="text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">Decryption Complete</h2>
                    <p className="text-slate-400 text-sm mb-6">{target.name} confirmed.</p>
                    <button onClick={nextTarget} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-transform active:scale-95">
                        Next Mission <ChevronRight size={18} />
                    </button>
                    <div className="text-[10px] text-slate-600 mt-4 uppercase font-bold tracking-widest">Press Enter</div>
                </div>
             )}

             {/* 2. GAME OVER SCREEN */}
             {gameState === 'lost' && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-red-950/90 backdrop-blur-sm rounded-2xl animate-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                        <AlertTriangle size={32} className="text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">System Failure</h2>
                    <p className="text-red-200 text-sm mb-2">The correct element was:</p>
                    <div className="text-3xl font-mono font-bold text-white mb-6 tracking-widest bg-red-900/50 px-4 py-2 rounded border border-red-500/30">
                        {target.name.toUpperCase()}
                    </div>
                    <button onClick={restartGame} className="bg-slate-100 text-slate-900 hover:bg-white px-8 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-transform active:scale-95">
                        <RefreshCw size={18} /> Reboot System
                    </button>
                </div>
             )}

        </div>

        {/* ON-SCREEN KEYBOARD */}
        <div className={`w-full max-w-xl transition-opacity duration-300 ${gameState !== 'playing' ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
            <div className="grid grid-cols-10 gap-1 md:gap-2 mb-2">
                {ALPHABET.map((letter) => (
                    <button
                        key={letter}
                        onClick={() => handleInput(letter)}
                        className="h-10 md:h-12 rounded bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 text-white font-bold text-sm md:text-base transition-colors shadow-sm border border-slate-700"
                    >
                        {letter}
                    </button>
                ))}
            </div>
            <div className="flex justify-center gap-4 mt-2">
                <button 
                    onClick={handleBackspace}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-red-900/50 text-slate-300 hover:text-red-200 rounded-xl font-bold uppercase text-xs transition-all w-full justify-center border border-slate-700"
                >
                    <Delete size={18} /> Delete
                </button>
            </div>
        </div>

    </div>
  );
};

export default GameFillBlanks;