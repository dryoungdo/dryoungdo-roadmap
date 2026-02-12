import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRoadmapStore } from '../../store/useRoadmapStore';
import { GanttHeader } from './GanttHeader';
import { SwimLane } from './SwimLane';
import { getDayOfYear, getDaysInYear } from '../../lib/date-utils';
import type { RoadmapItem, SortBy, SortDirection } from '../../types';

const PRIORITY_ORDER: Record<string, number> = { P0: 0, P1: 1, P2: 2, P3: 3 };

function sortItems(items: RoadmapItem[], sortBy: SortBy, sortDirection: SortDirection) {
  return [...items].sort((a, b) => {
    let cmp = 0;
    switch (sortBy) {
      case 'startDate':
        cmp = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        break;
      case 'endDate':
        cmp = new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        break;
      case 'priority':
        cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        break;
      case 'createdAt':
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'updatedAt':
        cmp = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
    }
    return sortDirection === 'asc' ? cmp : -cmp;
  });
}

export function GanttView() {
  const getFilteredItems = useRoadmapStore((state) => state.getFilteredItems);
  const departments = useRoadmapStore((state) => state.departments);
  const filters = useRoadmapStore((state) => state.filters);
  const selectedYear = useRoadmapStore((state) => state.selectedYear);
  const filteredItems = getFilteredItems();

  // Calculate today marker position
  const today = new Date();
  const todayPosition = today.getFullYear() === selectedYear
    ? ((getDayOfYear(today.toISOString()) - 1) / getDaysInYear(selectedYear)) * 100
    : -1; // Don't show if not current year

  const itemsByDepartment = useMemo(() =>
    departments.map((dept) => ({
      dept,
      items: sortItems(
        filteredItems.filter((item) => item.department === dept.key),
        filters.sortBy,
        filters.sortDirection
      ),
    })), [filteredItems, departments, filters.sortBy, filters.sortDirection]);

  return (
    <div className="hidden lg:block h-full overflow-auto bg-surface">
      <div className="min-w-[1200px] p-4">
        {/* Gantt Grid */}
        <div
          className="grid relative"
          style={{
            gridTemplateColumns: '200px repeat(12, 1fr)',
            gridAutoRows: 'auto',
          }}
        >
          {/* Today Marker */}
          {todayPosition >= 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute top-0 bottom-0 border-l-2 border-dashed border-red-500/50 pointer-events-none z-10"
              style={{
                left: `calc(200px + ${todayPosition}% * (100% - 200px) / 100)`,
              }}
            >
              <div className="absolute -top-1 left-0 -translate-x-1/2 px-2 py-0.5 bg-red-500 text-white text-xs rounded font-thai">
                วันนี้
              </div>
            </motion.div>
          )}

          {/* Header */}
          <GanttHeader />

          {/* Swim Lanes */}
          {itemsByDepartment.map(({ dept, items: deptItems }) => (
            <SwimLane
              key={dept.key}
              department={dept}
              items={deptItems}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
