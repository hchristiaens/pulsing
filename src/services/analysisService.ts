import { Thresholds, MetricNote } from "../types";

export async function analyzeMetric(
  metricName: string, 
  history: number[], 
  thresholds: Thresholds, 
  notes: MetricNote[], 
  description: string,
  customPrompt?: string
): Promise<string | undefined> {
  console.log("analyzeMetric called with:", { metricName, customPrompt });
  try {
    const response = await fetch("/api/analyze-metric", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ metricName, history, thresholds, notes, description, customPrompt }),
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
    return `Error: Could not analyze metric. ${error instanceof Error ? error.message : String(error)}`;
  }
}
