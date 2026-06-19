import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }: ConfirmationModalProps) {
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
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">{message}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-3 py-1 bg-slate-100 text-slate-700 rounded text-xs font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { onConfirm(); onClose(); }}
                className="px-3 py-1 bg-rose-600 text-white rounded text-xs font-bold uppercase tracking-widest hover:bg-rose-700 transition-colors"
             >
                Remove
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
