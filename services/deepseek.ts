
import { Product } from "../types";

// Initialize DeepSeek configuration
const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || (window as any).DEEPSEEK_API_KEY || '';
const API_URL = "https://api.deepseek.com/chat/completions";

export const getSmartRecommendations = async (
    userPrefs: { budget: string; usage: string; category: string; vibe: string; brand: string },
    products: Product[]
): Promise<string[]> => {
    if (!API_KEY) {
        console.warn("DeepSeek API Key missing. Returning fallback.");
        return products.slice(0, 3).map(p => p.id);
    }

    try {
        const prompt = `
      Act as an expert tech shop assistant named 'Deenice AI'.
      
      User Preferences:
      - Category: ${userPrefs.category}
      - Specific Brand/Type: ${userPrefs.brand}
      - Budget: ${userPrefs.budget}
      - Main Usage: ${userPrefs.usage}
      - Vibe: ${userPrefs.vibe}

      Available Inventory (JSON):
      ${JSON.stringify(products.map(p => ({ id: p.id, name: p.name, price: p.price, desc: p.description, cat: p.category })))}

      Task:
      Select the top 3 best matching products from the inventory for this user.
      Return ONLY a distinct JSON array of product IDs representing your choices. 
      Example format: ["id1", "id2", "id3"]
      Do not include markdown formatting or explanation. Just the JSON array.
    `;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: "You are a helpful assistant that outputs only JSON." },
                    { role: "user", content: prompt }
                ],
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`DeepSeek API Error: ${response.statusText}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        // Clean up markdown if present
        const jsonText = content.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(jsonText);
    } catch (error) {
        console.error("DeepSeek AI Error:", error);
        // Fallback to simple filtering if AI fails
        return products
            .filter(p => p.category.includes(userPrefs.category) || p.description.includes(userPrefs.usage))
            .slice(0, 3)
            .map(p => p.id);
    }
};
