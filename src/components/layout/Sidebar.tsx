import { LayoutDashboard, Target, GanttChart, Crosshair, ScrollText, BookOpen, Settings, MessageSquare, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRoadmapStore } from '../../store/useRoadmapStore';

function Sidebar() {
  const activeSection = useRoadmapStore((state) => state.activeSection);
  const setActiveSection = useRoadmapStore((state) => state.setActiveSection);
  const items = useRoadmapStore((state) => state.items);
  const feedbackItems = useRoadmapStore((state) => state.feedbackItems);
  const selectedYear = useRoadmapStore((state) => state.selectedYear);
  const setSelectedYear = useRoadmapStore((state) => state.setSelectedYear);
  const getAvailableYears = useRoadmapStore((state) => state.getAvailableYears);

  const navItems = [
    {
      id: 'overview' as const,
      label: 'ภาพรวม',
      icon: LayoutDashboard,
    },
    {
      id: 'goals' as const,
      label: 'เป้าหมายองค์กร',
      icon: Target,
    },
    {
      id: 'roadmap' as const,
      label: 'แผนงาน',
      icon: GanttChart,
      count: items.length,
    },
    {
      id: 'focus' as const,
      label: 'โฟกัสรายการ',
      icon: Crosshair,
    },
    {
      id: 'analysis' as const,
      label: 'บันทึก AI',
      icon: ScrollText,
    },
    {
      id: 'definition' as const,
      label: 'คำจำกัดความ',
      icon: BookOpen,
    },
    {
      id: 'feedback' as const,
      label: 'ข้อเสนอแนะ',
      icon: MessageSquare,
      count: feedbackItems.filter(f => f.status === 'new').length,
    },
    {
      id: 'settings' as const,
      label: 'ตั้งค่า',
      icon: Settings,
    },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 glass border-r border-slate-700/50">
      {/* Logo/Title */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <Compass className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold font-display gradient-text">
              Dr.Do Roadmap
            </h2>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="text-xs text-slate-400 bg-transparent border-none outline-none cursor-pointer hover:text-emerald-400 transition-colors appearance-none"
            >
              {getAvailableYears().map((year) => (
                <option key={year} value={year} className="bg-slate-800 text-white">
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
              }`}
              whileTap={{ scale: 0.98 }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 rounded-r"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              <Icon className="w-5 h-5" />
              <span className="flex-1 text-left font-medium">{item.label}</span>

              {item.count !== undefined && item.count > 0 && (
                <span className="px-2 py-0.5 text-xs bg-slate-700 rounded-full">
                  {item.count}
                </span>
              )}
            </motion.button>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
