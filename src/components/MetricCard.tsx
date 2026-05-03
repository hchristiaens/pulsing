import { motion } from 'motion/react';
import { RAGStatus } from '../types';
import { cn } from '../lib/utils';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface MetricCardProps {
  key?: string | number;
  title: string;
  value: string | number;
  status: RAGStatus;
  description: string;
  onClick?: () => void | Promise<void>;
  prediction?: string;
  isSelected?: boolean;
  thresholds?: { red: number; amber: number };
  enabled?: boolean;
  trend?: number; // 1: up, -1: down, 0: neutral
}

export function MetricCard({ 
  title, 
  value, 
  status, 
  description, 
  onClick, 
  prediction, 
  isSelected, 
  thresholds, 
  enabled = true,
  trend = 0,
}: MetricCardProps) {
  const statusColors = {
    GREEN: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]',
    AMBER: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]',
    RED: 'bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]',
  };

  const trendColors = {
    GREEN: 'text-emerald-500',
    AMBER: 'text-amber-500',
    RED: 'text-rose-500',
  };

  const TrendIcon = trend > 0 ? ArrowUpRight : trend < 0 ? ArrowDownRight : Minus;

  return (
    <motion.div
      whileHover={enabled ? { y: -2 } : {}}
      whileTap={enabled ? { scale: 0.99 } : {}}
      onClick={enabled ? onClick : undefined}
      className={cn(
        "relative rounded-xl border bg-white p-6 transition-all duration-200",
        enabled ? "cursor-pointer" : "opacity-40 grayscale-[0.5] cursor-not-allowed bg-slate-50",
        isSelected ? "ring-2 ring-slate-900 shadow-xl border-slate-900" : "border-slate-200 hover:border-slate-400 hover:shadow-sm"
      )}
    >
      <div className="flex flex-col h-full gap-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 min-w-0 truncate">
              {title} {!enabled && "(Disabled)"}
            </h3>
            {enabled && (
              <div className={cn("flex-shrink-0", trendColors[status])}>
                <TrendIcon size={14} strokeWidth={3} />
              </div>
            )}
          </div>
          <div className="group/status relative">
            <div className={cn("h-2 w-2 rounded-full cursor-help", enabled ? statusColors[status] : "bg-slate-300 shadow-none")} />
            {enabled && thresholds && (
              <div className="absolute right-0 bottom-full mb-2 hidden group-hover/status:block z-50 bg-slate-900 text-white text-[10px] py-2 px-3 rounded shadow-xl whitespace-nowrap border border-slate-700">
                <p className="font-bold border-b border-slate-700 pb-1 mb-1">RAG Thresholds</p>
                <div className="flex gap-4">
                  <span className="text-rose-400">Red: &lt;{thresholds.red}</span>
                  <span className="text-amber-400">Amber: &lt;{thresholds.amber}</span>
                  <span className="text-emerald-400">Green: &ge;{thresholds.amber}</span>
                </div>
                <div className="absolute top-full right-1 w-2 h-2 bg-slate-900 rotate-45 -mt-1 border-r border-b border-slate-700" />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col group/desc relative">
          <span className="text-3xl font-light tracking-tight text-slate-900">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 cursor-help">
            {description}
          </p>
          <div className="absolute left-0 bottom-full mb-2 hidden group-hover/desc:block z-50 bg-slate-900 text-white text-[10px] py-2 px-3 rounded shadow-xl max-w-[200px] border border-slate-700">
            <p className="leading-relaxed">{description}</p>
            <div className="absolute top-full left-4 w-2 h-2 bg-slate-900 rotate-45 -mt-1 border-r border-b border-slate-700" />
          </div>
        </div>

        {prediction && (
          <div className="mt-auto pt-4 border-t border-slate-50 group/advice relative">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <span className="font-semibold text-slate-800 uppercase tracking-tighter">AI Advice:</span>
              <span className={cn(
                "font-medium cursor-help",
                status === 'RED' ? 'text-rose-600' : status === 'AMBER' ? 'text-amber-600' : 'text-emerald-600'
              )}>
                {prediction.length > 35 ? `${prediction.substring(0, 35)}...` : prediction}
              </span>
            </div>
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover/advice:block z-50 bg-slate-900 text-white text-[10px] py-2 px-3 rounded shadow-xl max-w-[200px] border border-slate-700">
              <p className="leading-relaxed">"{prediction}"</p>
              <div className="absolute top-full left-4 w-2 h-2 bg-slate-900 rotate-45 -mt-1 border-r border-b border-slate-700" />
            </div>
          </div>
        )}
      </div>

      <div className={cn(
        "absolute bottom-0 left-0 h-1 w-full overflow-hidden rounded-b-xl",
        !enabled ? 'bg-slate-200' : (status === 'GREEN' ? 'bg-emerald-500' : status === 'AMBER' ? 'bg-amber-500' : 'bg-rose-500')
      )} />
    </motion.div>
  );
}
