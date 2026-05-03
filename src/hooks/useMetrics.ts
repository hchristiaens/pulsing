import { useState, useEffect, useMemo } from 'react';
import { MetricHierarchy, AuditLogEntry, RAGStatus } from '../types';
import { fetchMetricConfig, ConfigMetric, calculateStatus } from '../services/metricService';

export function useMetrics() {
  const [hierarchy, setHierarchy] = useState<MetricHierarchy[]>([]);
  const [loading, setLoading] = useState(true);

  const hydrateMetric = (m: any, isL1 = true): MetricHierarchy => {
    const target = m.target || 100;
    const val = Math.random() * target * 1.1;
    const thresholds = m.thresholds || { 
      red: Number((target * 0.7).toFixed(3)), 
      amber: Number((target * 0.85).toFixed(3)) 
    };
    
    const children = (m.subMetrics || m.children || []);
    let hydratedChildren: MetricHierarchy[] = children.map((c: any) => hydrateMetric(c, false));
    
    // Generate Layer 3 metrics if this is a leaf node in the config with a 'metrics' count
    if (!isL1 && hydratedChildren.length === 0 && m.metrics) {
      const count = Math.min(m.metrics, 50);
      hydratedChildren = Array.from({ length: count }).map((_, i) => {
        const val = Math.random() * 100;
        const th = { red: 30, amber: 60 };
        return {
          id: `${m.id}_node_${i}`,
          title: `Sensor Node ${i + 1}`,
          value: Number(val.toFixed(2)),
          unit: '%',
          decimals: 2,
          enabled: false,
          target: 100,
          thresholds: th,
          status: calculateStatus(val, th),
          description: `High-frequency data stream monitoring from industrial IoT sensor node ${i + 1}`,
          trend: Math.floor(Math.random() * 3) - 1,
          lastUpdated: Date.now() - Math.floor(Math.random() * 500000),
          dataSource: 'Database'
        };
      });
    }

    return {
      id: m.id,
      title: m.title,
      description: m.description || `Data stream for ${m.title}`,
      value: Number(val.toFixed(target > 100 ? 0 : 2)),
      unit: m.unit || (target > 500 ? '€' : '%'),
      decimals: 2,
      enabled: true,
      target: target,
      thresholds: thresholds,
      status: calculateStatus(val, thresholds),
      trend: Math.floor(Math.random() * 3) - 1, // -1, 0, 1
      lastUpdated: m.lastUpdated || (Date.now() - Math.floor(Math.random() * 1000000)),
      children: hydratedChildren
    };
  };

  const refreshData = async () => {
    setHierarchy(prev => {
      const updateRecursive = (list: MetricHierarchy[]): MetricHierarchy[] => {
        return list.map(m => {
          const newVal = m.value + (Math.random() * 2 - 1) * (m.target * 0.05);
          const cappedVal = Math.max(0, newVal);
          const newTrend = cappedVal > m.value ? 1 : cappedVal < m.value ? -1 : 0;
          return {
            ...m,
            value: Number(cappedVal.toFixed(m.decimals ?? 2)),
            status: calculateStatus(cappedVal, m.thresholds),
            trend: newTrend,
            lastUpdated: Date.now(),
            children: m.children ? updateRecursive(m.children) : undefined
          };
        });
      };
      return updateRecursive(prev);
    });
  };

  useEffect(() => {
    async function load() {
      try {
        const config = await fetchMetricConfig();
        const hydrated = config.map(l1 => hydrateMetric(l1));
        setHierarchy(hydrated);
      } catch (err) {
        console.error("Failed to load metrics", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { hierarchy, setHierarchy, loading, refreshData };
}
