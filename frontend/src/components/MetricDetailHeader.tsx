import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    X,
    FileText,
    BarChart2,
    Info,
    Save,
    PlusCircle,
    ChevronUp,
    ChevronDown,
    RotateCcw,
    Check
} from 'lucide-react';
import { MetricHierarchy, RAGStatus, MetricNote } from '../types';
import { cn } from '../lib/utils';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

interface MetricDetailHeaderProps {
    metric: MetricHierarchy;
    onClose: () => void;
    onUpdateMetric: (id: string, updates: Partial<MetricHierarchy>) => void;
    addLog: (action: string, details: string) => void;
    t: any;
}

export function MetricDetailHeader({ metric, onClose, onUpdateMetric, addLog, t }: MetricDetailHeaderProps) {
    const [activeTab, setActiveTab] = useState<'notes' | 'histogram' | 'info'>('info');
    const [editNoteContent, setEditNoteContent] = useState('');
    const [editInfoContent, setEditInfoContent] = useState(metric.additionalInfo || '');
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
    const [isInfoEdited, setIsInfoEdited] = useState(false);
    const [isNoteEdited, setIsNoteEdited] = useState(false);
    const [showSaveFeedback, setShowSaveFeedback] = useState(false);

    const formatValue = (val: number, decimals: number = 2) => {
        const formatted = val.toLocaleString('de-DE', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
        return metric.unit === '€' ? `€${formatted}` : `${val.toFixed(decimals)}${metric.unit}`;
    };

    const statusColors = {
        GREEN: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]',
        AMBER: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]',
        RED: 'bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]',
    };

    const formatDate = (date: Date | string | number) => {
        if (!date) return '';
        const d = new Date(date);
        if (isNaN(d.getTime())) return String(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const sortedNotes = useMemo(() => {
        return [...(metric.notes || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [metric.notes]);

    useEffect(() => {
        setCurrentNoteIndex(0);
        setEditInfoContent(metric.additionalInfo || '');
        setIsInfoEdited(false);
    }, [metric.id, metric.additionalInfo]);

    useEffect(() => {
        if (activeTab === 'notes') {
            setCurrentNoteIndex(0);
            setIsAddingNote(false);
        }
    }, [activeTab]);

    useEffect(() => {
        if (isAddingNote) {
            setEditNoteContent('');
            setIsNoteEdited(false);
        } else if (sortedNotes.length > 0) {
            setEditNoteContent(sortedNotes[currentNoteIndex]?.content || '');
            setIsNoteEdited(false);
        } else {
            setEditNoteContent('');
            setIsNoteEdited(false);
        }
    }, [currentNoteIndex, sortedNotes, isAddingNote]);

    const handleSaveNote = () => {
        if (!editNoteContent.trim()) return;

        const newNote: MetricNote = {
            content: editNoteContent,
            date: new Date().toISOString()
        };

        let updatedNotes: MetricNote[] = [];
        if (isAddingNote) {
            updatedNotes = [newNote, ...(metric.notes || [])];
        } else {
            const originalNote = sortedNotes[currentNoteIndex];
            updatedNotes = (metric.notes || []).map(n => n === originalNote ? newNote : n);
        }

        onUpdateMetric(metric.id, { notes: updatedNotes });
        addLog('METRIC_NOTE', `${isAddingNote ? 'Added' : 'Updated'} note for ${metric.title}`);
        setIsAddingNote(false);
        setIsNoteEdited(false);
        triggerSaveFeedback();
    };

    const handleSaveInfo = () => {
        onUpdateMetric(metric.id, { additionalInfo: editInfoContent });
        addLog('METRIC_INFO_UPDATE', `Updated information text for ${metric.title}`);
        setIsInfoEdited(false);
        triggerSaveFeedback();
    };

    const triggerSaveFeedback = () => {
        setShowSaveFeedback(true);
        setTimeout(() => setShowSaveFeedback(false), 2000);
    };

    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-white dark:bg-slate-900 border-b-2 border-slate-900 dark:border-slate-700 shadow-2xl mb-8 overflow-hidden z-30"
        >
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 min-h-[260px]">
                {/* Column 1: Metric Details */}
                <div className="p-8 border-r border-slate-100 dark:border-slate-800 flex flex-col gap-4 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1.5 focus:outline-none">
                            <div className="flex items-center gap-2">
                                <div className={cn("h-2.5 w-2.5 rounded-full flex-shrink-0 animate-pulse", statusColors[metric.status])} />
                                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">{metric.title}</h2>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{metric.description}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="mt-auto space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black italic text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">{t.currentValue}</span>
                                <span className="text-2xl font-light text-slate-900 dark:text-white leading-none">
                  {formatValue(metric.value, metric.decimals)}
                </span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black italic text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">{t.target}</span>
                                <span className="text-sm font-bold text-slate-400 dark:text-slate-500 leading-none">
                  {formatValue(metric.target || 1, metric.decimals)}
                </span>
                            </div>
                        </div>

                        {metric.accountablePerson && (
                            <div className="flex items-center gap-3 px-3 py-2 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
                                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-black">
                                    {metric.accountablePerson.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[9px] font-black text-blue-400 uppercase tracking-tighter leading-none mb-1">{t.accountable}</span>
                                    <span className="text-xs font-bold text-blue-900 dark:text-blue-100 truncate leading-none">{metric.accountablePerson}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Column 2 & 3: Content and Switcher */}
                <div className="md:col-span-2 flex flex-col">
                    {/* Tabs */}
                    <div className="flex items-center gap-1 p-2 bg-slate-100/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                        {[
                            { id: 'notes', icon: FileText, label: t.notes },
                            { id: 'histogram', icon: BarChart2, label: t.histogram },
                            { id: 'info', icon: Info, label: t.info }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                    activeTab === tab.id
                                        ? "bg-slate-900 dark:bg-slate-700 text-white shadow-lg"
                                        : "text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800"
                                )}
                            >
                                <tab.icon size={14} />
                                {tab.label}
                            </button>
                        ))}

                        <AnimatePresence>
                            {showSaveFeedback && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="ml-auto flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest"
                                >
                                    <Check size={14} /> {t.savedSuccessfully}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 p-8 overflow-hidden">
                        <AnimatePresence mode="wait">
                            {activeTab === 'notes' && (
                                <motion.div
                                    key="notes"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="h-full flex flex-col"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">
                                                {isAddingNote ? t.newStrategicEntry : `${t.operationalNote} ${sortedNotes.length ? currentNoteIndex + 1 : 0}`}
                                            </h3>
                                            {!isAddingNote && sortedNotes.length > 0 && (
                                                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-700">
                          {formatDate(sortedNotes[currentNoteIndex]?.date)}
                        </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {!isAddingNote && (
                                                <button
                                                    onClick={() => setIsAddingNote(true)}
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
                                                >
                                                    <PlusCircle size={14} /> {t.addNote}
                                                </button>
                                            )}
                                            {!isAddingNote && sortedNotes.length > 1 && (
                                                <div className="flex items-center gap-1 ml-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5">
                                                    <button
                                                        disabled={currentNoteIndex === 0}
                                                        onClick={() => setCurrentNoteIndex(prev => prev - 1)}
                                                        className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition-all"
                                                    >
                                                        <ChevronUp size={16} />
                                                    </button>
                                                    <div className="w-6 text-center text-[10px] font-black text-slate-900 dark:text-white">{currentNoteIndex + 1}</div>
                                                    <button
                                                        disabled={currentNoteIndex >= sortedNotes.length - 1}
                                                        onClick={() => setCurrentNoteIndex(prev => prev + 1)}
                                                        className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition-all"
                                                    >
                                                        <ChevronDown size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex-1 relative flex flex-col gap-4">
                    <textarea
                        value={editNoteContent}
                        onChange={(e) => {
                            setEditNoteContent(e.target.value);
                            setIsNoteEdited(true);
                        }}
                        className="w-full flex-1 bg-slate-50/50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-6 text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed outline-none focus:border-slate-900 dark:focus:border-slate-500 focus:bg-white dark:focus:bg-slate-800 transition-all shadow-inner resize-none"
                        placeholder={t.placeholderNote}
                    />

                                        <AnimatePresence>
                                            {(isNoteEdited || isAddingNote) && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    className="flex justify-end items-center gap-3"
                                                >
                                                    {isAddingNote && (
                                                        <button
                                                            onClick={() => { setIsAddingNote(false); setCurrentNoteIndex(0); }}
                                                            className="px-4 py-2 text-xs font-black text-slate-400 hover:text-slate-900 dark:hover:text-white uppercase tracking-widest"
                                                        >
                                                            {t.cancel}
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={handleSaveNote}
                                                        disabled={!editNoteContent.trim()}
                                                        className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-slate-700 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-slate-200 dark:shadow-none disabled:opacity-50 disabled:grayscale"
                                                    >
                                                        <Save size={14} /> {isAddingNote ? t.addEntry : t.updateNote}
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'histogram' && (
                                <motion.div
                                    key="histogram"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.02 }}
                                    className="h-full flex flex-col"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                            {t.trajectory} <span className="text-[10px] text-slate-400 dark:text-slate-500 normal-case font-medium italic">{t.last12}</span>
                                        </h3>
                                    </div>
                                    <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 -ml-6">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart
                                                data={(metric.history || []).slice(-12).map((val, idx) => {
                                                    const date = new Date();
                                                    date.setDate(date.getDate() - ((metric.history?.length || 1) - 1 - idx));
                                                    return {
                                                        value: val,
                                                        dateLabel: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                                                    }
                                                })}
                                            >
                                                <XAxis
                                                    dataKey="dateLabel"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--chart-tick)' }}
                                                    dy={10}
                                                />
                                                <YAxis
                                                    hide={false}
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--chart-tick)' }}
                                                />
                                                <Tooltip
                                                    content={({ active, payload }) => {
                                                        if (active && payload && payload.length) {
                                                            return (
                                                                <div className="bg-slate-900 dark:bg-slate-950 text-white p-3 rounded-2xl text-xs shadow-2xl border border-slate-700 dark:border-slate-800">
                                                                    <p className="font-black border-b border-slate-700 dark:border-slate-800 pb-1.5 mb-1.5 uppercase tracking-widest">{payload[0].payload.dateLabel}</p>
                                                                    <p className="text-blue-400 font-bold text-lg">{payload[0].value}{metric.unit}</p>
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke="currentColor"
                                                    className="text-slate-900 dark:text-blue-400 transition-colors"
                                                    strokeWidth={3}
                                                    dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                                                    activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'info' && (
                                <motion.div
                                    key="info"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="h-full flex flex-col"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">{t.additionalContext}</h3>
                                    </div>
                                    <div className="flex-1 flex flex-col gap-4">
                    <textarea
                        value={editInfoContent}
                        onChange={(e) => {
                            setEditInfoContent(e.target.value);
                            setIsInfoEdited(true);
                        }}
                        className="w-full flex-1 bg-slate-50/50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-6 text-sm text-slate-600 dark:text-slate-400 font-semibold italic leading-relaxed outline-none focus:border-slate-900 dark:focus:border-slate-500 focus:bg-white dark:focus:bg-slate-800 transition-all shadow-inner resize-none"
                        placeholder={t.placeholderContext}
                    />

                                        <AnimatePresence>
                                            {isInfoEdited && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    className="flex justify-end"
                                                >
                                                    <button
                                                        onClick={handleSaveInfo}
                                                        className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-slate-700 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-slate-200 dark:shadow-none"
                                                    >
                                                        <Save size={14} /> {t.updateContext}
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}