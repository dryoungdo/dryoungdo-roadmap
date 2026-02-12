import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useRoadmapStore } from '../../store/useRoadmapStore';

export function ErrorToast() {
  const error = useRoadmapStore((s) => s.error);
  const clearError = useRoadmapStore((s) => s.clearError);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-20 right-4 z-50 max-w-sm bg-red-500/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg shadow-lg flex items-start gap-3"
        >
          <p className="text-sm flex-1">{error}</p>
          <button onClick={clearError} className="text-white/80 hover:text-white mt-0.5">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
