export async function analyzeMetric(metricName: string): Promise<string | undefined> {
  try {
    const response = await fetch("/api/analyze-metric", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ metricName }),
    });

    if (!response.ok) {
      throw new Error("Failed to analyze metric");
    }

    const data = await response.json();
    return data.advice;
  } catch (error) {
    console.error("Error analyzing metric:", error);
    return undefined;
  }
}
