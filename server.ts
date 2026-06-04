import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

import inventoryRoutes from "./server/routes/inventory.ts";
import analyzeRoutes from "./server/routes/analyze.ts";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for JSON reading
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mode: process.env.NODE_ENV || "development" });
});

// Register routes
app.use("/api/inventory", inventoryRoutes);
app.use("/api/analyze-phone", analyzeRoutes);

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
