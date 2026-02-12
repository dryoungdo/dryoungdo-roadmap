import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  colorClass?: string;
  height?: string;
}

function ProgressBar({ progress, colorClass = 'bg-emerald-500', height = 'h-1.5' }: ProgressBarProps) {
  return (
    <div className={`w-full ${height} bg-slate-700/50 rounded-full overflow-hidden`}>
      <motion.div
        className={`${height} ${colorClass} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          background: `linear-gradient(90deg, ${colorClass} 0%, ${colorClass} 100%)`,
        }}
      />
    </div>
  );
}

export default ProgressBar;
