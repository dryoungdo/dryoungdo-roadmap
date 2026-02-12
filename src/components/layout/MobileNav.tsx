import { LayoutDashboard, Target, GanttChart, Crosshair, ScrollText, BookOpen, Settings, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRoadmapStore } from '../../store/useRoadmapStore';

function MobileNav() {
  const activeSection = useRoadmapStore((state) => state.activeSection);
  const setActiveSection = useRoadmapStore((state) => state.setActiveSection);

  const navItems = [
    {
      id: 'overview' as const,
      label: 'ภาพรวม',
      icon: LayoutDashboard,
    },
    {
      id: 'goals' as const,
      label: 'เป้าหมาย',
      icon: Target,
    },
    {
      id: 'roadmap' as const,
      label: 'แผนงาน',
      icon: GanttChart,
    },
    {
      id: 'focus' as const,
      label: 'โฟกัส',
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
    },
    {
      id: 'settings' as const,
      label: 'ตั้งค่า',
      icon: Settings,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 glass border-t border-slate-700/50 safe-area-bottom">
      <div className="flex items-center overflow-x-auto px-2 py-2 gap-1 scrollbar-hide">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-colors shrink-0 min-w-[3.5rem] ${
                isActive ? 'text-cyan-400' : 'text-slate-400'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] font-medium leading-tight">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileNav;
