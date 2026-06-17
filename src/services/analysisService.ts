import { Thresholds, MetricNote } from "../types";

export async function analyzeMetric(
  metricName: string, 
  history: number[], 
  thresholds: Thresholds, 
  notes: MetricNote[], 
  description: string
): Promise<string | undefined> {
  try {
    const response = await fetch("/api/analyze-metric", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ metricName, history, thresholds, notes, description }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error("Analysis service error:", errorData);
      throw new Error(errorData.error || 'Failed to analyze metric');
    }

    const data = await response.json();
    return data.advice;
  } catch (error) {
    console.error("Error analyzing metric:", error);
    return undefined;
  }
}
