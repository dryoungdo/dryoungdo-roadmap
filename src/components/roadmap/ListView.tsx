import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRoadmapStore } from '../../store/useRoadmapStore';
import { ItemCard } from './ItemCard';
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

export function ListView() {
  const getFilteredItems = useRoadmapStore((state) => state.getFilteredItems);
  const departments = useRoadmapStore((state) => state.departments);
  const filters = useRoadmapStore((state) => state.filters);
  const filteredItems = getFilteredItems();

  const itemsByDepartment = useMemo(() => {
    const sorted = sortItems(filteredItems, filters.sortBy, filters.sortDirection);

    return departments.map((dept) => ({
      department: dept,
      items: sorted.filter((item) => item.department === dept.key),
    })).filter((group) => group.items.length > 0);
  }, [filteredItems, departments, filters.sortBy, filters.sortDirection]);

  return (
    <div className="h-full overflow-auto p-4 space-y-6 bg-surface">
      {itemsByDepartment.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-white/60 text-center font-thai">
            ไม่พบรายการที่ตรงกับเงื่อนไขการกรอง
          </p>
        </div>
      ) : (
        itemsByDepartment.map((group, groupIndex) => (
          <motion.div
            key={group.department.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
            className="space-y-3"
          >
            {/* Department Header */}
            <div className="flex items-center gap-3">
              <div
                className={`w-1 h-6 rounded-full ${group.department.bgClass}`}
              />
              <h2 className={`text-lg font-semibold font-thai ${group.department.textClass}`}>
                {group.department.nameTh}
              </h2>
              <span className="text-white/40 text-sm font-thai">
                ({group.items.length})
              </span>
            </div>

            {/* Items */}
            <div className="space-y-2">
              {group.items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: groupIndex * 0.1 + index * 0.05 }}
                >
                  <ItemCard item={item} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}
