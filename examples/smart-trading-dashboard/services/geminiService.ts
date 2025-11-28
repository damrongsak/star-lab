import { GoogleGenAI, Type, SchemaType } from "@google/genai";
import { JournalEntry } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getMarketAnalysis = async (query: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const response = await ai.models.generateContent({
      model: model,
      contents: `You are a professional financial trading assistant. 
      Analyze the following query concisely for a trader: "${query}". 
      Keep the tone professional, objective, and risk-aware. 
      Limit response to 3 sentences.`,
    });

    return response.text || "Analysis currently unavailable.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to connect to market analysis service at this time.";
  }
};

export const getPortfolioInsight = async (totalBalance: number, pl: number): Promise<string> => {
    try {
        const model = 'gemini-2.5-flash';
        const prompt = `
            I am a trader. My total balance is ${totalBalance} and my current unrealized P/L is ${pl}.
            Give me a very short, 1-sentence motivational or cautionary advice based on this performance.
        `;
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        return response.text || "Keep watching the markets.";
    } catch (e) {
        return "Data analysis unavailable.";
    }
};

export const analyzeJournalEntry = async (entry: Omit<JournalEntry, 'id' | 'date' | 'aiAnalysis'>): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      You are an expert Trading Psychologist specializing in the "Mental Game of Trading" methodology (Jared Tendler).
      Analyze the following trading journal entry.
      
      CONTEXT:
      - Game Level: ${entry.gameLevel}
      - Technical Score: ${entry.technicalScore}/10
      - PnL: ${entry.pnl}
      
      MENTAL PATTERN:
      - Triggers: ${entry.mentalPattern.triggers}
      - Thoughts: ${entry.mentalPattern.thoughts}
      - Emotions: ${entry.mentalPattern.emotions}
      - Behaviors: ${entry.mentalPattern.behaviors}
      
      SEVERITY SCALES (1-10):
      - Greed: ${entry.severity.greed}
      - Fear: ${entry.severity.fear}
      - Tilt: ${entry.severity.tilt}
      - Confidence: ${entry.severity.confidence}
      
      USER'S ROOT CAUSE ANALYSIS:
      - Problem: ${entry.handHistory.problem}
      - Flaw: ${entry.handHistory.flaw}
      - Correction: ${entry.handHistory.correction}
      
      TASK:
      1. Identify the specific "Inchworm" pattern or emotional threshold crossed.
      2. Critique their Root Cause Analysis. Did they dig deep enough into the underlying flaw?
      3. Provide one concrete actionable step to improve their "Correction" strategy for next time.
      
      Keep the response concise, coaching-oriented, and structured. Max 150 words.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "AI Analysis unavailable.";
  } catch (error) {
    console.error("Gemini Journal Analysis Error:", error);
    return "Unable to perform AI analysis at this time.";
  }
};