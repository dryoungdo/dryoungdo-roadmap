import { useCallback } from 'react';
import { Search, LayoutList, Calendar, X, ArrowUp, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRoadmapStore } from '../../store/useRoadmapStore';
import { PRIORITIES } from '../../constants';
import type { Department, Priority, Owner, SortBy } from '../../types';

const SORT_OPTIONS: { key: SortBy; label: string }[] = [
  { key: 'startDate', label: 'วันเริ่ม' },
  { key: 'endDate', label: 'วันสิ้นสุด' },
  { key: 'priority', label: 'ความสำคัญ' },
  { key: 'createdAt', label: 'วันสร้าง' },
  { key: 'updatedAt', label: 'วันอัปเดต' },
];

const PRIORITY_COLOR_CLASSES: Record<string, string> = {
  red: 'bg-red-500/20 text-red-400 border-red-500/50',
  orange: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
  yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  gray: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
};

export function FilterBar() {
  const { filters, setFilters, resetFilters, viewMode, setViewMode, setSortOptions } = useRoadmapStore();
  const departments = useRoadmapStore((state) => state.departments);
  const owners = useRoadmapStore((state) => state.owners);

  const toggleDepartment = useCallback((dept: Department) => {
    setFilters({ departments: filters.departments.includes(dept)
      ? filters.departments.filter((d) => d !== dept)
      : [...filters.departments, dept] });
  }, [filters.departments, setFilters]);

  const togglePriority = useCallback((priority: Priority) => {
    setFilters({ priorities: filters.priorities.includes(priority)
      ? filters.priorities.filter((p) => p !== priority)
      : [...filters.priorities, priority] });
  }, [filters.priorities, setFilters]);

  const setOwner = useCallback((owner: Owner | 'all') => {
    setFilters({ owner });
  }, [setFilters]);

  return (
    <div className="border-b border-white/10 bg-surface/50 backdrop-blur-sm">
      <div className="p-4 space-y-3">
        {/* Row 1: Search + View Toggle */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              placeholder="ค้นหารายการ..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-thai"
            />
          </div>

          {/* View Toggle (Desktop only) */}
          <div className="hidden lg:flex items-center gap-2 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setViewMode('gantt')}
              className={`p-2 rounded ${
                viewMode === 'gantt'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-white/60 hover:text-white/80'
              } transition-colors`}
            >
              <Calendar className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${
                viewMode === 'list'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-white/60 hover:text-white/80'
              } transition-colors`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/80 hover:text-white transition-colors font-thai flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">รีเซ็ต</span>
          </button>
        </div>

        {/* Row 2: Department Pills */}
        <div className="flex flex-wrap gap-2">
          <span className="text-white/60 text-sm font-thai">แผนก:</span>
          {departments.map((dept) => {
            const isActive = filters.departments.includes(dept.key);
            return (
              <motion.button
                key={dept.key}
                onClick={() => toggleDepartment(dept.key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1 rounded-full text-xs font-thai transition-all ${
                  isActive
                    ? `${dept.bgClass}/20 ${dept.textClass} border ${dept.borderClass}/50`
                    : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                }`}
              >
                {dept.nameTh}
              </motion.button>
            );
          })}
        </div>

        {/* Row 3: Priority + Owner Pills */}
        <div className="flex flex-wrap gap-4">
          {/* Priority Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-white/60 text-sm font-thai">ความสำคัญ:</span>
            {PRIORITIES.map((priority) => {
              const isActive = filters.priorities.includes(priority.key);
              return (
                <motion.button
                  key={priority.key}
                  onClick={() => togglePriority(priority.key)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-1 rounded-full text-xs font-thai transition-all ${
                    isActive
                      ? `${PRIORITY_COLOR_CLASSES[priority.color]} border`
                      : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {priority.key}
                </motion.button>
              );
            })}
          </div>

          {/* Owner Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-white/60 text-sm font-thai">เจ้าของ:</span>
            {[{ key: 'all' as const, label: 'ทั้งหมด' }, ...owners].map((owner) => {
              const isActive = filters.owner === owner.key;
              return (
                <motion.button
                  key={owner.key}
                  onClick={() => setOwner(owner.key)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-1 rounded-full text-xs font-thai transition-all ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                      : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {owner.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Row 4: Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-white/60 text-sm font-thai">เรียงตาม:</span>
          <div className="flex flex-wrap gap-2">
            {SORT_OPTIONS.map((option) => {
              const isActive = filters.sortBy === option.key;
              return (
                <motion.button
                  key={option.key}
                  onClick={() => setSortOptions(option.key, filters.sortDirection)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-1 rounded-full text-xs font-thai transition-all ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                      : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {option.label}
                </motion.button>
              );
            })}
          </div>
          <motion.button
            onClick={() => setSortOptions(
              filters.sortBy,
              filters.sortDirection === 'asc' ? 'desc' : 'asc'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1 rounded-full text-xs font-thai bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 flex items-center gap-1 transition-all"
          >
            {filters.sortDirection === 'asc' ? (
              <><ArrowUp className="w-3 h-3" /><span>น้อย-มาก</span></>
            ) : (
              <><ArrowDown className="w-3 h-3" /><span>มาก-น้อย</span></>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
