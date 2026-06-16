import yaml from 'js-yaml';
import { MetricHierarchy, RAGStatus } from '../types';

export interface ConfigMetric {
  id: string;
  title: string;
  description: string;
  target: number;
  weight: number;
  value?: number;
  accountablePerson?: string;
  deadline?: string;
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

export function calculateLinearRegression(history: number[]): { slope: number; intercept: number } {
  const n = history.length;
  if (n < 2) return { slope: 0, intercept: history[0] || 0 };

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += history[i];
    sumXY += i * history[i];
    sumXX += i * i;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}
