export type RAGStatus = 'RED' | 'AMBER' | 'GREEN';
export type AppView = 'dashboard' | 'config' | 'org-selection';

export interface Thresholds {
  red: number; // Values below this are RED
  amber: number; // Values below this but above red are AMBER
}

export interface MetricNote {
  content: string;
  date: string;
}

export interface Metric {
  id: string;
  title: string;
  value: number;
  unit: string;
  status: RAGStatus;
  description: string;
  target: number;
  thresholds: Thresholds;
  decimals?: number;
  enabled?: boolean;
  trend?: number; // 1, 0, -1
  lastUpdated?: number;
  dataSource?: 'Power BI' | 'Excel' | 'Database' | 'Manual';
  connectionString?: string;
  manualValue?: number;
  manualDenominator?: number;
  additionalInfo?: string;
  accountablePerson?: string;
  deadline?: string;
  history?: number[];
  notes?: MetricNote[];
  excelSheet?: string;
  excelRow?: number;
  excelColumn?: string;
}

export interface MetricHierarchy extends Metric {
  children?: MetricHierarchy[];
}

export interface Organization {
  id: string;
  title: string;
  icon: string;
  description: string;
  isActive: boolean;
  type: 'Squad' | 'Area' | 'IT Area' | 'Tribe' | 'Community';
  teamCode?: string;
  owner?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  userId: string;
  action: string;
  details: string;
  orgId?: string;
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