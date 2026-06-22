import { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

interface AdviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  metricName: string;
  aiAdvice: string;
  rawData: any;
  prompt: string;
  onUpdatePrompt: (newPrompt: string) => void;
}

export function AdviceModal({ isOpen, onClose, metricName, aiAdvice, rawData, prompt, onUpdatePrompt }: AdviceModalProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-[101] bg-white dark:bg-slate-800 rounded-lg shadow-xl p-5 w-full max-w-2xl flex flex-col max-h-[90vh]"
          >
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">AI advice - {metricName}</h2>

            <div className="mb-4 flex-grow overflow-y-auto pr-2 space-y-6">
              <section>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Advice</h3>
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded p-4 text-slate-800 dark:text-slate-200 markdown-body">
                  <ReactMarkdown>{aiAdvice}</ReactMarkdown>
                </div>
              </section>

              <section>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Analysis Prompt</h3>
                <textarea 
                  className="w-full bg-slate-100 dark:bg-slate-950 p-3 rounded text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap h-32 overflow-y-auto"
                  defaultValue={prompt}
                  ref={textareaRef}
                />
                <button 
                  onClick={() => {
                    const newPrompt = textareaRef.current?.value || prompt;
                    onUpdatePrompt(newPrompt);
                  }}
                  className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-colors"
                >
                  Update Advice
                </button>
              </section>

              <section>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Retrieved Data</h3>
                <pre className="bg-slate-100 dark:bg-slate-950 p-3 rounded text-xs font-mono text-slate-600 dark:text-slate-400 whitespace-pre-wrap h-32 overflow-y-auto">
                  {JSON.stringify(rawData, null, 2)}
                </pre>
              </section>
            </div>
            
            
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-3 py-1 bg-slate-900 text-white rounded text-xs font-bold uppercase tracking-widest hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
