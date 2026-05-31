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
