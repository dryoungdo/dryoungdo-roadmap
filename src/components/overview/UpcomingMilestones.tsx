import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { useRoadmapStore } from '../../store/useRoadmapStore';
import { formatDateTh } from '../../lib/date-utils';

export function UpcomingMilestones() {
  const items = useRoadmapStore((state) => state.items);
  const departments = useRoadmapStore((state) => state.departments);

  const { upcomingMilestones, today, deptMap } = useMemo(() => {
    const deptMap = new Map(departments.map(d => [d.key, d]));
    const now = new Date();
    const sixtyDaysFromNow = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

    const milestones = items
      .flatMap((item) =>
        item.milestones.map((milestone) => ({
          ...milestone,
          itemTitle: item.title,
          department: item.department,
        }))
      )
      .filter((milestone) => {
        const milestoneDate = new Date(milestone.date);
        return milestoneDate >= now && milestoneDate <= sixtyDaysFromNow;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 10);

    return { upcomingMilestones: milestones, today: now, deptMap };
  }, [items, departments]);

  if (upcomingMilestones.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
        <Calendar className="w-12 h-12 text-white/40 mx-auto mb-3" />
        <p className="text-white/60 font-thai">ไม่มี milestone ในช่วง 60 วันข้างหน้า</p>
      </div>
    );
  }

  return (
    <div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl divide-y divide-white/10">
        {upcomingMilestones.map((milestone, index) => {
          const department = deptMap.get(milestone.department);
          if (!department) return null;
          const daysUntil = Math.ceil(
            (new Date(milestone.date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          );

          return (
            <motion.div
              key={`${milestone.id}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Date */}
                <div className="flex-shrink-0 w-20 text-center">
                  <div className="text-white/60 text-xs font-thai">
                    {new Date(milestone.date).getDate()}
                  </div>
                  <div className={`text-sm font-semibold font-thai ${department.textClass}`}>
                    {formatDateTh(milestone.date).split(' ')[1]}
                  </div>
                  {daysUntil <= 7 && (
                    <div className="text-[10px] text-amber-400 font-thai mt-1">
                      ({daysUntil} วัน)
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start gap-2 mb-1">
                    {milestone.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Calendar className="w-4 h-4 text-white/40 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div
                        className={`font-semibold font-thai ${
                          milestone.completed
                            ? 'text-white/60 line-through'
                            : 'text-white'
                        }`}
                      >
                        {milestone.title}
                      </div>
                      <div className="text-white/60 text-sm font-thai mt-1">
                        {milestone.itemTitle}
                      </div>
                    </div>
                  </div>

                  {/* Department Badge */}
                  <div className="mt-2">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-thai ${department.bgClass}/20 ${department.textClass}`}
                    >
                      {department.nameTh}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
