
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Product } from "../types";

// Initialize Gemini
const API_KEY = (import.meta as any).env.VITE_GEMINI_API_KEY || (window as any).GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

export const getTownSuggestions = async (input: string): Promise<string[]> => {
    if (!API_KEY || !input || input.length < 2) return [];

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `
            Act as a location assistant for a Kenyan e-commerce store.
            The user is typing a delivery town in Kenya. Current input: "${input}"
            
            Return a JSON array of up to 5 legitimate Kenyan town or neighborhood names that match this input.
            Focus on popular areas in Nairobi and major towns across Kenya.
            Return ONLY the JSON array of strings. No markdown, no explanation.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(text);
    } catch (error) {
        console.error("Gemini Town Suggestions Error:", error);
        return [];
    }
};

export const getSmartRecommendations = async (
    userPrefs: { budget: string; usage: string; category: string; vibe: string },
    products: Product[]
): Promise<string[]> => {
    if (!API_KEY) {
        console.warn("Gemini API Key missing. Returning fallback.");
        return products.slice(0, 3).map(p => p.id);
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
      Act as an expert tech shop assistant named 'Deenice AI'.
      
      User Preferences:
      - Budget: ${userPrefs.budget}
      - Main Usage: ${userPrefs.usage}
      - Vibe/Style: ${userPrefs.vibe}
      - Category Interest: ${userPrefs.category}

      Available Inventory (JSON):
      ${JSON.stringify(products.map(p => ({ id: p.id, name: p.name, price: p.price, desc: p.description, cat: p.category })))}

      Task:
      Select the top 3 best matching products from the inventory for this user.
      Return ONLY a distinct JSON array of product IDs representing your choices. 
      Example format: ["id1", "id2", "id3"]
      Do not include markdown formatting or explanation. Just the JSON array.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(text);
    } catch (error) {
        console.error("Gemini AI Error:", error);
        // Fallback to simple filtering if AI fails
        return products
            .filter(p => p.category.includes(userPrefs.category) || p.description.includes(userPrefs.usage))
            .slice(0, 3)
            .map(p => p.id);
    }
};
