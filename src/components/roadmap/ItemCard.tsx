import { memo, useMemo } from 'react';
import { CheckCircle2, Circle, Link2, ExternalLink, Crosshair } from 'lucide-react';
import { motion } from 'framer-motion';
import type { RoadmapItem } from '../../types';
import { STATUSES_MAP } from '../../constants';
import { formatDateRange } from '../../lib/date-utils';
import { useRoadmapStore } from '../../store/useRoadmapStore';

interface ItemCardProps {
  item: RoadmapItem;
}

const PRIORITY_COLORS: Record<string, string> = {
  P0: 'bg-red-500/20 text-red-400 border-red-500/50',
  P1: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
  P2: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  P3: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
};

const STATUS_COLOR_CLASSES: Record<string, string> = {
  gray: 'bg-gray-500/20 text-gray-400',
  blue: 'bg-blue-500/20 text-blue-400',
  green: 'bg-green-500/20 text-green-400',
  yellow: 'bg-yellow-500/20 text-yellow-400',
  red: 'bg-red-500/20 text-red-400',
  emerald: 'bg-emerald-500/20 text-emerald-400',
};

export const ItemCard = memo(function ItemCard({ item }: ItemCardProps) {
  const { setEditingItem, setShowForm, updateItem, navigateToFocus } = useRoadmapStore();
  const departments = useRoadmapStore((state) => state.departments);
  const owners = useRoadmapStore((state) => state.owners);

  const deptMap = useMemo(() => new Map(departments.map(d => [d.key, d])), [departments]);
  const ownerMap = useMemo(() => new Map(owners.map(o => [o.key, o.label])), [owners]);

  const department = deptMap.get(item.department);
  const status = STATUSES_MAP.get(item.status)!;
  const ownerLabel = ownerMap.get(item.owner) || item.owner;

  const handleClick = () => {
    setEditingItem(item);
    setShowForm(true);
  };

  if (!department) return null;

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={handleClick}
      className={`
        bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4
        cursor-pointer hover:bg-white/10 transition-all
        border-l-4 ${department.borderClass}
      `}
    >
      {/* Title & Subtitle */}
      <div className="mb-3">
        <h3
          className="text-white font-semibold font-thai mb-1 select-text"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {item.title}
        </h3>
        {item.subtitle && (
          <p
            className="text-white/60 text-sm font-thai select-text"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            {item.subtitle}
          </p>
        )}
      </div>

      {/* Badges Row */}
      <div className="flex flex-wrap gap-2 mb-3">
        {/* Priority */}
        <span
          className={`px-2 py-1 rounded text-xs font-semibold font-thai border ${
            PRIORITY_COLORS[item.priority]
          }`}
        >
          {item.priority}
        </span>

        {/* Status */}
        <span
          className={`px-2 py-1 rounded text-xs font-thai ${
            STATUS_COLOR_CLASSES[status.color]
          }`}
        >
          {status.label}
        </span>

        {/* Owner */}
        <span className="px-2 py-1 rounded text-xs font-thai bg-amber-500/20 text-amber-400">
          {ownerLabel}
        </span>

        {/* Focus button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigateToFocus(item.id);
          }}
          className="ml-auto p-1 text-white/30 hover:text-emerald-400 transition-colors"
          title="Focus view"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      {/* Date Range */}
      <div className="text-white/60 text-sm font-thai mb-3">
        {formatDateRange(item.startDate, item.endDate)}
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-white/60 text-xs font-thai">ความคืบหน้า</span>
          <span className="text-white/80 text-xs font-semibold font-thai">{item.progress}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${item.progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`h-full ${department.bgClass}`}
          />
        </div>
      </div>

      {/* Milestones */}
      {item.milestones.length > 0 && (
        <div className="space-y-1 mb-3">
          <span className="text-white/60 text-xs font-thai">Milestones:</span>
          <div className="space-y-1">
            {item.milestones.map((milestone) => (
              <div key={milestone.id} className="flex items-center gap-2 text-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const updatedMilestones = item.milestones.map((m) =>
                      m.id === milestone.id ? { ...m, completed: !m.completed } : m
                    );
                    const newProgress = Math.round(
                      (updatedMilestones.filter((m) => m.completed).length / updatedMilestones.length) * 100
                    );
                    updateItem(item.id, { milestones: updatedMilestones, progress: newProgress });
                  }}
                  className="flex-shrink-0"
                >
                  {milestone.completed ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Circle className="w-3 h-3 text-white/40" />
                  )}
                </button>
                <span
                  className={`font-thai select-text ${
                    milestone.completed ? 'text-white/80 line-through' : 'text-white/60'
                  }`}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                >
                  {milestone.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes Preview */}
      {item.notes && (
        <div
          className="text-white/50 text-xs font-thai line-clamp-2 border-t border-white/10 pt-2 select-text"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {item.notes}
        </div>
      )}

      {/* Links */}
      {item.links && item.links.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex flex-wrap gap-2">
            {item.links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded text-xs transition-colors border border-emerald-500/20"
                onClick={(e) => e.stopPropagation()}
              >
                <Link2 className="w-3 h-3" />
                {link.title}
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
});
