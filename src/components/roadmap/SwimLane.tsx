import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DepartmentConfig, RoadmapItem } from '../../types';
import { GanttBar } from './GanttBar';
import { useRoadmapStore } from '../../store/useRoadmapStore';

interface SwimLaneProps {
  department: DepartmentConfig;
  items: RoadmapItem[];
}

export function SwimLane({ department, items }: SwimLaneProps) {
  const [collapsed, setCollapsed] = useState(false);
  const rowHeight = Math.max(items.length * 48, 48);
  const { setShowForm, setEditingItem, setNewItemDefaults, selectedYear } = useRoadmapStore();

  return (
    <>
      {/* Department Label */}
      <div
        className={`border-b border-white/10 p-3 flex items-center gap-2 cursor-pointer hover:bg-white/5 transition-colors border-l-4 ${department.borderClass}`}
        onClick={() => setCollapsed(!collapsed)}
        style={{ minHeight: '48px' }}
      >
        <button className="text-white/60 hover:text-white/80">
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        <span className={`text-sm font-semibold font-thai ${department.textClass}`}>
          {department.nameTh}
        </span>
        <span className="text-white/40 text-xs font-thai">({items.length})</span>
      </div>

      {/* Timeline Area */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: rowHeight, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="col-span-12 border-b border-white/10 relative overflow-hidden"
          >
            {/* Clickable background for adding new items */}
            <div
              className="absolute inset-0 cursor-crosshair z-0"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const fraction = x / rect.width;

                const month = Math.floor(fraction * 12);
                const day = Math.floor((fraction * 12 - month) * 28) + 1;
                const clampedDay = Math.max(1, Math.min(28, day));
                const startDate = `${selectedYear}-${String(month + 1).padStart(2, '0')}-${String(clampedDay).padStart(2, '0')}`;

                const endDateObj = new Date(selectedYear, month, clampedDay + 30);
                const endDate = endDateObj.toISOString().split('T')[0];

                setEditingItem(null);
                setNewItemDefaults({ department: department.key, startDate, endDate });
                setShowForm(true);
              }}
              title="Click to add new item"
            />

            {/* Month Column Backgrounds */}
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className={`absolute top-0 bottom-0 border-l border-white/5 cursor-crosshair z-0 ${
                  index % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'
                }`}
                style={{
                  left: `${(index / 12) * 100}%`,
                  width: `${(1 / 12) * 100}%`,
                }}
              />
            ))}

            {/* Gantt Bars */}
            <div className="relative h-full z-10">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="absolute left-0 right-0"
                  style={{
                    top: `${index * 48 + 8}px`,
                    height: '32px',
                  }}
                >
                  <GanttBar item={item} departmentConfig={department} />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed State (empty cells) */}
      {collapsed && (
        <div className="col-span-12 border-b border-white/10" style={{ height: '0px' }} />
      )}
    </>
  );
}
