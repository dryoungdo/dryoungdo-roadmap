import { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRoadmapStore } from '../../store/useRoadmapStore';
import type { Department } from '../../types';

export function StatusGrid() {
  const { items, setActiveSection, setFilters } = useRoadmapStore();
  const departments = useRoadmapStore((state) => state.departments);

  const handleDepartmentClick = useCallback((department: Department) => {
    setFilters({ departments: [department] });
    setActiveSection('roadmap');
  }, [setFilters, setActiveSection]);

  const departmentStats = useMemo(() =>
    departments.map((dept) => {
      const deptItems = items.filter((item) => item.department === dept.key);
      return {
        dept,
        deptItems,
        completedCount: deptItems.filter((item) => item.status === 'completed').length,
        atRiskCount: deptItems.filter((item) => item.status === 'at_risk').length,
        blockedCount: deptItems.filter((item) => item.status === 'blocked').length,
      };
    }), [items, departments]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departmentStats.map(({ dept, deptItems, completedCount, atRiskCount, blockedCount }, index) => {

          // Health indicator
          let healthColor = 'bg-green-500';
          if (blockedCount > 0) {
            healthColor = 'bg-red-500';
          } else if (atRiskCount > 0) {
            healthColor = 'bg-yellow-500';
          }

          return (
            <motion.div
              key={dept.key}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleDepartmentClick(dept.key)}
              className={`
                bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6
                cursor-pointer hover:bg-white/10 transition-all
                border-l-4 ${dept.borderClass}
              `}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className={`font-semibold font-thai ${dept.textClass} mb-1`}>
                    {dept.nameTh}
                  </h3>
                  <p className="text-white/60 text-sm font-thai">
                    {deptItems.length} รายการ
                  </p>
                </div>
                <div className={`w-3 h-3 rounded-full ${healthColor} animate-pulse`} />
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-thai">
                  <span className="text-white/70">ความคืบหน้า</span>
                  <span className="text-white font-semibold">
                    {completedCount} / {deptItems.length}
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: deptItems.length > 0
                        ? `${(completedCount / deptItems.length) * 100}%`
                        : '0%',
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className={dept.bgClass}
                  />
                </div>
              </div>

              {/* Status Breakdown */}
              {(atRiskCount > 0 || blockedCount > 0) && (
                <div className="mt-4 pt-4 border-t border-white/10 space-y-1">
                  {atRiskCount > 0 && (
                    <div className="flex items-center justify-between text-xs font-thai">
                      <span className="text-yellow-400">เสี่ยงล่าช้า</span>
                      <span className="text-yellow-400 font-semibold">{atRiskCount}</span>
                    </div>
                  )}
                  {blockedCount > 0 && (
                    <div className="flex items-center justify-between text-xs font-thai">
                      <span className="text-red-400">ติดขัด</span>
                      <span className="text-red-400 font-semibold">{blockedCount}</span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
    </div>
  );
}
