export type RAGStatus = 'RED' | 'AMBER' | 'GREEN';
export type AppView = 'dashboard' | 'predictions' | 'config';

export interface Thresholds {
  red: number; // Values below this are RED
  amber: number; // Values below this but above red are AMBER
}

export interface Metric {
  id: string;
  title: string;
  value: number;
  unit: string;
  status: RAGStatus;
  description: string;
  prediction?: string;
  target: number;
  thresholds: Thresholds;
  decimals?: number;
  enabled?: boolean;
  trend?: number; // 1, 0, -1
  lastUpdated?: number;
  dataSource?: 'Power BI' | 'Excel' | 'Database' | 'Manual';
  connectionString?: string;
  manualValue?: number;
  excelSheet?: string;
  excelRow?: number;
  excelColumn?: string;
}

export interface MetricHierarchy extends Metric {
  children?: MetricHierarchy[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  userId: string;
  action: string;
  details: string;
}

export interface CockpitConfig {
  metrics: {
    id: string;
    title: string;
    description: string;
    thresholds: {
      red: number;
      amber: number;
    };
    subMetrics?: string[]; // IDs of sub-metrics
  }[];
}
