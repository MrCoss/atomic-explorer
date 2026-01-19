// --- CONFIGURATION ---
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const SITE_URL = "http://localhost:5173"; 
const SITE_NAME = "Atomic Explorer";
const DEBUG_MODE = true; // Set to false to silence console logs

// --- STYLED LOGGER UTILITY ---
const Logger = {
  info: (msg, data = "") => DEBUG_MODE && console.log(`%c[AI HUB] ℹ️ ${msg}`, "color: #0ea5e9; font-weight: bold;", data),
  success: (msg, latency) => DEBUG_MODE && console.log(`%c[AI HUB] ✅ ${msg} (${latency}ms)`, "color: #22c55e; font-weight: bold;"),
  warn: (msg, error) => DEBUG_MODE && console.warn(`%c[AI HUB] ⚠️ ${msg}`, "color: #eab308; font-weight: bold;", error),
  error: (msg, error) => DEBUG_MODE && console.error(`%c[AI HUB] ❌ ${msg}`, "color: #ef4444; font-weight: bold;", error),
};

// Initial Diagnostic
console.log(`%c[AI HUB] System Online. Key Status: ${API_KEY ? 'FOUND' : 'MISSING'}`, "color: #00ffff; font-weight: bold; bg: #0f172a; padding: 4px;");

/**
 * THE ULTIMATE FREE MODEL LIST
 * Includes Llama 3.2, Llama 405B, Gemini, Qwen, and Gemma.
 */
const MODELS = [
    
    
  // 1. FAST & RELIABLE (The "Daily Drivers")
  "meta-llama/llama-3.2-3b-instruct:free",
  "google/gemini-2.0-flash-lite-preview-02-05:free",
  "google/gemini-2.0-flash-exp:free",

  // 2. HEAVY HITTERS (Huge Intelligence)
  "meta-llama/llama-3.1-405b-instruct:free",
  "meta-llama/llama-3.1-70b-instruct:free",

  // 3. SPECIALIZED / NEW (Reasoning & Visuals)
  "qwen/qwen-2.5-vl-7b-instruct:free",
  "qwen/qwen-2.5-coder-32b-instruct:free",
  
  // 4. GOOGLE GEMMA FAMILY (Newest Additions)
  "google/gemma-3-27b-it:free", 
  "google/gemma-2-9b-it:free",

  // 5. BACKUPS
  "microsoft/phi-3-mini-128k-instruct:free",
  "mistralai/mistral-7b-instruct:free",
  "huggingfaceh4/zephyr-7b-beta:free"
];

/**
 * ROBUST RECURSIVE FAILOVER SYSTEM
 */
async function callOpenRouter(messages, modelIndex = 0) {
  // 1. Critical Validation
  if (!API_KEY) {
    Logger.error("CRITICAL: API Key is missing in .env");
    throw new Error("API Key Missing");
  }

  // 2. Exhaustion Check
  if (modelIndex >= MODELS.length) {
    Logger.error("ALL MODELS FAILED. The network is unreachable.");
    throw new Error("All AI Hub models are currently busy or offline. Please check your internet connection.");
  }

  const currentModel = MODELS[modelIndex];
  const startTime = performance.now();

  try {
    if (modelIndex === 0) Logger.info(`Initiating sequence with: ${currentModel}`);
    else Logger.info(`Failover attempt ${modelIndex + 1}: Switching to ${currentModel}...`);
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "HTTP-Referer": SITE_URL,
        "X-Title": SITE_NAME,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: currentModel,
        messages: messages,
        temperature: 0.7,
      })
    });

    // 3. Deep Error Inspection
    if (!response.ok) {
      const errorText = await response.text();
      let errorDetails = "Unknown Error";
      try {
        const jsonError = JSON.parse(errorText);
        errorDetails = jsonError.error?.message || jsonError.error || errorText;
      } catch (e) {
        errorDetails = errorText;
      }

      Logger.warn(`${currentModel} Rejected (${response.status})`, errorDetails);
      
      // RECURSIVE CALL -> NEXT MODEL
      return callOpenRouter(messages, modelIndex + 1);
    }

    const data = await response.json();
    
    // 4. Empty Data Check
    if (!data.choices || !data.choices[0]?.message?.content) {
      Logger.warn(`${currentModel} returned an empty response.`, data);
      return callOpenRouter(messages, modelIndex + 1);
    }

    // 5. SUCCESS
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);
    Logger.success(`Connected to ${currentModel}`, duration);
    
    return data.choices[0].message.content;

  } catch (error) {
    // 6. Network/DNS Error Handling
    Logger.warn(`Network Failure with ${currentModel}`, error.message);
    return callOpenRouter(messages, modelIndex + 1);
  }
}

/**
 * CHAT FUNCTION (Compatibility Wrapper)
 */
export const sendMessageToGemini = async (newMessage, history = []) => {
  const systemInstruction = "You are Atomic Explorer, a chemistry assistant. Keep answers short, scientific, and helpful. Use bolding for element names.";

  // Clean History
  const cleanHistory = history
    .filter(msg => msg.content && msg.content.trim() !== "")
    .filter(msg => msg.role === 'user' || msg.role === 'assistant' || msg.role === 'model') 
    .map(msg => ({
      role: msg.role === 'model' ? 'assistant' : 'user', 
      content: msg.content
    }));

  // Construct Messages
  let finalMessages = [];

  if (cleanHistory.length === 0) {
    finalMessages = [
      { role: "user", content: `${systemInstruction}\n\nQuestion: ${newMessage}` }
    ];
  } else {
    cleanHistory[0].content = `${systemInstruction}\n\n${cleanHistory[0].content}`;
    finalMessages = [
      ...cleanHistory,
      { role: "user", content: newMessage }
    ];
  }

  return await callOpenRouter(finalMessages);
};

/**
 * LAB SIMULATOR (Robust JSON Parser)
 */
export const simulateReaction = async (elementA, elementB) => {
  const prompt = `
  Analyze the chemical reaction between ${elementA} and ${elementB}.
  Return strictly valid JSON (no markdown):
  { 
    "reacts": boolean, 
    "equation": "Balanced Chemical Equation or null", 
    "visuals": "Short visual description", 
    "explanation": "One scientific sentence.",
    "dangerLevel": "None",
    "type": "synthesis"
  }`;

  try {
    const text = await callOpenRouter([{ role: "user", content: prompt }]);
    
    // Aggressive JSON Cleaning
    const cleanText = text.replace(/```json|```/g, "").trim();
    
    try {
      return JSON.parse(cleanText);
    } catch (parseError) {
      Logger.error("JSON Parse Failed", { text: cleanText, error: parseError });
      // Attempt to repair simple JSON errors or return fallback
      return { 
        reacts: false, 
        explanation: "Data corruption in analysis stream.", 
        visuals: "Glitch", 
        type: "neutral", 
        dangerLevel: "None" 
      };
    }

  } catch (error) {
    Logger.error("Simulation Failed completely", error);
    return { 
      reacts: false, 
      explanation: "Analysis currently unavailable.", 
      visuals: "Offline", 
      type: "neutral", 
      dangerLevel: "None" 
    };
  }
};