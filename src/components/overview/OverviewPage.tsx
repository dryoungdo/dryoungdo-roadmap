import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Target,
  BarChart3,
  Calendar
} from 'lucide-react';
import { useRoadmapStore } from '../../store/useRoadmapStore';
import { StatusGrid } from './StatusGrid';
import { UpcomingMilestones } from './UpcomingMilestones';

function OverviewPage() {
  const items = useRoadmapStore((state) => state.items);

  // Compute KPI metrics
  const metrics = useMemo(() => {
    const totalItems = items.length;

    // On Track percentage (on_track + completed)
    const onTrackCount = items.filter(
      (item) => item.status === 'on_track' || item.status === 'completed'
    ).length;
    const onTrackPercentage = totalItems > 0
      ? Math.round((onTrackCount / totalItems) * 100)
      : 0;

    // At Risk count (at_risk + blocked)
    const atRiskCount = items.filter(
      (item) => item.status === 'at_risk' || item.status === 'blocked'
    ).length;

    // Average progress across all items
    const totalProgress = items.reduce((sum, item) => sum + item.progress, 0);
    const avgProgress = totalItems > 0
      ? Math.round(totalProgress / totalItems)
      : 0;

    // Items this month (startDate in current month)
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const itemsThisMonth = items.filter((item) => {
      const startDate = new Date(item.startDate);
      return (
        startDate.getMonth() === currentMonth &&
        startDate.getFullYear() === currentYear
      );
    }).length;

    return {
      totalItems,
      onTrackPercentage,
      atRiskCount,
      avgProgress,
      itemsThisMonth,
    };
  }, [items]);

  // KPI card data
  const kpiCards = useMemo(() => [
    {
      id: 'total',
      label: 'โครงการทั้งหมด',
      value: metrics.totalItems,
      icon: Target,
      color: 'text-blue-400',
      bgGradient: 'from-blue-500/20 to-blue-600/10',
      ariaLabel: `จำนวนโครงการทั้งหมด ${metrics.totalItems} โครงการ`,
    },
    {
      id: 'on-track',
      label: 'ดำเนินการตามแผน',
      value: `${metrics.onTrackPercentage}%`,
      icon: CheckCircle2,
      color: metrics.onTrackPercentage >= 80
        ? 'text-green-400'
        : metrics.onTrackPercentage >= 60
        ? 'text-yellow-400'
        : 'text-red-400',
      bgGradient: metrics.onTrackPercentage >= 80
        ? 'from-green-500/20 to-green-600/10'
        : metrics.onTrackPercentage >= 60
        ? 'from-yellow-500/20 to-yellow-600/10'
        : 'from-red-500/20 to-red-600/10',
      ariaLabel: `โครงการที่ดำเนินการตามแผน ${metrics.onTrackPercentage} เปอร์เซ็นต์`,
    },
    {
      id: 'at-risk',
      label: 'ต้องติดตาม',
      value: metrics.atRiskCount,
      icon: AlertTriangle,
      color: metrics.atRiskCount === 0
        ? 'text-green-400'
        : metrics.atRiskCount <= 2
        ? 'text-yellow-400'
        : 'text-red-400',
      bgGradient: metrics.atRiskCount === 0
        ? 'from-green-500/20 to-green-600/10'
        : metrics.atRiskCount <= 2
        ? 'from-yellow-500/20 to-yellow-600/10'
        : 'from-red-500/20 to-red-600/10',
      ariaLabel: `จำนวนโครงการที่ต้องติดตาม ${metrics.atRiskCount} โครงการ`,
    },
    {
      id: 'avg-progress',
      label: 'ความคืบหน้าเฉลี่ย',
      value: `${metrics.avgProgress}%`,
      icon: BarChart3,
      color: 'text-purple-400',
      bgGradient: 'from-purple-500/20 to-purple-600/10',
      ariaLabel: `ความคืบหน้าเฉลี่ย ${metrics.avgProgress} เปอร์เซ็นต์`,
    },
    {
      id: 'this-month',
      label: 'เริ่มเดือนนี้',
      value: metrics.itemsThisMonth,
      icon: Calendar,
      color: 'text-cyan-400',
      bgGradient: 'from-cyan-500/20 to-cyan-600/10',
      ariaLabel: `โครงการที่เริ่มในเดือนนี้ ${metrics.itemsThisMonth} โครงการ`,
    },
    {
      id: 'momentum',
      label: 'โมเมนตัม',
      value: metrics.onTrackPercentage >= 75 && metrics.atRiskCount <= 2 ? 'สูง' : 'ปานกลาง',
      icon: TrendingUp,
      color: metrics.onTrackPercentage >= 75 && metrics.atRiskCount <= 2
        ? 'text-green-400'
        : 'text-yellow-400',
      bgGradient: metrics.onTrackPercentage >= 75 && metrics.atRiskCount <= 2
        ? 'from-green-500/20 to-green-600/10'
        : 'from-yellow-500/20 to-yellow-600/10',
      ariaLabel: `โมเมนตัมของโครงการ ${metrics.onTrackPercentage >= 75 && metrics.atRiskCount <= 2 ? 'สูง' : 'ปานกลาง'}`,
    },
  ], [metrics]);

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-thai text-white">
          ภาพรวมผู้บริหาร
        </h1>
        <p className="text-slate-400 mt-2 font-thai">
          ภาพรวมสถานะโครงการและตัวชี้วัดสำคัญ
        </p>
      </div>

      {/* KPI Summary Cards */}
      <section aria-label="ตัวชี้วัดสำคัญ">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {kpiCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`
                  relative overflow-hidden
                  bg-white/5 backdrop-blur-sm
                  border border-white/10
                  rounded-xl p-5
                  hover:bg-white/10
                  transition-all duration-300
                  group
                `}
                aria-label={card.ariaLabel}
              >
                {/* Background gradient */}
                <div
                  className={`
                    absolute inset-0 bg-gradient-to-br ${card.bgGradient}
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-300
                  `}
                />

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <Icon
                      className={`w-5 h-5 ${card.color}`}
                      aria-hidden="true"
                    />
                  </div>

                  <div className={`text-3xl font-bold ${card.color} mb-1`}>
                    {card.value}
                  </div>

                  <div className="text-sm text-slate-400 font-thai">
                    {card.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Department Health Grid */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        aria-label="สถานะตามแผนก"
      >
        <h2 className="text-xl font-bold font-thai text-white mb-4">
          สถานะตามแผนก
        </h2>
        <StatusGrid />
      </motion.section>

      {/* Upcoming Milestones */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        aria-label="เหตุการณ์สำคัญที่จะถึง"
      >
        <h2 className="text-xl font-bold font-thai text-white mb-4">
          เหตุการณ์สำคัญ 60 วันข้างหน้า
        </h2>
        <UpcomingMilestones />
      </motion.section>
    </div>
  );
}

export default OverviewPage;
