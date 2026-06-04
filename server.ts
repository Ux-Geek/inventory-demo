import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for JSON reading
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

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

// In-Memory Database for Phone Inventory seeded with premium realistic entries
interface PhoneRecord {
  id: string;
  brand: string;
  model: string;
  color: string;
  storage: string;
  condition: "Excellent" | "Good" | "Fair" | "Poor";
  specifications: string;
  estimatedValue: number;
  sellerPrice: number;
  imei: string;
  imageUrl?: string;
  createdAt: string;
  status: "In Stock" | "Sold" | "Reserved";
}

let inventory: PhoneRecord[] = [
  {
    id: "phone-1",
    brand: "Apple",
    model: "iPhone 15 Pro Max",
    color: "Natural Titanium",
    storage: "256GB",
    condition: "Excellent",
    specifications: "Triple 48MP/12MP/12MP cameras with 5x telephoto zoom, A17 Pro Chip, 120Hz OLED screen, USB-C 3.0",
    estimatedValue: 950,
    sellerPrice: 999,
    imei: "358921102948123",
    imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=60",
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(), // 2 days ago
    status: "In Stock"
  },
  {
    id: "phone-2",
    brand: "Samsung",
    model: "Galaxy S24 Ultra",
    color: "Titanium Gray",
    storage: "512GB",
    condition: "Excellent",
    specifications: "Quad 200MP camera, Snapdragon 8 Gen 3 for Galaxy, S-Pen included, flat 6.8-inch display",
    estimatedValue: 1050,
    sellerPrice: 1099,
    imei: "351182281928341",
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=60",
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(), // 1 day ago
    status: "In Stock"
  },
  {
    id: "phone-3",
    brand: "Google",
    model: "Pixel 8 Pro",
    color: "Bay Blue",
    storage: "128GB",
    condition: "Good",
    specifications: "Google Tensor G3 chip, AI Camera features, temperature sensor, Matte finish glass panel",
    estimatedValue: 620,
    sellerPrice: 650,
    imei: "354123512391024",
    imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=60",
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(), // 4 hours ago
    status: "Reserved"
  }
];

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mode: process.env.NODE_ENV || "development" });
});

// GET phone inventory
app.get("/api/inventory", (req, res) => {
  res.json(inventory);
});

// POST to phone inventory
app.post("/api/inventory", (req, res) => {
  const { brand, model, color, storage, condition, specifications, estimatedValue, sellerPrice, imei, imageUrl, status } = req.body;
  
  if (!brand || !model) {
    res.status(400).json({ error: "Brand and Model are required" });
    return;
  }

  const newRecord: PhoneRecord = {
    id: "phone-" + Math.random().toString(36).substring(2, 11),
    brand,
    model,
    color: color || "Unknown",
    storage: storage || "128GB",
    condition: condition || "Good",
    specifications: specifications || "",
    estimatedValue: Number(estimatedValue) || 0,
    sellerPrice: Number(sellerPrice) || 0,
    imei: imei || "",
    imageUrl: imageUrl || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60",
    createdAt: new Date().toISOString(),
    status: status || "In Stock"
  };

  inventory.unshift(newRecord);
  res.status(201).json(newRecord);
});

// PUT (update) a phone record
app.put("/api/inventory/:id", (req, res) => {
  const { id } = req.params;
  const index = inventory.findIndex(item => item.id === id);

  if (index === -1) {
    res.status(404).json({ error: "Item not found" });
    return;
  }

  inventory[index] = {
    ...inventory[index],
    ...req.body,
    // ensure we don't accidentally override standard fields maliciously
    id: inventory[index].id,
    createdAt: inventory[index].createdAt
  };

  res.json(inventory[index]);
});

// DELETE a phone record
app.delete("/api/inventory/:id", (req, res) => {
  const { id } = req.params;
  const index = inventory.findIndex(item => item.id === id);

  if (index === -1) {
    res.status(404).json({ error: "Item not found" });
    return;
  }

  const deleted = inventory.splice(index, 1);
  res.json({ success: true, deleted: deleted[0] });
});

// POST endpoint for Gemini AI analysis
// Takes a base64 encoded image block, asks Gemini to extract brand, model, specs, etc.
app.post("/api/analyze-phone", async (req, res) => {
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

// Vite Setup or Static Asset handler
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Support SPA routing - server-side wildcards
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Phone Scanner Server] Running successfully on http://localhost:${PORT}`);
  });
}

startServer();
