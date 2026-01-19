import React, { memo } from 'react';
import useAudio from '../../hooks/useAudio';
import { CATEGORY_COLORS } from '../../data/elements';

const ElementCard = ({ element, onHover, onClick, isHovered }) => {
  const { play } = useAudio();

  // --- SAFE STYLE EXTRACTION ---
  // The data string looks like: "from-red-400 to-red-600 border-red-500 shadow-red-500/20"
  // We need to parse it to apply styles correctly to different parts of the card.
  const styleString = CATEGORY_COLORS[element.category] || 'from-slate-600 to-slate-400 border-slate-600 shadow-slate-500/20';
  
  const styleParts = styleString.split(' ');
  const gradientOnly = styleParts.filter(c => c.startsWith('from-') || c.startsWith('to-')).join(' ');
  const borderOnly = styleParts.find(c => c.startsWith('border-')) || 'border-slate-600';
  // Extract just the color name for custom shadows (e.g., 'red-500' from 'border-red-500')
  const baseColor = borderOnly.replace('border-', '');

  const handleMouseEnter = () => {
    play('hover', 0.5);
    onHover(element);
  };

  const handleClick = () => {
    play('select');
    onClick(element);
  };

  return (
    <div
      style={{ 
        gridColumn: element.xpos, 
        gridRow: element.ypos 
      }}
      className={`
        relative group flex flex-col justify-between p-2
        rounded-xl cursor-pointer select-none
        transition-all duration-300 ease-out will-change-transform
        border
        ${isHovered 
          ? `z-50 scale-110 bg-slate-800/95 border-cyan-400 shadow-2xl shadow-${baseColor}/50` 
          : 'z-0 bg-slate-900/40 border-slate-700/30 hover:bg-slate-800/60 hover:border-slate-500'
        }
        backdrop-blur-md
      `}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
    >
      {/* BACKGROUND: Subtle Category Gradient Blob */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${gradientOnly} rounded-xl blur-xl`} />

      {/* DECOR: Tech Corners (HUD Look) */}
      <div className={`absolute top-1 left-1 w-1.5 h-1.5 border-t border-l transition-colors ${isHovered ? 'border-cyan-400' : 'border-slate-600'}`} />
      <div className={`absolute top-1 right-1 w-1.5 h-1.5 border-t border-r transition-colors ${isHovered ? 'border-cyan-400' : 'border-slate-600'}`} />
      <div className={`absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l transition-colors ${isHovered ? 'border-cyan-400' : 'border-slate-600'}`} />
      <div className={`absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r transition-colors ${isHovered ? 'border-cyan-400' : 'border-slate-600'}`} />

      {/* HEADER: Number & Mass */}
      <div className="flex justify-between items-start relative z-10 px-1">
        <span className={`text-[10px] font-mono font-bold leading-none ${isHovered ? 'text-cyan-400' : 'text-slate-500'}`}>
          {element.number}
        </span>
        <span className="text-[8px] font-mono text-slate-600 group-hover:text-slate-400 transition-colors">
          {element.atomic_mass ? Math.round(element.atomic_mass) : ''}
        </span>
      </div>

      {/* BODY: Symbol */}
      <div className="flex-1 flex items-center justify-center relative z-10 my-1">
        <span className={`
           text-xl md:text-3xl font-black tracking-tighter
           bg-clip-text text-transparent bg-gradient-to-br ${gradientOnly}
           filter drop-shadow-sm transition-all duration-300
           ${isHovered ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : ''}
        `}>
          {element.symbol}
        </span>
      </div>

      {/* FOOTER: Name */}
      <div className="text-center w-full overflow-hidden relative z-10 pb-1">
        <p className={`
           text-[8px] md:text-[9px] font-bold uppercase tracking-widest truncate transition-colors
           ${isHovered ? 'text-white' : 'text-slate-500'}
        `}>
          {element.name}
        </p>
      </div>

      {/* DECOR: Bottom Color Bar (Progress Bar Style) */}
      <div className="absolute bottom-2 left-3 right-3 h-[1px] bg-slate-800 overflow-hidden rounded-full">
         <div className={`h-full w-full bg-gradient-to-r ${gradientOnly} opacity-40 group-hover:opacity-100 transition-opacity`} />
      </div>
      
    </div>
  );
};

export default memo(ElementCard, (prev, next) => {
  return (
    prev.element.number === next.element.number && 
    prev.isHovered === next.isHovered
  );
});