import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  Users,
  Heart,
  Target,
  Rocket,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useRoadmapStore } from '../../store/useRoadmapStore';
import { COMPANY_GOALS } from '../../constants';
import { AIAnalysis } from './AIAnalysis';

const ICON_MAP: Record<string, LucideIcon> = {
  TrendingUp,
  DollarSign,
  Users,
  Heart,
  Target,
  Rocket,
};

export default function GoalsPage() {
  const items = useRoadmapStore((state) => state.items);
  const selectedYear = useRoadmapStore((state) => state.selectedYear);

  const goalsWithCount = useMemo(() => {
    return COMPANY_GOALS.map((goal) => ({
      ...goal,
      projectCount: items.filter((item) =>
        goal.relatedDepartments.includes(item.department)
      ).length,
    }));
  }, [items]);

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-thai text-white">
            เป้าหมาย {selectedYear}
          </h1>
          <p className="text-white/50 mt-1 font-thai text-sm">
            Personal Goals & Targets
          </p>
        </div>
        <AIAnalysis />
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {goalsWithCount.map((goal, index) => {
          const Icon = ICON_MAP[goal.icon] || Target;

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/8 transition-all"
            >
              {/* Icon + Title */}
              <div className="flex items-center gap-3 mb-4">
                <Icon className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-white font-thai truncate">
                    {goal.title}
                  </h3>
                </div>
              </div>

              {/* Target */}
              <div className="text-3xl font-bold text-cyan-400 mb-3">
                {goal.target}
              </div>

              {/* Related Metric (if exists) */}
              {goal.relatedMetric && (
                <div className="flex items-center gap-2 mb-3 text-sm">
                  <span className="text-white/50 font-thai">{goal.relatedMetric.name}:</span>
                  <span className="text-purple-400 font-semibold">{goal.relatedMetric.target}</span>
                </div>
              )}

              {/* Description (benchmark info) */}
              {goal.description && (
                <p className="text-xs text-white/40 font-thai">{goal.description}</p>
              )}

              {/* Project count */}
              <div className="mt-3 pt-3 border-t border-white/5 text-xs text-white/40 font-thai">
                {goal.projectCount} โครงการที่เกี่ยวข้อง
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
