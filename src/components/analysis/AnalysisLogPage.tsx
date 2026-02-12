import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ScrollText,
  Sparkles,
  Map as MapIcon,
  Flag,
  BarChart3,
  Workflow,
  ShieldAlert,
  ChevronDown,
  Crosshair,
  Search,
  X,
  Building2,
} from 'lucide-react';
import { useRoadmapStore } from '../../store/useRoadmapStore';
import type { AnalysisType } from '../../types';
import { renderMarkdown } from '../../lib/render-markdown';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

interface TypeConfig {
  key: AnalysisType | 'all';
  label: string;
  icon: typeof Sparkles;
  color: string;       // badge text + bg
  chipActive: string;  // chip when selected
}

const TYPE_CONFIGS: TypeConfig[] = [
  { key: 'all',       label: 'ทั้งหมด',    icon: ScrollText,  color: '',                                        chipActive: 'bg-white/20 text-white border-white/40' },
  { key: 'strategic', label: 'Strategic',   icon: Sparkles,    color: 'text-purple-400 bg-purple-500/20',        chipActive: 'bg-purple-500/20 text-purple-400 border-purple-500/50' },
  { key: 'roadmap',   label: 'Roadmap',     icon: MapIcon,     color: 'text-cyan-400 bg-cyan-500/20',            chipActive: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50' },
  { key: 'milestone', label: 'Milestone',   icon: Flag,        color: 'text-purple-400 bg-purple-500/20',        chipActive: 'bg-purple-500/20 text-purple-400 border-purple-500/50' },
  { key: 'kpi',       label: 'KPI',         icon: BarChart3,   color: 'text-emerald-400 bg-emerald-500/20',      chipActive: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' },
  { key: 'process',   label: 'Process',     icon: Workflow,    color: 'text-amber-400 bg-amber-500/20',          chipActive: 'bg-amber-500/20 text-amber-400 border-amber-500/50' },
  { key: 'critique',  label: 'Critique',    icon: ShieldAlert, color: 'text-red-400 bg-red-500/20',              chipActive: 'bg-red-500/20 text-red-400 border-red-500/50' },
];

function getTypeConfig(analysisType: AnalysisType) {
  return TYPE_CONFIGS.find((t) => t.key === analysisType) ?? TYPE_CONFIGS[1];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatThaiDate(iso: string): string {
  return new Date(iso).toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatThaiTimestamp(iso: string): string {
  return new Date(iso).toLocaleString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/[-*]\s+/g, '')
    .replace(/\n+/g, ' ')
    .trim();
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AnalysisLogPage() {
  const analysisLogs = useRoadmapStore((s) => s.analysisLogs);
  const fetchAnalysisLogs = useRoadmapStore((s) => s.fetchAnalysisLogs);
  const items = useRoadmapStore((s) => s.items);
  const navigateToFocus = useRoadmapStore((s) => s.navigateToFocus);

  const departments = useRoadmapStore((s) => s.departments);

  const [activeFilter, setActiveFilter] = useState<AnalysisType | 'all'>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalysisLogs();
  }, [fetchAnalysisLogs]);

  // Build item->department lookup
  const itemDeptMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of items) map.set(item.id, item.department);
    return map;
  }, [items]);

  // Filter + sort (newest first) + group by date
  const grouped = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();

    const filtered = analysisLogs.filter((l) => {
      if (activeFilter !== 'all' && l.analysisType !== activeFilter) return false;
      if (deptFilter !== 'all') {
        const dept = l.itemId ? itemDeptMap.get(l.itemId) : null;
        if (dept !== deptFilter) return false;
      }
      if (searchLower) {
        const itemTitle = l.itemId ? (items.find((i) => i.id === l.itemId)?.title ?? '') : '';
        const haystack = `${l.promptSummary} ${l.resultMarkdown} ${itemTitle} ${l.userEmail}`.toLowerCase();
        if (!haystack.includes(searchLower)) return false;
      }
      return true;
    });

    const sorted = [...filtered].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const groups: { date: string; logs: typeof sorted }[] = [];
    let currentDate = '';

    for (const log of sorted) {
      const dateKey = formatThaiDate(log.createdAt);
      if (dateKey !== currentDate) {
        currentDate = dateKey;
        groups.push({ date: dateKey, logs: [] });
      }
      groups[groups.length - 1].logs.push(log);
    }

    return groups;
  }, [analysisLogs, activeFilter, deptFilter, searchQuery, itemDeptMap, items]);

  const totalCount = grouped.reduce((sum, g) => sum + g.logs.length, 0);

  function lookupItemTitle(itemId: string | null): string | null {
    if (!itemId) return null;
    const item = items.find((i) => i.id === itemId);
    return item?.title ?? null;
  }

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  /* ---- Render ---- */

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <ScrollText className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-bold font-display">AI Analysis Log</h2>
        </div>
        <p className="text-white/60 text-sm font-thai">
          บันทึกการวิเคราะห์ทั้งหมดจาก AI ({totalCount} รายการ)
        </p>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ค้นหาบันทึก... (ชื่อรายการ, เนื้อหา, prompt)"
          className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 font-thai focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.07] transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Department filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Building2 className="w-4 h-4 text-white/40 flex-shrink-0" />
        <button
          onClick={() => setDeptFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-thai transition-colors border ${
            deptFilter === 'all'
              ? 'bg-white/20 text-white border-white/40'
              : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
          }`}
        >
          ทุกแผนก
        </button>
        {departments.map((dept) => {
          const isActive = deptFilter === dept.key;
          return (
            <button
              key={dept.key}
              onClick={() => setDeptFilter(dept.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-thai transition-colors border ${
                isActive
                  ? `${dept.textClass} bg-white/15 border-current`
                  : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
              }`}
            >
              {dept.nameTh}
            </button>
          );
        })}
      </div>

      {/* Type filter chips */}
      <div className="flex flex-wrap gap-2">
        {TYPE_CONFIGS.map((cfg) => {
          const Icon = cfg.icon;
          const isActive = activeFilter === cfg.key;
          return (
            <button
              key={cfg.key}
              onClick={() => setActiveFilter(cfg.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-thai transition-colors border ${
                isActive
                  ? cfg.chipActive
                  : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Log feed */}
      {grouped.length === 0 ? (
        <div className="text-center py-16 text-white/40 font-thai">
          <ScrollText className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg">ยังไม่มีบันทึกการวิเคราะห์</p>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map((group) => (
            <div key={group.date}>
              {/* Date separator */}
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-white/40 font-thai whitespace-nowrap">
                  {group.date}
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              {/* Cards */}
              <div className="space-y-3">
                {group.logs.map((log, idx) => {
                  const typeCfg = getTypeConfig(log.analysisType);
                  const Icon = typeCfg.icon;
                  const itemTitle = lookupItemTitle(log.itemId);
                  const itemDept = log.itemId ? itemDeptMap.get(log.itemId) : null;
                  const deptCfg = itemDept ? departments.find((d) => d.key === itemDept) : null;
                  const isExpanded = expandedId === log.id;
                  const preview = stripMarkdown(log.resultMarkdown).slice(0, 150);

                  return (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
                    >
                      {/* Card header - clickable */}
                      <button
                        onClick={() => toggleExpand(log.id)}
                        className="w-full text-left p-4 hover:bg-white/5 transition-colors"
                      >
                        {/* Row 1: badge + item name + timestamp */}
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${typeCfg.color}`}>
                            <Icon className="w-3 h-3" />
                            {typeCfg.label}
                          </span>

                          {deptCfg && (
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${deptCfg.textClass} bg-white/5`}>
                              {deptCfg.nameTh}
                            </span>
                          )}

                          {itemTitle && log.itemId && (
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                navigateToFocus(log.itemId!);
                              }}
                              className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer transition-colors"
                            >
                              <Crosshair className="w-3 h-3" />
                              {itemTitle}
                            </span>
                          )}

                          <span className="ml-auto text-xs text-white/40 whitespace-nowrap">
                            {formatThaiTimestamp(log.createdAt)}
                          </span>
                        </div>

                        {/* Row 2: prompt summary */}
                        <p className="text-sm text-white/80 font-thai mb-1">
                          {log.promptSummary}
                        </p>

                        {/* Row 3: preview + expand indicator */}
                        <div className="flex items-end justify-between gap-2">
                          {!isExpanded && (
                            <p className="text-xs text-white/40 font-thai line-clamp-2 flex-1">
                              {preview}{preview.length >= 150 ? '...' : ''}
                            </p>
                          )}
                          <ChevronDown
                            className={`w-4 h-4 text-white/30 transition-transform flex-shrink-0 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </button>

                      {/* Expanded content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 pt-1 border-t border-white/5">
                              <div className="prose prose-invert prose-sm max-w-none font-thai">
                                {renderMarkdown(log.resultMarkdown)}
                              </div>
                              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/5 text-xs text-white/30">
                                <span>{log.userEmail.split('@')[0]}</span>
                                <span>Model: {log.modelUsed}</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
