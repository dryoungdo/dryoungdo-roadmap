import { memo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, XCircle, Diamond, Crosshair } from 'lucide-react';
import type { RoadmapItem, DepartmentConfig } from '../../types';
import { getBarPosition, formatDateRange } from '../../lib/date-utils';
import { useRoadmapStore } from '../../store/useRoadmapStore';

interface GanttBarProps {
  item: RoadmapItem;
  departmentConfig: DepartmentConfig;
}

const STATUS_STYLES: Record<string, string> = {
  planned: 'opacity-40 border-2 border-dashed',
  in_progress: 'opacity-70',
  on_track: 'opacity-80 shadow-lg shadow-green-500/20',
  at_risk: 'opacity-70 border-2 border-amber-500 animate-pulse',
  blocked: 'opacity-50 border-2 border-red-500',
  completed: 'opacity-90',
};

const PRIORITY_COLORS: Record<string, string> = {
  P0: 'bg-red-500 text-white',
  P1: 'bg-orange-500 text-white',
  P2: 'bg-yellow-500 text-black',
  P3: 'bg-gray-500 text-white',
};

export const GanttBar = memo(function GanttBar({ item, departmentConfig }: GanttBarProps) {
  const { setEditingItem, setShowForm, navigateToFocus, selectedYear } = useRoadmapStore();
  const { left, width } = getBarPosition(item.startDate, item.endDate, selectedYear);

  const handleClick = () => {
    setEditingItem(item);
    setShowForm(true);
  };

  const statusIcons = {
    on_track: <CheckCircle2 className="w-3 h-3 text-green-400" />,
    at_risk: <AlertCircle className="w-3 h-3 text-amber-400" />,
    blocked: <XCircle className="w-3 h-3 text-red-400" />,
    completed: <CheckCircle2 className="w-3 h-3 text-emerald-400" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, zIndex: 50 }}
      className="absolute h-full cursor-pointer group"
      style={{ left, width }}
      onClick={handleClick}
    >
      {/* Main Bar */}
      <div
        className={`
          h-full rounded-md px-2 flex items-center gap-2 overflow-hidden
          ${departmentConfig.bgClass}/60 backdrop-blur-sm
          ${STATUS_STYLES[item.status]}
          hover:ring-2 hover:ring-white/30
          transition-all duration-200
        `}
      >
        {/* Status Icon */}
        {statusIcons[item.status as keyof typeof statusIcons] && (
          <div className="flex-shrink-0">
            {statusIcons[item.status as keyof typeof statusIcons]}
          </div>
        )}

        {/* Title */}
        <span
          className="text-white text-xs font-semibold truncate font-thai flex-1 select-text"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {item.title}
        </span>

        {/* Priority Badge */}
        <span
          className={`flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold ${
            PRIORITY_COLORS[item.priority]
          }`}
        >
          {item.priority}
        </span>
      </div>

      {/* Milestones */}
      {item.milestones.map((milestone) => {
        const milestoneDate = new Date(milestone.date);
        const itemStartDate = new Date(item.startDate);
        const itemEndDate = new Date(item.endDate);
        const totalDuration = itemEndDate.getTime() - itemStartDate.getTime();
        const milestonePosition =
          ((milestoneDate.getTime() - itemStartDate.getTime()) / totalDuration) * 100;

        if (milestonePosition < 0 || milestonePosition > 100) return null;

        return (
          <div
            key={milestone.id}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
            style={{ left: `${milestonePosition}%` }}
          >
            <Diamond
              className={`w-3 h-3 ${
                milestone.completed ? 'fill-emerald-400 text-emerald-400' : 'text-white/60'
              }`}
            />
          </div>
        );
      })}

      {/* Tooltip */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
        <div className="bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-xs text-white space-y-1 whitespace-nowrap font-thai shadow-xl">
          <div className="font-semibold">{item.title}</div>
          <div className="text-white/70">{formatDateRange(item.startDate, item.endDate)}</div>
          <div className="text-white/70">เจ้าของ: {item.owner}</div>
          <div className="text-white/70">ความคืบหน้า: {item.progress}%</div>
          {item.milestones.length > 0 && (
            <div className="text-white/70">
              Milestones: {item.milestones.filter((m) => m.completed).length}/{item.milestones.length}
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateToFocus(item.id);
            }}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 mt-1"
          >
            <Crosshair className="w-3 h-3" />
            Focus View
          </button>
        </div>
      </div>
    </motion.div>
  );
});
