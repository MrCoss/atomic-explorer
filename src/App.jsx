import React, { useState } from 'react';
import Header from './components/Layout/Header';
import PeriodicTable from './components/PeriodicTable/PeriodicTable';
import ElementOverlay from './components/PeriodicTable/ElementOverlay';
import LabInterface from './components/Lab/LabInterface';
import ChatInterface from './components/Chat/ChatInterface';
import Challenges from './components/Gamification/Challenges'; 
import About from './components/Layout/About';
import { ELEMENTS } from './data/elements';
import { MessageSquareText } from 'lucide-react'; // Import icon for re-open button

const App = () => {
  const [activeTab, setActiveTab] = useState('table'); 
  const [selectedElement, setSelectedElement] = useState(null);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [labElements, setLabElements] = useState([]);
  
  // NEW: Control Chat Visibility
  const [isChatOpen, setIsChatOpen] = useState(true);
  
  const handleElementSelect = (el) => {
    setSelectedElement(el);
  };

  const handleAddToLab = (el) => {
    if (labElements.length < 6) {
      const newCompound = { ...el, uid: Date.now() + Math.random() };
      setLabElements(prev => [...prev, newCompound]);
    } else {
        alert("Lab workbench is full! Remove some elements first.");
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden selection:bg-cyan-500/30 font-sans">
      
      {/* --- MAIN CONTENT COLUMN (Expands when chat is closed) --- */}
      <div className="flex-1 flex flex-col relative min-w-0 transition-all duration-300 ease-out">
        
        <Header activeTab={activeTab} setActiveTab={setActiveTab} labCount={labElements.length} />

        <main className="flex-1 pt-20 relative overflow-hidden flex flex-col">
          
          {/* 1. TABLE VIEW */}
          {activeTab === 'table' && (
            <>
              <PeriodicTable 
                elements={ELEMENTS} 
                activeElement={hoveredElement}
                onHover={setHoveredElement}
                onSelect={handleElementSelect}
              />
              {selectedElement && (
                <ElementOverlay 
                  element={selectedElement}
                  onClose={() => setSelectedElement(null)}
                  onAddToLab={handleAddToLab}
                />
              )}
            </>
          )}

          {/* 2. LAB VIEW */}
          {activeTab === 'lab' && (
            <LabInterface 
              labElements={labElements} 
              clearLab={() => setLabElements([])} 
              onRemove={(uid) => setLabElements(prev => prev.filter(e => e.uid !== uid))}
            />
          )}

          {/* 3. GAME VIEW */}
          {activeTab === 'game' && (
            <div className="h-full flex flex-col relative">
               <div className="flex-1 relative z-0 opacity-20 pointer-events-none">
                  <PeriodicTable 
                     elements={ELEMENTS} 
                     activeElement={null}
                     onHover={() => {}}
                     onSelect={() => {}}
                  />
               </div>
               <div className="absolute inset-0 z-10">
                  <Challenges activeElement={selectedElement} />
               </div>
            </div>
          )}

          {/* 4. ABOUT VIEW */}
          {activeTab === 'about' && <About />}

        </main>

        {/* Floating "Open Chat" Button (Visible only when chat is closed) */}
        {!isChatOpen && activeTab !== 'about' && (
            <button 
                onClick={() => setIsChatOpen(true)}
                className="absolute bottom-6 right-6 z-50 w-12 h-12 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center transition-all hover:scale-110 active:scale-95 animate-in fade-in zoom-in"
                title="Open AI Assistant"
            >
                <MessageSquareText size={20} />
            </button>
        )}
      </div>

      {/* --- CHAT SIDEBAR (Collapsible) --- */}
      {/* Logic: Show sidebar only if activeTab is NOT 'about' AND isChatOpen is true */}
      {activeTab !== 'about' && isChatOpen && (
        <aside className="w-80 md:w-96 border-l border-slate-800 hidden lg:flex flex-col relative z-40 bg-slate-950 shadow-2xl transition-all duration-300">
           <ChatInterface 
              activeElement={selectedElement || hoveredElement} 
              onClose={() => setIsChatOpen(false)} // Pass the close handler
           />
        </aside>
      )}

    </div>
  );
};

export default App;