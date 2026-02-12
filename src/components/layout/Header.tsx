import { Plus, Sun, Moon, LogOut } from 'lucide-react';
import { useRoadmapStore } from '../../store/useRoadmapStore';

function Header() {
  const activeSection = useRoadmapStore((state) => state.activeSection);
  const setShowForm = useRoadmapStore((state) => state.setShowForm);
  const theme = useRoadmapStore((state) => state.theme);
  const toggleTheme = useRoadmapStore((state) => state.toggleTheme);
  const logout = useRoadmapStore((state) => state.logout);
  const currentUser = useRoadmapStore((state) => state.currentUser);

  const titles: Record<string, string> = {
    overview: 'ภาพรวม',
    roadmap: 'แผนงาน 2026',
    definition: 'คำจำกัดความ',
    feedback: 'ข้อเสนอแนะ',
    settings: 'ตั้งค่า',
  };
  const title = titles[activeSection] || 'แผนงาน 2026';

  return (
    <header className="glass border-b border-slate-700/50 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl lg:text-2xl font-bold font-display">{title}</h1>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors border border-white/10"
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Add Item */}
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-colors border border-emerald-500/50"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">เพิ่มรายการ</span>
          </button>

          {/* User */}
          {currentUser && (
            <span className="text-white/50 text-xs font-thai hidden sm:inline px-2">
              {currentUser.email.split('@')[0]}
            </span>
          )}

          {/* Logout */}
          <button
            onClick={logout}
            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors border border-white/10"
            title="ออกจากระบบ"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
