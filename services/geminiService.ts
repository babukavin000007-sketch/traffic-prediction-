
import { GoogleGenAI } from "@google/genai";
import { PredictionResult, SearchParams } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async predictTraffic(params: SearchParams, userLocation?: { lat: number; lng: number }): Promise<PredictionResult> {
    const { source, destination, time, day } = params;
    
    const prompt = `
      As a Bengaluru traffic expert, analyze and predict traffic conditions for a commute from ${source} to ${destination} at ${time} on ${day}.
      Consider current real-time data, weather, metro construction, and historical patterns in Bengaluru.
      
      Structure your response as JSON:
      {
        "score": number (0-100 where 100 is total gridlock),
        "summary": "Short concise summary",
        "factors": ["list of reasons e.g. Rain, Metro work, Peak hours"],
        "bestTimeToLeave": "Recommended time",
        "alternativeRoutes": ["Route names or major roads to take"]
      }
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          tools: [{ googleSearch: {} }, { googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: userLocation ? { latitude: userLocation.lat, longitude: userLocation.lng } : undefined
            }
          }
        },
      });

      const data = JSON.parse(response.text || '{}');
      
      // Extract grounding links
      const links: Array<{ uri: string; title: string }> = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      
      chunks.forEach((chunk: any) => {
        if (chunk.web) links.push({ uri: chunk.web.uri, title: chunk.web.title });
        if (chunk.maps) links.push({ uri: chunk.maps.uri, title: chunk.maps.title });
      });

      return {
        score: data.score || 50,
        summary: data.summary || "No specific prediction available.",
        factors: data.factors || [],
        bestTimeToLeave: data.bestTimeToLeave || "Standard time",
        alternativeRoutes: data.alternativeRoutes || [],
        groundingLinks: links
      };
    } catch (error) {
      console.error("Traffic prediction failed:", error);
      throw error;
    }
  }

  async getQuickUpdates(): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Summarize the top 3 traffic alerts or major roadblocks in Bengaluru right now based on news and social media trends.",
        config: {
          tools: [{ googleSearch: {} }]
        }
      });
      return response.text || "No major alerts found.";
    } catch (e) {
      return "Unable to fetch live alerts.";
    }
  }
}
