export function buildAgentPrompt(
  name: string,
  description: string,
  notes: any[],
  thresholds: any,
  history: number[]
) {
  return `
# Role
You are an expert business strategy and data analyst.

# Task
Analyze the following metric data to provide actionable business advice.

# Data
- **Metric Name**: ${name}
- **Description**: ${description}
- **Notes (Contextual history/issues)**: ${JSON.stringify(notes)}
- **Performance Constraints (Thresholds)**: ${JSON.stringify(thresholds)}
- **Recent Performance (Last 12 Data Points)**:
${history?.slice(-12).map((val, idx) => `  - Period ${idx+1}: ${val}`).join('\n')}

# Instructions
1. Summarize the observed performance trend.
2. Identify any anomalies or critical patterns based on thresholds and notes.
3. Provide exactly 3 high-impact, actionable recommendations to improve performance.
4. Maintain a professional, data-centric tone.
`.trim();
}
