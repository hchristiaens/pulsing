import { GoogleGenAI } from "@google/genai";
import yaml from 'js-yaml';
import { MetricHierarchy, RAGStatus } from '../types.ts';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface ConfigMetric {
  id: string;
  title: string;
  description: string;
  target: number;
  weight: number;
  thresholds?: { red: number; amber: number };
  metrics?: number; // Number of L3 metrics
  subMetrics?: ConfigMetric[];
}

export async function fetchMetricConfig(): Promise<ConfigMetric[]> {
  const response = await fetch('/config/metrics.yaml');
  const text = await response.text();
  return yaml.load(text) as ConfigMetric[];
}

export function calculateStatus(value: number, thresholds: { red: number; amber: number }): RAGStatus {
  if (value < thresholds.red) return 'RED';
  if (value < thresholds.amber) return 'AMBER';
  return 'GREEN';
}

// ... rest of the file ...

export async function getAiPrediction(metric: MetricHierarchy): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `As a performance analyst, interpret this metric:
      Title: ${metric.title}
      Current Value: ${metric.value}${metric.unit}
      Status: ${metric.status}
      Description: ${metric.description}
      
      Provide a concise (1-2 sentence) prediction of the outcome in the next 30 days based on these trends. Include a recommendation.`
    });
    
    return response.text || "Prediction currently unavailable. Data trend analysis inconclusive.";
  } catch (err) {
    console.error("AI Prediction Error:", err);
    return "Prediction currently unavailable. High probability of status maintenance.";
  }
}
