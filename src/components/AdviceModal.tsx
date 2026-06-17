import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AdviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function AdviceModal({ isOpen, onClose, children }: AdviceModalProps) {
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
            className="relative z-[101] bg-white dark:bg-slate-800 rounded-lg shadow-xl p-5 w-fit max-w-sm flex flex-col"
          >
            <div className="mb-4">{children}</div>
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
