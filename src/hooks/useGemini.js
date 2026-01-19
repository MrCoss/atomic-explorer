import { useState, useCallback } from 'react';
import { sendMessageToGemini } from '../services/aihub';

export const useGemini = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const chat = useCallback(async (newMessage, history) => {
    setLoading(true);
    setError(null);
    
    try {
      // Uses the failover system in aihub.js
      const response = await sendMessageToGemini(newMessage, history);
      return response;
    } catch (err) {
      console.error("Gemini Hook Error:", err);
      setError(err.message || "Failed to connect to AI.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { chat, loading, error };
};