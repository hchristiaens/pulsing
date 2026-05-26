import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  Activity, 
  History, 
  AlertCircle, 
  Home, 
  Cpu, 
  ArrowLeft,
  Search,
  Settings,
  Bell,
  Save,
  Trash2,
  Edit2,
  Shield,
  Zap,
  Target,
  Gauge,
  Globe,
  Layers,
  BarChart3
} from 'lucide-react';
import { MetricHierarchy, AuditLogEntry, AppView, RAGStatus } from './types.ts';
import { useMetrics } from './hooks/useMetrics.ts';
import { MetricCard } from './components/MetricCard.tsx';
import { getAiPrediction, calculateStatus } from './services/metricService.ts';
import { cn } from './lib/utils.ts';

export default function App() {
  const { hierarchy, setHierarchy, loading, refreshData } = useMetrics();
  const [activeView, setActiveView] = useState<AppView>('dashboard');
  const [refreshIntervalSec, setRefreshIntervalSec] = useState(30);
  const [navigationStack, setNavigationStack] = useState<MetricHierarchy[][]>([]);
  const [configNavigationStack, setConfigNavigationStack] = useState<MetricHierarchy[][]>([]);
  const [selectedPath, setSelectedPath] = useState<MetricHierarchy[]>([]);
  const [configSelectedPath, setConfigSelectedPath] = useState<MetricHierarchy[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [predictions, setPredictions] = useState<Record<string, string>>({});
  const [editingMetric, setEditingMetric] = useState<MetricHierarchy | null>(null);
  const [selectedDataSource, setSelectedDataSource] = useState<'Power BI' | 'Excel' | 'Database' | 'Manual'>('Database');
  const [orgTitle, setOrgTitle] = useState('EC&A BE');
  const [orgIcon, setOrgIcon] = useState('Activity');
  const [mainDashboardTitle, setMainDashboardTitle] = useState('cockpit dashboard');

  const availableIcons = {
    Activity,
    Shield,
    Zap,
    Target,
    Gauge,
    Globe,
    Layers,
    BarChart3
  };

  const OrgLogoIcon = availableIcons[orgIcon as keyof typeof availableIcons] || Activity;

  // Initialize navigation stacks
  useEffect(() => {
    if (hierarchy.length > 0) {
      if (navigationStack.length === 0) setNavigationStack([hierarchy]);
      if (configNavigationStack.length === 0) setConfigNavigationStack([hierarchy]);
    }
  }, [hierarchy]);

  // Sync UI state when metric is selected for editing
  useEffect(() => {
    if (editingMetric) {
      setSelectedDataSource(editingMetric.dataSource || 'Database');
    }
  }, [editingMetric]);

  // Pre-generate AI advice for layer 1 and 2
  useEffect(() => {
    const generateTopLevelAdvice = async () => {
      if (hierarchy.length === 0) return;
      
      const metricsToPredict: MetricHierarchy[] = [];
      // Layer 1
      hierarchy.forEach(l1 => {
        if (!predictions[l1.id]) metricsToPredict.push(l1);
        // Layer 2
        if (l1.children) {
          l1.children.forEach(l2 => {
            if (!predictions[l2.id]) metricsToPredict.push(l2);
          });
        }
      });

      if (metricsToPredict.length > 0) {
        const newPredictions = { ...predictions };
        await Promise.all(metricsToPredict.map(async (m) => {
          const pred = await getAiPrediction(m);
          newPredictions[m.id] = pred;
        }));
        setPredictions(newPredictions);
      }
    };

    generateTopLevelAdvice();
  }, [hierarchy]);

  // Log dashboard access
  useEffect(() => {
    if (activeView === 'dashboard') {
      addLog('ACCESS_DASHBOARD', 'User h.christiaens@gmail.com accessed the dashboard');
    }
  }, [activeView]);

  // Handle auto-refresh
  useEffect(() => {
    if (refreshIntervalSec <= 0) return;
    const timer = setInterval(() => {
      refreshData();
    }, refreshIntervalSec * 1000);
    return () => clearInterval(timer);
  }, [refreshIntervalSec, refreshData]);

  useEffect(() => {
    if (editingMetric) {
      setSelectedDataSource(editingMetric.dataSource || 'Database');
    }
  }, [editingMetric]);

  const currentLayer = navigationStack[navigationStack.length - 1] || [];
  const currentConfigLayer = configNavigationStack[configNavigationStack.length - 1] || [];
  const currentLevel = navigationStack.length;
  const currentConfigLevel = configNavigationStack.length;

  const addLog = (action: string, details: string) => {
    const newLog: AuditLogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      userId: 'h.christiaens@gmail.com',
      action,
      details,
    };
    setAuditLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  const handleDrillDown = async (metric: MetricHierarchy) => {
    if (activeView === 'config') {
      setEditingMetric(metric);
      return;
    }

    if (metric.children && metric.children.length > 0) {
      setNavigationStack(prev => [...prev, metric.children!]);
      setSelectedPath(prev => [...prev, metric]);
      
      if (!predictions[metric.id]) {
        const pred = await getAiPrediction(metric);
        setPredictions(prev => ({ ...prev, [metric.id]: pred }));
      }
    }
  };

  const handleBack = () => {
    if (navigationStack.length > 1) {
      setNavigationStack(prev => prev.slice(0, -1));
      setSelectedPath(prev => prev.slice(0, -1));
    }
  };

  const handleConfigDrillDown = (metric: MetricHierarchy) => {
    if (metric.children && metric.children.length > 0) {
      setConfigNavigationStack(prev => [...prev, metric.children!]);
      setConfigSelectedPath(prev => [...prev, metric]);
    }
  };

  const handleConfigBack = () => {
    if (configNavigationStack.length > 1) {
      setConfigNavigationStack(prev => prev.slice(0, -1));
      setConfigSelectedPath(prev => prev.slice(0, -1));
    }
  };

  const updateMetricConfig = (id: string, updates: Partial<MetricHierarchy>) => {
    const recalculateParent = (metric: MetricHierarchy): MetricHierarchy => {
      if (!metric.children || metric.children.length === 0) return metric;
      
      const enabledChildren = metric.children.filter(c => c.enabled);
      if (enabledChildren.length === 0) {
        return { ...metric, value: 0, status: calculateStatus(0, metric.thresholds) };
      }
      
      const avgValue = enabledChildren.reduce((sum, c) => sum + c.value, 0) / enabledChildren.length;
      return { 
        ...metric, 
        value: Number(avgValue.toFixed(metric.decimals ?? 2)), 
        status: calculateStatus(avgValue, metric.thresholds) 
      };
    };

    const updateRecursive = (list: MetricHierarchy[]): MetricHierarchy[] => {
      return list.map(m => {
        let updated = m;
        if (m.id === id) {
          updated = { ...m, ...updates };
          
          // Force value if manual data source is selected
          if (updated.dataSource === 'Manual' && updated.manualValue !== undefined) {
            updated.value = updated.manualValue;
          }

          if ('thresholds' in updates || 'value' in updates || 'enabled' in updates || 'dataSource' in updates) {
            updated.status = calculateStatus(updated.value, updated.thresholds);
          }
        } else if (m.children) {
          const newChildren = updateRecursive(m.children);
          if (newChildren !== m.children) {
            updated = { ...m, children: newChildren };
            // If children changed, recalculate this parent
            updated = recalculateParent(updated);
          }
        }
        return updated;
      });
    };

    const newHierarchy = updateRecursive(hierarchy);
    setHierarchy(newHierarchy);
    
    // Sync navigation stacks to reflect changes immediately without resetting view
    const rebuildStackFromPath = (root: MetricHierarchy[], currentPath: MetricHierarchy[]) => {
      const newStack: MetricHierarchy[][] = [root];
      const newPath: MetricHierarchy[] = [];
      let currentLevel = root;
      
      for (const segment of currentPath) {
        const found = currentLevel.find(m => m.id === segment.id);
        if (found) {
          newPath.push(found);
          if (found.children) {
            newStack.push(found.children);
            currentLevel = found.children;
          }
        } else {
          break;
        }
      }
      return { stack: newStack, path: newPath };
    };

    const newConfigNav = rebuildStackFromPath(newHierarchy, configSelectedPath);
    const newMainNav = rebuildStackFromPath(newHierarchy, selectedPath);

    setConfigNavigationStack(newConfigNav.stack);
    setConfigSelectedPath(newConfigNav.path);
    setNavigationStack(newMainNav.stack);
    setSelectedPath(newMainNav.path);
    
    addLog('CONFIG_UPDATE', `Updated ${updates.title || id} (Enabled: ${updates.enabled ?? 'N/A'})`);
    setEditingMetric(null);
  };

  const allMetricsWithPredictions = useMemo(() => {
    const flat: MetricHierarchy[] = [];
    const flatten = (list: MetricHierarchy[]) => {
      list.forEach(m => {
        if (predictions[m.id]) flat.push(m);
        if (m.children) flatten(m.children);
      });
    };
    flatten(hierarchy);
    return flat;
  }, [hierarchy, predictions]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-400">
        <Cpu className="w-12 h-12 animate-spin mb-4 text-blue-500" />
        <p className="text-sm font-mono tracking-widest uppercase">Initializing Cockpit Systems...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-6 space-y-8">
        <div className="flex items-center space-x-2 px-2">
          <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
            <OrgLogoIcon className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">{orgTitle}</span>
        </div>

        <nav className="flex-1 space-y-1">
          <button 
            onClick={() => setActiveView('dashboard')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              activeView === 'dashboard' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            )}
          >
            <Home size={18} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveView('predictions')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              activeView === 'predictions' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            )}
          >
            <Cpu size={18} /> AI Predictions
          </button>
          <button 
            onClick={() => setActiveView('config')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              activeView === 'config' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            )}
          >
            <Settings size={18} /> Configuration
          </button>
          <button 
            onClick={() => setShowLogs(!showLogs)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              showLogs ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            )}
          >
            <History size={18} /> Audit Log
          </button>
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">System Sources</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span>Power BI Stream</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              <span>Vector DB Active</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 text-sm">
          <div className="flex items-center space-x-4">
            <div className="text-slate-400 hover:text-slate-600 cursor-pointer" onClick={() => { setActiveView('dashboard'); setNavigationStack([hierarchy]); setSelectedPath([]); }}>Cockpit</div>
            {activeView === 'dashboard' && selectedPath.map((item, idx) => (
              <div key={item.id} className="flex items-center space-x-4">
                <div className="text-slate-300">/</div>
                <div className={cn("font-medium", idx === selectedPath.length - 1 ? "text-slate-900" : "text-slate-500")}>
                  {item.title}
                </div>
              </div>
            ))}
            {activeView !== 'dashboard' && (
              <>
                <div className="text-slate-300">/</div>
                <div className="font-medium text-slate-900 capitalize font-mono text-[11px] tracking-widest">{activeView}</div>
              </>
            )}
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center gap-2 text-[11px] text-slate-500 uppercase tracking-tight">
              <span>Auto-refresh:</span>
              <select 
                value={refreshIntervalSec} 
                onChange={(e) => setRefreshIntervalSec(Number(e.target.value))}
                className="bg-slate-100 border-none rounded px-2 py-1 text-slate-900 font-bold outline-none cursor-pointer"
              >
                <option value={5}>5s</option>
                <option value={10}>10s</option>
                <option value={30}>30s</option>
                <option value={60}>60s</option>
                <option value={0}>Off</option>
              </select>
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
               <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">HC</div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            
            {/* View Switching Logic */}
            <AnimatePresence mode="wait">
              {activeView === 'dashboard' && (
                <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        {selectedPath.length > 0 ? selectedPath[selectedPath.length - 1].title : (
                          <>
                            <span className="text-slate-400 font-medium">pulseING</span> {mainDashboardTitle}
                          </>
                        )}
                      </h1>
                    </div>
                    {navigationStack.length > 1 && (
                      <button onClick={handleBack} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:border-slate-400">
                        <ArrowLeft size={16} /> Back
                      </button>
                    )}
                  </div>

                  <div className={cn("grid gap-6", currentLevel === 3 ? "grid-cols-2 md:grid-cols-4 lg:grid-cols-5" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3")}>
                    {currentLayer.map((metric) => (
                      <MetricCard 
                        key={metric.id} 
                        title={metric.title} 
                        value={metric.unit === '€' 
                          ? `${metric.unit}${metric.value.toFixed(metric.decimals ?? 2)}` 
                          : `${metric.value.toFixed(metric.decimals ?? 2)}${metric.unit}`} 
                        status={metric.status} 
                        description={metric.description} 
                        onClick={() => handleDrillDown(metric)} 
                        prediction={predictions[metric.id]} 
                        thresholds={metric.thresholds}
                        enabled={metric.enabled}
                        trend={metric.trend}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {activeView === 'predictions' && (
                <motion.div key="predictions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-8">AI Intelligence Hub</h1>
                  <div className="space-y-4">
                    {allMetricsWithPredictions.length === 0 && (
                      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
                        <Cpu className="mx-auto mb-4 opacity-20" size={48} />
                        <p>No active predictions. Drill down into dashboard metrics to trigger AI analysis.</p>
                      </div>
                    )}
                    {allMetricsWithPredictions.map(m => (
                      <div key={m.id} className="bg-white border border-slate-200 rounded-xl p-6 flex gap-6 items-start">
                        <div className={cn("h-10 w-10 shrink-0 rounded-lg flex items-center justify-center", m.status === 'GREEN' ? 'bg-emerald-50' : m.status === 'AMBER' ? 'bg-amber-50' : 'bg-rose-50')}>
                           <div className={cn("h-2 w-2 rounded-full", m.status === 'GREEN' ? 'bg-emerald-500' : m.status === 'AMBER' ? 'bg-amber-500' : 'bg-rose-500')} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 mb-1">{m.title}</h3>
                          <p className="text-xs text-slate-500 mb-4">{m.description}</p>
                          <div className="bg-slate-50 border border-slate-100 rounded-lg p-4">
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block mb-2">Predicted Outcome</span>
                            <p className="text-sm text-slate-700 italic">"{predictions[m.id]}"</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeView === 'config' && (
                <motion.div key="config" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Configuration Engine</h1>
                      <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                        <button 
                          onClick={() => { setConfigNavigationStack([hierarchy]); setConfigSelectedPath([]); }}
                          className="hover:text-slate-900 transition-colors"
                        >
                          Root
                        </button>
                        {configSelectedPath.map((p, i) => (
                          <div key={p.id} className="flex items-center gap-2">
                             <span>/</span>
                             <span className={i === configSelectedPath.length - 1 ? "text-slate-900 font-medium" : ""}>{p.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {configNavigationStack.length > 1 && (
                      <button onClick={handleConfigBack} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:border-slate-400">
                        <ArrowLeft size={16} /> Level Up
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                      {/* Global Settings Section */}
                      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
                        <h3 className="text-sm font-bold mb-6 text-slate-400 uppercase tracking-widest">Global Identity Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase">Organizational Title</label>
                            <input 
                              value={orgTitle} 
                              onChange={(e) => {
                                setOrgTitle(e.target.value);
                                if (e.target.value !== orgTitle) addLog('CONFIG_UPDATE', `Organizational title changed to ${e.target.value}`);
                              }}
                              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none" 
                              placeholder="e.g. EC&A BE"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase">Brand Icon</label>
                            <div className="flex gap-2 p-1 bg-slate-50 border border-slate-200 rounded-lg overflow-x-auto">
                              {Object.entries(availableIcons).map(([name, Icon]) => (
                                <button
                                  key={name}
                                  onClick={() => {
                                    setOrgIcon(name);
                                    addLog('CONFIG_UPDATE', `Organizational icon changed to ${name}`);
                                  }}
                                  className={cn(
                                    "p-2 rounded-md transition-all shrink-0",
                                    orgIcon === name ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200" : "text-slate-400 hover:text-slate-600"
                                  )}
                                  title={name}
                                >
                                  <Icon size={18} />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase">Main Dashboard Title</label>
                            <input 
                              value={mainDashboardTitle} 
                              onChange={(e) => {
                                setMainDashboardTitle(e.target.value);
                                if (e.target.value !== mainDashboardTitle) addLog('CONFIG_UPDATE', `Dashboard title suffix changed to ${e.target.value}`);
                              }}
                              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none" 
                              placeholder="cockpit dashboard"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-xl p-6">
                        <h3 className="text-sm font-bold mb-6 text-slate-400 uppercase tracking-widest">
                          Layer {currentConfigLevel} Metrics ({currentConfigLayer.length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {currentConfigLayer.map(m => (
                            <div 
                              key={m.id} 
                              className={cn(
                                "flex items-center justify-between p-4 rounded-xl border transition-all",
                                editingMetric?.id === m.id ? "bg-slate-900 text-white border-slate-900 shadow-lg ring-2 ring-slate-900/10" : "bg-white border-slate-100 hover:border-slate-300 text-slate-600"
                              )}
                            >
                              <div className="flex-1 cursor-pointer" onClick={() => setEditingMetric(m)}>
                                <div className="flex items-center gap-2">
                                  <div className="text-sm font-bold truncate">{m.title}</div>
                                  {m.dataSource && (
                                    <span className={cn(
                                      "text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter",
                                      editingMetric?.id === m.id ? "bg-white/20 text-white" : "bg-blue-100 text-blue-700"
                                    )}>
                                      {m.dataSource}
                                    </span>
                                  )}
                                  <span className={cn(
                                    "text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter",
                                    m.enabled 
                                      ? (editingMetric?.id === m.id ? "bg-emerald-500/20 text-emerald-200" : "bg-emerald-100 text-emerald-700")
                                      : (editingMetric?.id === m.id ? "bg-rose-500/20 text-rose-200" : "bg-rose-100 text-rose-700")
                                  )}>
                                    {m.enabled ? 'Active' : 'Disabled'}
                                  </span>
                                </div>
                                <div className={cn("text-[10px] mt-0.5", editingMetric?.id === m.id ? "text-slate-400" : "text-slate-400")}>
                                   {m.unit === '€' 
                                      ? `${m.unit}${m.value.toFixed(m.decimals ?? 2)}` 
                                      : `${m.value.toFixed(m.decimals ?? 2)}${m.unit}`}
                                </div>
                              </div>
                              {m.children && m.children.length > 0 && (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleConfigDrillDown(m); }}
                                  className={cn(
                                    "ml-3 p-2 rounded-lg transition-colors border",
                                    editingMetric?.id === m.id ? "bg-white/10 border-white/20 hover:bg-white/20 text-white" : "bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-400"
                                  )}
                                  title="Level Down"
                                >
                                  <ChevronRight size={16} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {editingMetric && (
                        <div key={editingMetric.id} className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
                          <h3 className="text-lg font-bold mb-8">Edit: {editingMetric.title}</h3>
                          <form className="space-y-6" onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            updateMetricConfig(editingMetric.id, {
                              title: formData.get('title') as string,
                              description: formData.get('description') as string,
                              unit: formData.get('unit') as string,
                              enabled: formData.get('enabled') === 'on',
                              decimals: Number(formData.get('decimals')),
                              dataSource: formData.get('dataSource') as any,
                              manualValue: formData.get('manualValue') ? Number(formData.get('manualValue')) : undefined,
                              connectionString: formData.get('connectionString') as string,
                              excelSheet: formData.get('excelSheet') as string,
                              excelRow: formData.get('excelRow') ? Number(formData.get('excelRow')) : undefined,
                              excelColumn: formData.get('excelColumn') as string,
                              thresholds: {
                                red: Number(Number(formData.get('red')).toFixed(3)),
                                amber: Number(Number(formData.get('amber')).toFixed(3))
                              }
                            });
                          }}>
                            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl mb-6">
                              <div className="flex items-center gap-3">
                                <div className={cn("h-3 w-3 rounded-full", editingMetric.enabled ? "bg-emerald-500" : "bg-slate-300")} />
                                <div>
                                  <p className="text-sm font-bold">Metric Operational Status</p>
                                  <p className="text-[10px] text-slate-500 leading-tight">When disabled, this metric is excluded from parent aggregations.</p>
                                </div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" name="enabled" defaultChecked={editingMetric.enabled} className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
                              </label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400 uppercase">Title</label>
                                <input name="title" defaultValue={editingMetric.title} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none" />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400 uppercase">Current Value</label>
                                <input disabled value={editingMetric.unit === '€' ? `${editingMetric.unit}${editingMetric.value.toFixed(editingMetric.decimals ?? 2)}` : `${editingMetric.value.toFixed(editingMetric.decimals ?? 2)}${editingMetric.unit}`} className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm opacity-50 cursor-not-allowed" />
                              </div>
                            </div>

                              <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400 uppercase">Description</label>
                                <textarea name="description" defaultValue={editingMetric.description} rows={3} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none" />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                                <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-400 uppercase">Display Unit</label>
                                  <select name="unit" defaultValue={editingMetric.unit} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none">
                                    <option value="%">% (Percentage)</option>
                                    <option value="€">€ (Euro)</option>
                                    <option value="">Amount (None)</option>
                                  </select>
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-slate-400 uppercase">Decimal Precision</label>
                                  <input type="number" name="decimals" defaultValue={editingMetric.decimals ?? 2} min={0} max={5} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none" />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                                <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-rose-500 uppercase">Red Threshold</label>
                                  <input type="number" name="red" step="0.001" defaultValue={editingMetric.thresholds.red} className="w-full px-4 py-2 border border-rose-100 bg-rose-50/30 rounded-lg text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-xs font-bold text-amber-500 uppercase">Amber Threshold</label>
                                  <input type="number" name="amber" step="0.001" defaultValue={editingMetric.thresholds.amber} className="w-full px-4 py-2 border border-amber-100 bg-amber-50/30 rounded-lg text-sm" />
                                </div>
                              </div>

                              {currentConfigLevel === 3 && (
                                <>
                                  <div className="space-y-1.5 pt-4 border-t border-slate-50">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Data Source Integration</label>
                                    <select 
                                      name="dataSource" 
                                      value={selectedDataSource} 
                                      onChange={(e) => setSelectedDataSource(e.target.value as any)}
                                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none"
                                    >
                                      <option value="Power BI">Power BI API Connection</option>
                                      <option value="Excel">Direct Excel Import</option>
                                      <option value="Database">SQL Database Connector</option>
                                      <option value="Manual">Manual Entry</option>
                                    </select>
                                    <p className="text-[10px] text-slate-500 italic mt-1.5">Configure how this leaf-node metric pulls raw operational data.</p>
                                  </div>

                                  {selectedDataSource === 'Manual' && (
                                    <div className="space-y-1.5 pt-4">
                                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                        Manual Value Entry <span className="text-[10px] lowercase font-normal italic">(Direct Input)</span>
                                      </label>
                                      <input 
                                        type="number" 
                                        step="any"
                                        name="manualValue" 
                                        defaultValue={editingMetric.value} 
                                        className="w-full px-4 py-2 bg-emerald-50/50 border border-emerald-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-900 outline-none font-bold text-emerald-900"
                                        placeholder="0.00"
                                      />
                                      <p className="text-[10px] text-emerald-600/70 mt-1 italic font-medium">Entering a value here will immediately override any external data feed for this metric.</p>
                                    </div>
                                  )}

                                  {selectedDataSource !== 'Manual' && (
                                    <div className="space-y-1.5 pt-4">
                                      <label className="text-xs font-bold text-slate-400 uppercase">
                                        {selectedDataSource === 'Database' && "SQL Connection String"}
                                        {selectedDataSource === 'Excel' && "Excel File Source (Path/URL)"}
                                        {selectedDataSource === 'Power BI' && "Power BI API Endpoint URL"}
                                      </label>
                                      <input 
                                        name="connectionString" 
                                        defaultValue={editingMetric.connectionString} 
                                        placeholder={
                                          selectedDataSource === 'Database' ? "Server=myServerAddress;Database=myDataBase;User Id=myUsername;Password=myPassword;" :
                                          selectedDataSource === 'Excel' ? "C:\\Users\\Operations\\Metrics\\Q3_Targets.xlsx" :
                                          "https://api.powerbi.com/v1.0/myorg/reports/{reportId}/datasets"
                                        }
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none font-mono"
                                      />
                                      <p className="text-[10px] text-slate-500 mt-1">Specify authorization and path details for the selected adapter.</p>
                                    </div>
                                  )}

                                  {selectedDataSource === 'Excel' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-50">
                                      <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 uppercase">Excel Sheet Name</label>
                                        <input 
                                          name="excelSheet" 
                                          defaultValue={editingMetric.excelSheet} 
                                          placeholder="e.g. Sheet1"
                                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none" 
                                        />
                                      </div>
                                      <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 uppercase">Start Row</label>
                                        <input 
                                          type="number" 
                                          name="excelRow" 
                                          defaultValue={editingMetric.excelRow ?? 1} 
                                          min={1}
                                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none" 
                                        />
                                      </div>
                                      <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 uppercase">Start Column (Index/Letter)</label>
                                        <input 
                                          name="excelColumn" 
                                          defaultValue={editingMetric.excelColumn ?? 'A'} 
                                          placeholder="e.g. A or 1"
                                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none" 
                                        />
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}

                            <div className="flex justify-end gap-3 pt-6">
                              <button type="button" onClick={() => setEditingMetric(null)} className="px-6 py-2 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-900">Cancel</button>
                              <button type="submit" className="px-8 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold shadow-md hover:bg-slate-800 transition-all flex items-center gap-2">
                                <Save size={16} /> Save Changes
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-slate-900 text-white rounded-2xl p-8 space-y-6 flex flex-col">
                       <h3 className="font-bold flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-emerald-400" /> Dynamic Rules</h3>
                       <p className="text-sm text-slate-400 leading-relaxed italic">
                         Updating thresholds dynamically recalculates the RAG status of all dependent layers. 
                         Ensure thresholds align with Strategic KPI targets for the current quarter.
                       </p>
                       <div className="p-4 bg-white/5 rounded-xl border border-white/10 mt-auto">
                         <span className="text-[10px] uppercase font-bold text-slate-500 mb-2 block">System Status</span>
                         <div className="flex justify-between items-center text-xs">
                           <span>Config Sync</span>
                           <span className="text-emerald-400">ONLINE</span>
                         </div>
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* Minimized Log Preview */}
        <div className="border-t border-slate-200 bg-white p-6 mt-auto">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="space-y-1 flex-1 overflow-hidden mr-8">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Recent Activity Pulse
              </h4>
              <div className="h-5 relative">
                <AnimatePresence mode="wait">
                  {auditLogs.length > 0 ? (
                    <motion.p 
                      key={auditLogs[0].id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-xs text-slate-600 truncate"
                    >
                      <span className="font-bold text-slate-400 mr-2">[{new Date(auditLogs[0].timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                      <span className="font-bold text-slate-900">[{auditLogs[0].action}]</span> {auditLogs[0].details}
                    </motion.p>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No recent system activity recorded.</p>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <button onClick={() => setShowLogs(true)} className="shrink-0 text-[11px] font-bold text-slate-900 hover:underline flex items-center gap-2">
              Management Archive <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </main>

      {/* Audit Vault Drawer */}
      <AnimatePresence>
        {showLogs && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLogs(false)} className="fixed inset-0 z-50 bg-slate-950/20 backdrop-blur-[2px]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white border-l border-slate-200 shadow-2xl p-8 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 bg-slate-900 rounded flex items-center justify-center"><History size={10} className="text-white" /></div>
                  <h2 className="text-xl font-bold tracking-tight">Audit Vault</h2>
                </div>
                <button onClick={() => setShowLogs(false)} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors">&times;</button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-6">
                {auditLogs.map((log) => (
                  <div key={log.id} className="relative pl-6 border-l border-slate-100">
                    <div className="absolute -left-[3.5px] top-0 h-[7px] w-[7px] rounded-full bg-white border border-slate-300" />
                    <div className="mb-1 flex justify-between items-baseline"><span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{new Date(log.timestamp).toLocaleString()}</span></div>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">{log.details}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-400 font-mono uppercase tracking-widest">{log.action}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
