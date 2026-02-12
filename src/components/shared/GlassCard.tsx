import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: string;
}

function GlassCard({ children, className = '', onClick, padding = 'p-4' }: GlassCardProps) {
  return (
    <motion.div
      className={`glass rounded-xl ${padding} ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

export default GlassCard;
