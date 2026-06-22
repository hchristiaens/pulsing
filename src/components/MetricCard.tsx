import { motion, AnimatePresence } from 'motion/react';
import { RAGStatus, MetricNote, Thresholds } from '../types';
import { cn } from '../lib/utils';
import { AdviceModal } from './AdviceModal';
import { ConfirmationModal } from './ConfirmationModal';
import { calculateLinearRegression } from '../services/metricService';
import { analyzeMetric } from '../services/analysisService';
import { buildAgentPrompt } from '../lib/promptUtils';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Equal, 
  Info, 
  MoreVertical, 
  Edit2,
  Eye,
  Trash2,
  EyeOff
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { 
  ResponsiveContainer,
} from 'recharts';

interface MetricCardProps {
  key?: string | number;
  id: string;
  title: string;
  value: string | number;
  status: RAGStatus;
  description: string;
  additionalInfo?: string;
  accountablePerson?: string;
  deadline?: string;
  onClick?: () => void | Promise<void>;
  isSelected?: boolean;
  thresholds?: Thresholds;
  enabled?: boolean;
  trend?: number; // 1: up, -1: down, 0: neutral
  history?: number[];
  unit?: string;
  notes?: MetricNote[];
  lastUpdated?: number;
  onSelectDetail?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleEnabled?: () => void;
  adviceText?: string;
  isLayer3?: boolean;
  currentLevel?: number;
}

export function MetricCard({ 
  id,
  title, 
  value, 
  status, 
  description, 
  additionalInfo,
  accountablePerson,
  deadline,
  onClick, 
  isSelected, 
  thresholds, 
  enabled = true,
  trend = 0,
  history = [],
  unit = '',
  notes = [],
  lastUpdated,
  onSelectDetail,
  onEdit,
  onDelete,
  onToggleEnabled,
  adviceText = "API ADVICE: not yet implemented",
  isLayer3 = false,
  currentLevel = 1
}: MetricCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | undefined>();
  const [loadingAi, setLoadingAi] = useState(false);
  const [showAdviceModal, setShowAdviceModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [editablePrompt, setEditablePrompt] = useState<string>("");

  const agentPrompt = useMemo(() => buildAgentPrompt(title, description, notes, thresholds, history), [title, description, notes, thresholds, history]);

  const analyze = async (prompt?: string) => {
    console.log("Analyze called with prompt:", prompt);
    if (loadingAi) {
        console.log("Already loading, aborting");
        return;
    }
    setLoadingAi(true);
    setAiAdvice("Analyzing....");
    try {
        console.log("Calling analyzeMetric with prompt:", prompt || agentPrompt);
        const advice = await analyzeMetric(title, history, thresholds || { red: 0.7, amber: 0.85 }, notes, description, prompt || agentPrompt);
        console.log("Analysis result:", advice);
        setAiAdvice(advice);
        if (!prompt) setEditablePrompt(agentPrompt);
        else setEditablePrompt(prompt);
    } catch (error) {
        console.error("Analysis error:", error);
    } finally {
        setLoadingAi(false);
    }
  };

  useEffect(() => {
    setEditablePrompt(agentPrompt);
  }, [agentPrompt]);

  const regression = useMemo(() => calculateLinearRegression(history), [history]);
  const predictions = useMemo(() => [
    { value: regression.intercept + regression.slope * history.length, isPrediction: true },
    { value: regression.intercept + regression.slope * (history.length + 1), isPrediction: true },
    { value: regression.intercept + regression.slope * (history.length + 2), isPrediction: true }
  ], [regression, history.length]);

  const formattedAdvice = useMemo(() => {
    let markdown = `## ${title} - Analysis\n\n`;
    markdown += `### Context\n${description}\n\n`;
    
    if (notes && notes.length > 0) {
      markdown += `### Notes\n`;
      notes.forEach(note => {
        markdown += `- **${new Date(note.date).toLocaleDateString()}**: ${note.content}\n`;
      });
      markdown += `\n`;
    }
    
    markdown += `### Last 12 Datapoints\n`;
    const last12 = history.slice(-12);
    markdown += `| Datapoint | Value |\n| --- | --- |\n`;
    last12.forEach((val, idx) => {
        markdown += `| ${idx + 1} | ${val}${unit} |\n`;
    });
    markdown += `\n`;
    
    markdown += `### AI Advice\n`;
    if (aiAdvice) markdown += `${aiAdvice}`;
    else if (loadingAi) markdown += "Analyzing with AI...";
    else {
        const trend = regression.slope > 0 ? "improving" : regression.slope < 0 ? "declining" : "stable";
        markdown += `Projected trend is ${trend}. Expected value in 3 periods: ${predictions[2].value.toFixed(2)}${unit}`;
    }
    
    return markdown;
  }, [title, description, notes, history, aiAdvice, loadingAi, regression, predictions, unit]);

  const rawData = useMemo(() => ({
    title,
    description,
    notes,
    thresholds,
    history
  }), [title, description, notes, thresholds, history]);

  const chartData = useMemo(() => [
    ...(history.slice(-12).map((val, idx) => ({
      value: val,
      isPrediction: false,
      dateLabel: new Date(Date.now() - ((history.length - 1 - idx) * 86400000)).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    }))),
    ...predictions.map((p, i) => ({
      ...p,
      dateLabel: `Proj ${i + 1}`
    }))
  ], [history, predictions]);

  const formatDate = (date: Date | string | number) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return String(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const statusColors = {
    GREEN: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]',
    AMBER: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]',
    RED: 'bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]',
  };

  const trendColors = {
    pos: 'text-emerald-500',
    neu: 'text-amber-500',
    neg: 'text-rose-500',
  };

  const TrendIcon = trend > 0 ? ArrowUpRight : trend < 0 ? ArrowDownRight : Equal;
  const activeTrendColor = trend > 0 ? trendColors.pos : trend < 0 ? trendColors.neg : trendColors.neu;

  const previousValue = history.length > 1 ? history[history.length - 2] : null;
  const currentValueNum = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, "")) : value;
  
  const diff = previousValue !== null ? currentValueNum - previousValue : 0;
  const diffPercent = previousValue && previousValue !== 0 ? (diff / Math.abs(previousValue)) * 100 : 0;

  const isBreached = deadline ? new Date() > new Date(deadline) : false;

  const handleCardClick = () => {
    if (enabled && onClick) {
      onClick();
    }
  };

  return (
    <div className="relative w-full h-[240px]">
      <motion.div
        whileHover={enabled ? { y: -2 } : {}}
        whileTap={enabled ? { scale: 0.99 } : {}}
        onClick={handleCardClick}
        className={cn(
          "absolute inset-0 rounded-xl border bg-white dark:bg-slate-900 p-6 transition-all duration-200",
          enabled ? "cursor-pointer" : "opacity-40 grayscale-[0.5] cursor-not-allowed bg-slate-50 dark:bg-slate-950",
          isSelected ? "ring-2 ring-slate-900 dark:ring-slate-700 shadow-xl border-slate-900 dark:border-slate-700" : "border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 hover:shadow-sm"
        )}
      >
        <div className="flex flex-col h-full gap-2">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-start">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 min-w-0 truncate pr-6">
                {title} {!enabled && "(Disabled)"}
              </h3>
              
              {/* Hamburger Menu */}
              <div className="absolute top-4 right-4 z-20">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <MoreVertical size={16} />
                </button>

                <AnimatePresence>
                  {showMenu && (
                    <>
                      <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}
                        className="fixed inset-0 z-30" 
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-1 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 z-40 overflow-hidden"
                      >
                        {enabled && (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); onSelectDetail?.(); setShowMenu(false); }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-black text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left"
                            >
                              <Eye size={14} className="text-blue-500" /> Details
                            </button>
                            {onEdit && (
                              <button
                                onClick={(e) => { e.stopPropagation(); setShowMenu(false); onEdit(); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left border-t border-slate-50 dark:border-slate-700"
                              >
                                <Edit2 size={14} /> Edit
                              </button>
                            )}
                            {onDelete && isLayer3 && (
                              <button
                                onClick={(e) => { e.stopPropagation(); setShowMenu(false); setShowDeleteConfirmation(true); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors text-left border-t border-slate-50 dark:border-slate-700"
                              >
                                <Trash2 size={14} /> Remove
                              </button>
                            )}
                            {onToggleEnabled && (
                              <button
                                onClick={(e) => { e.stopPropagation(); setShowMenu(false); onToggleEnabled(); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left border-t border-slate-50 dark:border-slate-700"
                              >
                                <EyeOff size={14} /> Disable
                              </button>
                            )}
                          </>
                        )}
                        {!enabled && onToggleEnabled && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setShowMenu(false); onToggleEnabled(); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left border-t border-slate-50 dark:border-slate-700"
                          >
                            <Eye size={14} /> Enable
                          </button>
                        )}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            <div className="flex justify-between items-center min-h-[14px]">
               {accountablePerson ? (
                 <span className="text-[9px] font-medium text-blue-600/70 dark:text-blue-400/70 truncate flex items-center gap-1">
                   <span className="w-1 h-1 rounded-full bg-blue-400" />
                   {accountablePerson}
                 </span>
               ) : <div />}
               <div className="flex items-center gap-2">
                 {enabled && (
                   <div className={cn("flex-shrink-0", activeTrendColor)}>
                     <TrendIcon size={12} strokeWidth={3} />
                   </div>
                 )}
                 <div className="group/status relative">
                   <div className={cn("h-2 w-2 rounded-full cursor-help", enabled ? statusColors[status] : "bg-slate-300 dark:bg-slate-700 shadow-none")} />
                   {enabled && thresholds && (
                     <div className="absolute right-0 bottom-full mb-2 hidden group-hover/status:block z-50 bg-slate-900 dark:bg-slate-950 text-white text-[10px] py-2 px-3 rounded shadow-xl whitespace-nowrap border border-slate-700">
                       <p className="font-bold border-b border-slate-700 pb-1 mb-1">RAG Thresholds</p>
                       <div className="flex gap-4">
                         <span className="text-rose-400">Red: &lt;{thresholds.red}</span>
                         <span className="text-amber-400">Amber: &lt;{thresholds.amber}</span>
                         <span className="text-emerald-400">Green: &ge;{thresholds.amber}</span>
                       </div>
                       <div className="absolute top-full right-1 w-2 h-2 bg-slate-900 dark:bg-slate-950 rotate-45 -mt-1 border-r border-b border-slate-700" />
                     </div>
                   )}
                 </div>
               </div>
            </div>
          </div>

          <div className="group/desc relative mt-2">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-3xl font-light tracking-tight text-slate-900 dark:text-slate-100">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </span>
                {deadline && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className={cn(
                      "flex items-center gap-1.5 p-0.5 pr-2 rounded-md transition-all",
                      isBreached ? "bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 shadow-sm" : ""
                    )}>
                      <span className={cn(
                        "text-[9px] font-bold uppercase tracking-tight flex items-center gap-1",
                        isBreached ? "text-rose-600 dark:text-rose-400" : "text-rose-500"
                      )}>
                        <span className={cn(
                          "w-1.5 h-1.5 rounded-full ml-1",
                          isBreached ? "bg-rose-500 animate-pulse" : "bg-rose-400 animate-pulse"
                        )} />
                        Deadline: {formatDate(deadline)}
                      </span>
                      {isBreached && (
                        <span className="ml-1 px-1.5 py-0.5 bg-rose-600 text-white text-[7px] font-black rounded-sm uppercase tracking-tighter shadow-sm">
                          OVERDUE
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {previousValue !== null && enabled && (
                  <span className={cn(
                    "text-[9px] font-bold mt-1",
                    diff > 0 ? "text-emerald-600 dark:text-emerald-400" : diff < 0 ? "text-rose-600 dark:text-rose-400" : "text-amber-600 dark:text-amber-400"
                  )}>
                    {diff > 0 ? '+' : ''}{unit === '€' ? `€${diff.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `${diff.toFixed(2)}${unit}`} ({diffPercent > 0 ? '+' : ''}{diffPercent.toFixed(1)}%) <span className="text-slate-400 font-normal">vs prev</span>
                  </span>
                )}
              </div>
              {enabled && additionalInfo && (
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    onSelectDetail?.();
                  }}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-blue-500"
                >
                  <span className="sr-only">Explanation</span>
                  <Info size={14} />
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-3 cursor-help">
              {description}
            </p>
            <div className="mt-2 pt-2 border-t border-slate-50 dark:border-slate-800">
              <button
                onClick={(e) => { e.stopPropagation(); analyze(); setShowAdviceModal(true); }}
                className="inline-flex items-center px-2 py-1 text-[10px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-all uppercase tracking-widest"
              >
                AI Advice
              </button>
            </div>
          </div>
        </div>

        <div className={cn(
            "absolute bottom-0 left-0 h-1 w-full overflow-hidden rounded-b-xl",
          !enabled ? 'bg-slate-200 dark:bg-slate-800' : (status === 'GREEN' ? 'bg-emerald-500' : status === 'AMBER' ? 'bg-amber-500' : 'bg-rose-500')
        )} />
      </motion.div>
      <div key={`modal-wrapper-${id}`}>
        <AdviceModal 
          isOpen={showAdviceModal} 
          onClose={() => setShowAdviceModal(false)}
          metricName={title}
          aiAdvice={aiAdvice || "Analyzing..."}
          rawData={rawData}
          prompt={editablePrompt}
          onUpdatePrompt={(newPrompt) => { 
            console.log("MetricCard: onUpdatePrompt received:", newPrompt);
            setEditablePrompt(newPrompt); 
            analyze(newPrompt); 
          }}
        />
        <ConfirmationModal 
          isOpen={showDeleteConfirmation} 
          onClose={() => setShowDeleteConfirmation(false)}
          onConfirm={() => { onDelete?.(); setShowDeleteConfirmation(false); }}
          title="Remove Metric"
          message={`Are you sure you want to remove this metric? ${currentLevel >= 2 ? 'The removal is irreversible and all data will be removed from the database. ' : ''}Note that removing the metric would impact the value of the parent metric.`}
        />
      </div>
    </div>
  );
}

