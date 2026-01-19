import React, { useState } from 'react';
import PeriodicTable from './PeriodicTable';
import ElementOverlay from './ElementOverlay';
import { ELEMENTS } from '../../data/elements'; // Ensure path is correct
import useAudio from '../../hooks/useAudio';

const TableLayout = () => {
  const [selectedElement, setSelectedElement] = useState(null);
  const { play } = useAudio();

  // Handle clicking an element in the grid
  const handleSelect = (element) => {
    // play('select'); // Sound is already handled in ElementCard
    setSelectedElement(element);
  };

  // Handle closing the overlay
  const handleClose = () => {
    play('click');
    setSelectedElement(null);
  };

  // Handle the "Add to Lab" action from the overlay
  const handleAddToLab = (element) => {
    console.log(`Added ${element.name} to Lab`);
    // Here you would typically update a global context or Redux store
    // For now, we just close the overlay
    setSelectedElement(null);
  };

  return (
    <div className="w-full h-full bg-slate-950 relative overflow-hidden">
      
      {/* 1. THE GRID (Dumb Component) */}
      <PeriodicTable 
        elements={ELEMENTS}
        onSelect={handleSelect}
        activeElement={selectedElement}
        onHover={() => {}} // Optional hover logic
      />

      {/* 2. THE OVERLAY (Smart Component) 
          Only renders when an element is selected */}
      {selectedElement && (
        <ElementOverlay 
          element={selectedElement}
          onClose={handleClose}
          onAddToLab={handleAddToLab}
        />
      )}

    </div>
  );
};

export default TableLayout;