import { Router } from "express";
import { GoogleGenAI, Type } from "@google/genai";

const router = Router();

// Lazy initializer for Google GenAI client to prevent crash if key is missing on boot
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please configure it in your Secrets / .env file.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// POST endpoint for Gemini AI analysis
// Takes a base64 encoded image block, asks Gemini to extract brand, model, specs, etc.
router.post("/", async (req, res) => {
  const { image } = req.body;

  if (!image) {
    res.status(400).json({ error: "Image data is required in base64 format." });
    return;
  }

  try {
    const ai = getGeminiClient();
    
    // strip standard header if included
    let rawBase64 = image;
    let mimeType = "image/jpeg";
    
    if (image.includes(";base64,")) {
      const parts = image.split(";base64,");
      const mimePart = parts[0]; // e.g. "data:image/png"
      rawBase64 = parts[1];
      mimeType = mimePart.replace("data:", "");
    }

    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: rawBase64,
      },
    };

    const promptMessage = `Identify the phone in this image. Give your best estimate for:
1. Brand (e.g. Apple, Samsung, Google, Nothing, Xiaomi)
2. Model (e.g. iPhone 15 Pro, Galaxy S24 Ultra, Pixel 8)
3. Color (e.g. Black Titanium, Bay Blue, Obsidian, Granite)
4. Key Specs / features (e.g. dynamic island, triple camera, flat panels, status)
5. Estimated Average Market Retail Value in USD as a pure integer. (Be realistic. e.g. 700)
6. Suggested default storage capacity (e.g., '128GB', '256GB')
7. Likely apparent physical condition (one of 'Excellent', 'Good', 'Fair', 'Poor') based on any scratches, cracked glass, or generic mock-ups. Default to 'Good' if you cannot see damage.

Be precise. If it is a generic photo, abstract hand drawn, or mock placeholder image of a phone, output a standard sleek modern phone model matching the silhouette.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { 
        parts: [
          imagePart, 
          { text: promptMessage }
        ] 
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            brand: { type: Type.STRING, description: "Highly likely brand of the phone" },
            model: { type: Type.STRING, description: "Likely model name of the phone" },
            color: { type: Type.STRING, description: "Estimated color of the device pictured" },
            suggestedStorage: { type: Type.STRING, description: "Default base gigabytes e.g. '128GB', '256GB', '512GB'" },
            specifications: { type: Type.STRING, description: "Short descriptive sentence detailing the physical characteristics and camera setup" },
            estimatedValue: { type: Type.INTEGER, description: "An integer representing the current average resale/market value in USD" },
            condition: { type: Type.STRING, description: "One of 'Excellent', 'Good', 'Fair', 'Poor' matching visible state" }
          },
          required: ["brand", "model", "color", "suggestedStorage", "specifications", "estimatedValue", "condition"]
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("Empty response received from Gemini.");
    }

    try {
      const parsed = JSON.parse(textOutput.trim());
      res.json({ success: true, analysis: parsed });
    } catch (parseErr) {
      console.error("Failed to parse Gemini output as JSON: ", textOutput);
      res.status(500).json({ 
        error: "Gemini did not return valid JSON. Plain response:", 
        rawText: textOutput 
      });
    }

  } catch (error: any) {
    console.error("Error analyzing phone: ", error);
    res.status(500).json({ 
      error: error?.message || "Internal server error during phone image scanning" 
    });
  }
});

export default router;
