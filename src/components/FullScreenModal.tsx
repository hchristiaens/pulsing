import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { ReactNode, useEffect } from 'react';
import ReactDOM from 'react-dom';

interface FullScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function FullScreenModal({ isOpen, onClose, children, className }: FullScreenModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={cn(
          "fixed inset-2 md:inset-10 z-[101] bg-white dark:bg-slate-800 shadow-2xl overflow-y-auto rounded-xl flex items-center justify-center p-8",
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="w-full max-w-6xl flex flex-col items-center">
          {children}
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
