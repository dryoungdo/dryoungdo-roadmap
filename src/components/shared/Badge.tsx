import { Check } from 'lucide-react';
import { useRoadmapStore } from '../../store/useRoadmapStore';
import type { Priority, ItemStatus } from '../../types';

interface BadgeProps {
  variant: 'priority' | 'status' | 'owner' | 'department';
  value: string;
}

function Badge({ variant, value }: BadgeProps) {
  const departments = useRoadmapStore((state) => state.departments);
  const owners = useRoadmapStore((state) => state.owners);

  if (variant === 'priority') {
    const colorMap: Record<Priority, string> = {
      P0: 'bg-red-500/20 text-red-400 border-red-500/50',
      P1: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
      P2: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      P3: 'bg-slate-500/20 text-slate-400 border-slate-500/50',
    };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colorMap[value as Priority]}`}>
        {value}
      </span>
    );
  }

  if (variant === 'status') {
    const statusMap: Record<ItemStatus, { color: string; label: string; showCheck?: boolean }> = {
      planned: { color: 'bg-slate-500/20 text-slate-400 border-slate-500/50', label: 'วางแผน' },
      in_progress: { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50', label: 'กำลังดำเนินการ' },
      on_track: { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50', label: 'ตามแผน' },
      at_risk: { color: 'bg-amber-500/20 text-amber-400 border-amber-500/50', label: 'เสี่ยงล่าช้า' },
      blocked: { color: 'bg-red-500/20 text-red-400 border-red-500/50', label: 'ติดขัด' },
      completed: { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50', label: 'เสร็จสิ้น', showCheck: true },
    };

    const status = statusMap[value as ItemStatus];

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${status.color}`}>
        {status.showCheck && <Check className="w-3 h-3" />}
        {status.label}
      </span>
    );
  }

  if (variant === 'owner') {
    const owner = owners.find((o) => o.key === value);
    if (!owner) return null;

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-amber-500/20 text-amber-400 border-amber-500/50`}>
        {owner.label}
      </span>
    );
  }

  if (variant === 'department') {
    const dept = departments.find((d) => d.key === value);
    if (!dept) return null;

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${dept.textClass} ${dept.borderClass} bg-opacity-20`}>
        {dept.nameTh}
      </span>
    );
  }

  return null;
}

export default Badge;
