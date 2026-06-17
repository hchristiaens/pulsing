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
    console.log("Analyze metric request received:", req.body);
    const { metricName, history, thresholds, notes, description } = req.body;
    let retries = 5;
    let response;
    
    while (retries > 0) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: `Analyze the performance of this metric: ${metricName}. 
          Description: ${description}
          History (last 12): ${history?.slice(-12).join(',')}
          Thresholds: ${JSON.stringify(thresholds)}
          Notes: ${JSON.stringify(notes)}
          Summarize the trend and provide actionable advice to improve.`,
          config: {
            systemInstruction: "You are a team of expert data analysts. Collaborate to provide a comprehensive, actionable, and data-driven analysis of the following metric based on the provided history, thresholds, and notes.",
          },
        });
        break;
      } catch (error: any) {
        console.error("Gemini API error:", error);
        if (error.status === 503 && retries > 1) {
          retries--;
          const delay = Math.pow(2, 5 - retries) * 2000;
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        res.status(500).json({ error: error.message || "Failed to analyze metric" });
        return;
      }
    }
    
    if (response) {
      res.json({ advice: response.text });
    } else {
      res.status(500).json({ error: "Failed to analyze metric after retries" });
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
