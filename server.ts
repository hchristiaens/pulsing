import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
let firebaseApp;
if (admin.getApps().length === 0) {
  firebaseApp = admin.initializeApp({
    projectId: 'gen-lang-client-0411603755'
  });
} else {
  firebaseApp = admin.apps[0];
}
const db = getFirestore(firebaseApp, 'ai-studio-b930bd34-004c-4f02-92da-92384623ad07');

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

  app.post("/api/get-metric-advice", async (req, res) => {
    const { metricId } = req.body;
    try {
      // 1. Fetch metric from Firestore
      const metricDoc = await db.collection('metrics').doc(metricId).get();
      if (!metricDoc.exists) {
        return res.status(404).json({ error: "Metric not found" });
      }
      const metric = metricDoc.data();

      // 2. Fetch history (limit 12)
      const historySnapshot = await db.collection('metrics').doc(metricId).collection('history')
        .orderBy('timestamp', 'desc')
        .limit(12)
        .get();
      const history = historySnapshot.docs.map(doc => doc.data());
      
      // 3. Get Gemini advice (placeholder for the structured prompt)
      const prompt = `Analyze metric: ${metric?.title}. Description: ${metric?.description}. History: ${JSON.stringify(history)}. Notes: ${JSON.stringify(metric?.notes)}.`;
      
      let retries = 5;
      let response;
      
      while (retries > 0) {
        try {
          response = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite",
            contents: prompt,
          });
          break;
        } catch (error: any) {
          console.error(`Gemini API error (retry ${5 - retries + 1}/5) detected:`, error);
          
          // Robust check for 503 status
          const is503 = error.status === 503 || 
                        error.error?.code === 503 || 
                        error.message?.includes('503') ||
                        JSON.stringify(error).includes('503') ||
                        error.message?.toLowerCase().includes('unavailable');
          
          if (is503 && retries > 1) {
            retries--;
            const delay = Math.pow(2, 5 - retries) * 2000 + Math.random() * 1000;
            console.log(`Retrying in ${delay.toFixed(0)}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          throw error;
        }
      }

      res.json({ advice: response?.text });
    } catch (error: any) {
      console.error("Error fetching metric advice:", error);
      res.status(500).json({ error: error.message || "Failed to fetch AI advice" });
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
          model: "gemini-3.1-flash-lite",
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
        console.error(`Gemini API error (retry ${5 - retries + 1}/5) detected:`, error);
        
        // Robust check for 503 status
        const is503 = error.status === 503 || 
                      error.error?.code === 503 || 
                      error.message?.includes('503') ||
                      JSON.stringify(error).includes('503') ||
                      error.message?.toLowerCase().includes('unavailable');
        
        if (is503 && retries > 1) {
          retries--;
          const delay = Math.pow(2, 5 - retries) * 2000 + Math.random() * 1000;
          console.log(`Retrying in ${delay.toFixed(0)}ms...`);
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
