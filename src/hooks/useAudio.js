import { useState, useCallback } from 'react';

// --- Import Sound Assets ---
import hoverSound from '../assets/sounds/mixkit-egg-bubble-pop-3192.wav';
import selectSound from '../assets/sounds/mixkit-modern-technology-select-3124.wav';
import successSound from '../assets/sounds/mixkit-retro-arcade-casino-notification-211.wav';
import uiClickSound from '../assets/sounds/mixkit-sci-fi-click-900.wav';
import aiThinkingSound from '../assets/sounds/mixkit-sci-fi-confirmation-914.wav';
import aiResponseSound from '../assets/sounds/mixkit-sci-fi-interface-robot-click-901.wav';
import mixingSound from '../assets/sounds/mixkit-volcano-lava-bubble-2445.wav';
import addToLabSound from '../assets/sounds/mixkit-water-bubble-1317.wav';
import failSound from '../assets/sounds/mixkit-wrong-long-buzzer-954.wav';
import errorSound from '../assets/sounds/mixkit-wrong-long-buzzer-954.wav'; 

const SOUND_MAP = {
  hover: hoverSound,
  select: selectSound,
  success: successSound,
  click: uiClickSound,
  scan: aiThinkingSound,
  response: aiResponseSound,
  mix: mixingSound,
  add: addToLabSound,
  fail: failSound,
  error: errorSound
};

const MASTER_VOLUME = 0.4; 

const useAudio = () => {
  const [isMuted, setIsMuted] = useState(false);

  const play = useCallback((soundKey, specificVolume = 1.0) => {
    // 1. Check mute state or SSR
    if (isMuted || typeof window === 'undefined') return;

    const src = SOUND_MAP[soundKey];
    if (!src) {
      console.warn(`[Audio] Key "${soundKey}" missing.`);
      return;
    }

    try {
      // 2. Create new Audio instance for overlap capability
      const sound = new Audio(src);
      
      const finalVolume = Math.min(Math.max(specificVolume * MASTER_VOLUME, 0), 1);
      sound.volume = finalVolume;

      const playPromise = sound.play();

      if (playPromise !== undefined) {
        playPromise.catch(error => {
          if (error.name !== 'NotAllowedError') {
            console.error("[Audio] Playback error:", error);
          }
        });
      }
    } catch (e) {
      console.error("[Audio] Critical error:", e);
    }
  }, [isMuted]); // Re-create function only if mute state changes

  const toggleMute = () => setIsMuted(prev => !prev);

  return { play, isMuted, toggleMute };
};

export default useAudio;