import { useState, useEffect, useMemo } from 'react';
import { MetricHierarchy, AuditLogEntry, RAGStatus } from '../types.ts';
import { fetchMetricConfig, ConfigMetric, calculateStatus } from '../services/metricService.ts';

export function useMetrics(orgId: string | null) {
  const [hierarchies, setHierarchies] = useState<Record<string, MetricHierarchy[]>>({});
  const [loading, setLoading] = useState(true);

  const hydrateMetric = (m: any, isL1 = true): MetricHierarchy => {
    // ... same as before
    const target = m.target || 100;
    const val = m.value !== undefined ? m.value : Math.random() * target * 1.1;
    const thresholds = m.thresholds || { 
      red: Number((target * 0.7).toFixed(3)), 
      amber: Number((target * 0.85).toFixed(3)) 
    };
    
    const children = (m.subMetrics || m.children || []);
    let hydratedChildren: MetricHierarchy[] = children.map((c: any) => hydrateMetric(c, false));
    
    // Generate Layer 3 metrics if this is a node in the config with a 'metrics' count
    if (!isL1 && m.metrics) {
      const targetCount = Math.min(m.metrics, 30); 
      const existingCount = hydratedChildren.length;
      
      if (existingCount < targetCount) {
        const remainingCount = targetCount - existingCount;
        const generatedChildren = Array.from({ length: remainingCount }).map((_, i) => {
          const nodeIndex = existingCount + i;
          const leafVal = Math.random() * 100;
          const th = { red: 30, amber: 60 };
          return {
            id: `${m.id}_node_${nodeIndex}`,
            title: `Sensor Node ${nodeIndex + 1}`,
            value: Number(leafVal.toFixed(2)),
            unit: '%',
            decimals: 2,
            enabled: true,
            target: 100,
            thresholds: th,
            status: calculateStatus(leafVal, th),
            description: `High-frequency data stream monitoring from industrial IoT sensor node ${nodeIndex + 1}`,
            deadline: nodeIndex % 3 === 0 ? "2026-07-15" : undefined,
            trend: Math.floor(Math.random() * 3) - 1,
            lastUpdated: Date.now() - Math.floor(Math.random() * 500000),
            dataSource: 'Database' as 'Database' | 'Power BI' | 'Excel' | 'Manual'
          };
        });
        hydratedChildren = [...hydratedChildren, ...generatedChildren];
      }
    }

    // Aggregate value from children if they exist
    let finalValue = val;
    if (hydratedChildren.length > 0) {
      const enabledChildren = hydratedChildren.filter(c => c.enabled !== false);
      if (enabledChildren.length > 0) {
        finalValue = enabledChildren.reduce((sum, c) => sum + c.value, 0) / enabledChildren.length;
      } else {
        finalValue = 0;
      }
    }

    return {
      id: m.id,
      title: m.title,
      description: m.description || "Detailed performance analysis and historical trend tracking for this operational node.",
      accountablePerson: m.accountablePerson,
      deadline: m.deadline,
      value: Number(finalValue.toFixed(target > 100 ? 0 : 2)),
      unit: m.unit || (target > 500 ? '€' : '%'),
      decimals: 2,
      enabled: true,
      target: target,
      thresholds: thresholds,
      status: calculateStatus(finalValue, thresholds),
      trend: Math.floor(Math.random() * 3) - 1, // -1, 0, 1
      lastUpdated: m.lastUpdated || (Date.now() - Math.floor(Math.random() * 1000000)),
      children: hydratedChildren,
      history: [Number(finalValue.toFixed(target > 100 ? 0 : 2))],
      notes: [
        { content: `Initial baseline stabilization completed. Primary factors: operational Efficiency and resource allocation.`, date: "2026-04-15" },
        { content: `Quarterly review: performance showing positive trend due to implementation of new monitoring cluster.`, date: "2026-04-28" },
        { content: `Performance alert: Minor deviation detected in data stream. Analysis suggests optimization of batch processing.`, date: "2026-05-02" }
      ]
    };
  };

  const hierarchy = useMemo(() => {
    return orgId ? (hierarchies[orgId] || []) : [];
  }, [hierarchies, orgId]);

  const setHierarchy = (newVal: MetricHierarchy[] | ((prev: MetricHierarchy[]) => MetricHierarchy[])) => {
    if (!orgId) return;
    setHierarchies(prev => {
      const current = prev[orgId] || [];
      const updated = typeof newVal === 'function' ? newVal(current) : newVal;
      return { ...prev, [orgId]: updated };
    });
  };

  const refreshData = async () => {
    if (!orgId) return;
    setHierarchies(prev => {
      const targetOrgHierarchy = prev[orgId];
      if (!targetOrgHierarchy) return prev;

      const updateAndAggregate = (list: MetricHierarchy[]): MetricHierarchy[] => {
        return list.map(m => {
          let updatedNode = { ...m };
          
          if (m.children && m.children.length > 0) {
            const updatedChildren = updateAndAggregate(m.children);
            updatedNode.children = updatedChildren;
            
            const enabledChildren = updatedChildren.filter(c => c.enabled !== false);
            if (enabledChildren.length === 0) {
              updatedNode.value = 0;
            } else {
              const avg = enabledChildren.reduce((sum, c) => sum + c.value, 0) / enabledChildren.length;
              updatedNode.value = Number(avg.toFixed(m.decimals ?? 2));
            }
          } else {
            const newVal = m.value + (Math.random() * 2 - 1) * (m.target * 0.05);
            updatedNode.value = Number(Math.max(0, newVal).toFixed(m.decimals ?? 2));
          }
          
          updatedNode.trend = updatedNode.value > m.value ? 1 : updatedNode.value < m.value ? -1 : 0;
          updatedNode.status = calculateStatus(updatedNode.value, m.thresholds);
          updatedNode.lastUpdated = Date.now();
          
          const newHistory = [...(m.history || []), updatedNode.value].slice(-50);
          updatedNode.history = newHistory;
          
          return updatedNode;
        });
      };

      return { ...prev, [orgId]: updateAndAggregate(targetOrgHierarchy) };
    });
  };

  useEffect(() => {
    async function load() {
      if (!orgId || hierarchies[orgId]) {
        if (!orgId) setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const config = await fetchMetricConfig();
        const hydrated = config.map(l1 => hydrateMetric(l1));
        setHierarchies(prev => ({ ...prev, [orgId]: hydrated }));
      } catch (err) {
        console.error("Failed to load metrics", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [orgId]);

  return { hierarchy, setHierarchy, loading, refreshData };
}
