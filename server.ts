import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;
  app.use(express.json());

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  app.post("/api/analyze-metric", async (req, res) => {
    const { metricName } = req.body;
    try {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `Analyze the performance of this metric: ${metricName}. Summarize the trend and provide actionable advice.`,
          config: {
            systemInstruction: "You are a team of expert data analysts. Collaborate to provide a comprehensive analysis of the following metric.",
          },
        });
        res.json({ advice: response.text });
    } catch (error) {
        console.error("Gemini API error:", error);
        res.status(500).json({ error: "Failed to analyze metric" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
