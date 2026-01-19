import { useState, useCallback } from 'react';
// CRITICAL UPDATE: Import from the new AI Hub service
import { sendMessageToGemini, simulateReaction } from '../services/aihub';

export const useGemini = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Chat Function
  const chat = useCallback(async (prompt, history) => {
    setLoading(true);
    setError(null);
    try {
      const response = await sendMessageToGemini(prompt, history);
      return response;
    } catch (err) {
      console.error("AI Hub Chat Error:", err);
      setError(err.message || "AI Connection failed");
      return "Network unstable. All AI models are currently unreachable. Please try again in a moment.";
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Reaction Analysis Function
  const analyzeReaction = useCallback(async (elementA, elementB) => {
    setLoading(true);
    setError(null);
    try {
      if (!elementA || !elementB) throw new Error("Two elements required.");
      const result = await simulateReaction(elementA, elementB);
      return result;
    } catch (err) {
      console.error("Reaction Simulation Error:", err);
      setError("Simulation failed.");
      return {
        reacts: false,
        visuals: "Simulation Offline",
        explanation: "Unable to calculate reaction parameters. Check internet connection.",
        equation: null
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return { chat, analyzeReaction, loading, error };
};