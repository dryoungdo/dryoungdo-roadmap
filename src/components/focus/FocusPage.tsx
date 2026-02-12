import { useState, useEffect, useMemo, type ReactNode } from 'react';
import {
  Crosshair,
  Map as MapIcon,
  Flag,
  BarChart3,
  Workflow,
  ShieldAlert,
  Loader2,
  AlertCircle,
  History,
  ChevronDown,
  Pencil,
  ExternalLink,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoadmapStore } from '../../store/useRoadmapStore';
import { analyzeItemWithGemini } from '../../lib/gemini';
import { STATUSES_MAP, DEPARTMENTS_MAP } from '../../constants';
import { formatDateRange } from '../../lib/date-utils';
import { renderMarkdown } from '../../lib/render-markdown';
import type { AnalysisType, RoadmapItem } from '../../types';

// ---------------------------------------------------------------------------
// Prompt category definitions
// ---------------------------------------------------------------------------

interface PromptCategory {
  key: AnalysisType;
  label: string;
  labelTh: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

const PROMPT_CATEGORIES: PromptCategory[] = [
  {
    key: 'roadmap',
    label: 'Roadmap',
    labelTh: '\u0E41\u0E1C\u0E19\u0E01\u0E25\u0E22\u0E38\u0E17\u0E18\u0E4C',
    description: '\u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C\u0E40\u0E0A\u0E34\u0E07\u0E01\u0E25\u0E22\u0E38\u0E17\u0E18\u0E4C\u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E2D\u0E14\u0E04\u0E25\u0E49\u0E2D\u0E07\u0E01\u0E31\u0E1A\u0E40\u0E1B\u0E49\u0E32\u0E2B\u0E21\u0E32\u0E22',
    icon: MapIcon,
    color: 'cyan',
  },
  {
    key: 'milestone',
    label: 'Milestone',
    labelTh: '\u0E40\u0E1B\u0E49\u0E32\u0E2B\u0E21\u0E32\u0E22\u0E22\u0E48\u0E2D\u0E22',
    description: '\u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C\u0E41\u0E25\u0E30\u0E41\u0E19\u0E30\u0E19\u0E33 Milestones',
    icon: Flag,
    color: 'purple',
  },
  {
    key: 'kpi',
    label: 'KPI',
    labelTh: '\u0E15\u0E31\u0E27\u0E0A\u0E35\u0E49\u0E27\u0E31\u0E14',
    description: '\u0E2D\u0E2D\u0E01\u0E41\u0E1A\u0E1A KPI \u0E41\u0E25\u0E30\u0E40\u0E01\u0E13\u0E11\u0E4C\u0E27\u0E31\u0E14\u0E1C\u0E25',
    icon: BarChart3,
    color: 'emerald',
  },
  {
    key: 'process',
    label: 'Process',
    labelTh: '\u0E01\u0E23\u0E30\u0E1A\u0E27\u0E19\u0E01\u0E32\u0E23',
    description: '\u0E2D\u0E2D\u0E01\u0E41\u0E1A\u0E1A Workflow \u0E41\u0E25\u0E30 SOP',
    icon: Workflow,
    color: 'amber',
  },
  {
    key: 'critique',
    label: 'Critique',
    labelTh: '\u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C\u0E04\u0E27\u0E32\u0E21\u0E40\u0E2A\u0E35\u0E48\u0E22\u0E07',
    description: '\u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C\u0E08\u0E38\u0E14\u0E2D\u0E48\u0E2D\u0E19\u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E40\u0E2A\u0E35\u0E48\u0E22\u0E07',
    icon: ShieldAlert,
    color: 'red',
  },
];

// ---------------------------------------------------------------------------
// Color utility
// ---------------------------------------------------------------------------

function priorityColor(priority: string): string {
  switch (priority) {
    case 'P0':
      return 'bg-red-500/20 text-red-400 border-red-500/40';
    case 'P1':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
    case 'P2':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
    case 'P3':
      return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
  }
}

function promptColorClasses(color: string) {
  const map: Record<string, { bg: string; border: string; hover: string; text: string }> = {
    cyan: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      hover: 'hover:bg-emerald-500/20',
      text: 'text-emerald-400',
    },
    purple: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      hover: 'hover:bg-amber-500/20',
      text: 'text-amber-400',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      hover: 'hover:bg-emerald-500/20',
      text: 'text-emerald-400',
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      hover: 'hover:bg-amber-500/20',
      text: 'text-amber-400',
    },
    red: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      hover: 'hover:bg-red-500/20',
      text: 'text-red-400',
    },
  };
  return map[color] ?? map.cyan;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function FocusPage() {
  // Store selectors
  const items = useRoadmapStore((state) => state.items);
  const departments = useRoadmapStore((state) => state.departments);
  const owners = useRoadmapStore((state) => state.owners);
  const focusedItemId = useRoadmapStore((state) => state.focusedItemId);
  const setFocusedItem = useRoadmapStore((state) => state.setFocusedItem);
  const currentUser = useRoadmapStore((state) => state.currentUser);
  const analysisLogs = useRoadmapStore((state) => state.analysisLogs);
  const fetchAnalysisLogs = useRoadmapStore((state) => state.fetchAnalysisLogs);
  const addAnalysisLog = useRoadmapStore((state) => state.addAnalysisLog);
  const setEditingItem = useRoadmapStore((state) => state.setEditingItem);
  const setShowForm = useRoadmapStore((state) => state.setShowForm);

  // Local state
  const [activePrompt, setActivePrompt] = useState<AnalysisType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showHistory, setShowHistory] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Derived
  const focusedItem = useMemo(
    () => items.find((i) => i.id === focusedItemId) ?? null,
    [items, focusedItemId],
  );

  const itemsByDepartment = useMemo(() => {
    const grouped = new Map<string, RoadmapItem[]>();
    for (const item of items) {
      const list = grouped.get(item.department) ?? [];
      list.push(item);
      grouped.set(item.department, list);
    }
    return grouped;
  }, [items]);

  const filteredItemsByDepartment = useMemo(() => {
    if (!searchQuery.trim()) return itemsByDepartment;
    const q = searchQuery.toLowerCase();
    const filtered = new Map<string, RoadmapItem[]>();
    for (const [dept, deptItems] of itemsByDepartment) {
      const matched = deptItems.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          (item.subtitle?.toLowerCase().includes(q) ?? false),
      );
      if (matched.length > 0) filtered.set(dept, matched);
    }
    return filtered;
  }, [itemsByDepartment, searchQuery]);

  const itemLogs = useMemo(
    () =>
      focusedItemId
        ? analysisLogs.filter((log) => log.itemId === focusedItemId)
        : [],
    [analysisLogs, focusedItemId],
  );

  // Effects
  useEffect(() => {
    fetchAnalysisLogs();
  }, [fetchAnalysisLogs]);

  useEffect(() => {
    setResult('');
    setError('');
    setActivePrompt(null);
  }, [focusedItemId]);

  // Handlers
  const handleSelectItem = (id: string) => {
    setFocusedItem(id);
    setShowSelector(false);
    setSearchQuery('');
  };

  const handleRunPrompt = async (category: PromptCategory) => {
    if (!focusedItem || isLoading) return;
    setActivePrompt(category.key);
    setIsLoading(true);
    setResult('');
    setError('');

    try {
      const response = await analyzeItemWithGemini({
        item: focusedItem,
        promptType: category.key,
        items,
        departments,
      });

      if (response.error) {
        setError(response.error);
      } else {
        setResult(response.analysis);
        // Auto-save to analysis log
        if (currentUser) {
          await addAnalysisLog({
            userId: currentUser.id,
            userEmail: currentUser.email,
            analysisType: category.key,
            itemId: focusedItem.id,
            promptSummary: `${category.labelTh}: ${focusedItem.title}`,
            resultMarkdown: response.analysis,
            modelUsed: 'gemini-2.0-flash',
          });
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditItem = () => {
    if (!focusedItem) return;
    setEditingItem(focusedItem);
    setShowForm(true);
  };

  const handleViewLog = (markdown: string) => {
    setResult(markdown);
    setError('');
    setActivePrompt(null);
  };

  // -------------------------------------------------------------------------
  // Render helpers
  // -------------------------------------------------------------------------

  const renderSelector = (): ReactNode => (
    <div className="relative">
      <button
        onClick={() => setShowSelector(!showSelector)}
        className="w-full flex items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-left transition-colors hover:bg-white/10"
      >
        {focusedItem ? (
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-white font-medium truncate">
              {focusedItem.title}
            </span>
            <span
              className={`shrink-0 text-xs px-2 py-0.5 rounded border ${priorityColor(focusedItem.priority)}`}
            >
              {focusedItem.priority}
            </span>
          </div>
        ) : (
          <span className="text-white/40 font-thai">
            {'\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C...'}
          </span>
        )}
        <ChevronDown
          className={`w-5 h-5 text-white/40 shrink-0 transition-transform ${showSelector ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {showSelector && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 w-full bg-gray-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Search */}
            <div className="p-3 border-b border-white/10">
              <input
                type="text"
                placeholder={'\u0E04\u0E49\u0E19\u0E2B\u0E32...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50"
                autoFocus
              />
            </div>

            {/* Grouped items */}
            <div className="max-h-72 overflow-y-auto">
              {filteredItemsByDepartment.size === 0 ? (
                <div className="p-4 text-center text-white/40 text-sm font-thai">
                  {'\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23'}
                </div>
              ) : (
                Array.from(filteredItemsByDepartment.entries()).map(
                  ([deptKey, deptItems]) => {
                    const dept = DEPARTMENTS_MAP.get(deptKey);
                    return (
                      <div key={deptKey}>
                        <div className="px-4 py-2 text-xs font-semibold text-white/50 uppercase tracking-wider bg-white/[0.03] font-thai">
                          {dept?.nameTh ?? deptKey}
                        </div>
                        {deptItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleSelectItem(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/10 ${
                              item.id === focusedItemId
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'text-white/80'
                            }`}
                          >
                            <span className="truncate flex-1">
                              {item.title}
                            </span>
                            <span
                              className={`shrink-0 text-xs px-1.5 py-0.5 rounded border ${priorityColor(item.priority)}`}
                            >
                              {item.priority}
                            </span>
                          </button>
                        ))}
                      </div>
                    );
                  },
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderItemDetail = (item: RoadmapItem): ReactNode => {
    const statusCfg = STATUSES_MAP.get(item.status);
    const deptCfg = DEPARTMENTS_MAP.get(item.department);
    const ownerCfg = owners.find((o) => o.key === item.owner);
    const completedMilestones = item.milestones.filter((m) => m.completed).length;

    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 relative">
        {/* Edit button */}
        <button
          onClick={handleEditItem}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors"
          title="Edit"
        >
          <Pencil className="w-4 h-4" />
        </button>

        {/* Title + Subtitle */}
        <h3 className="text-lg font-semibold text-white pr-12">{item.title}</h3>
        {item.subtitle && (
          <p className="text-sm text-white/60 mt-1">{item.subtitle}</p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span
            className={`text-xs px-2.5 py-1 rounded-full border ${priorityColor(item.priority)}`}
          >
            {item.priority}
          </span>
          {statusCfg && (
            <span
              className={`text-xs px-2.5 py-1 rounded-full ${statusCfg.bgClass}/20 ${statusCfg.textClass} border border-current/30`}
            >
              {statusCfg.label}
            </span>
          )}
          {ownerCfg && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {ownerCfg.label}
            </span>
          )}
        </div>

        {/* Date range */}
        <p className="text-sm text-white/50 mt-4">
          {formatDateRange(item.startDate, item.endDate)}
        </p>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-white/50 mb-1.5">
            <span className="font-thai">
              {'\u0E04\u0E27\u0E32\u0E21\u0E04\u0E37\u0E1A\u0E2B\u0E19\u0E49\u0E32'}
            </span>
            <span>{item.progress}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${deptCfg?.bgClass ?? 'bg-emerald-500'}`}
              style={{ width: `${item.progress}%` }}
            />
          </div>
        </div>

        {/* Milestones */}
        {item.milestones.length > 0 && (
          <div className="mt-5">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 font-thai">
              Milestones ({completedMilestones}/{item.milestones.length})
            </p>
            <ul className="space-y-1.5">
              {item.milestones.map((ms) => (
                <li
                  key={ms.id}
                  className="flex items-center gap-2 text-sm"
                >
                  {ms.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-white/30 shrink-0" />
                  )}
                  <span
                    className={
                      ms.completed
                        ? 'text-white/60 line-through'
                        : 'text-white/80'
                    }
                  >
                    {ms.title}
                  </span>
                  <span className="text-xs text-white/30 ml-auto shrink-0">
                    {ms.date}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Notes */}
        {item.notes && (
          <div className="mt-5">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
              Notes
            </p>
            <p className="text-sm text-white/70">{item.notes}</p>
          </div>
        )}

        {/* Links */}
        {item.links && item.links.length > 0 && (
          <div className="mt-5">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
              Links
            </p>
            <div className="flex flex-wrap gap-2">
              {item.links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:text-cyan-300 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {link.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPromptButtons = (): ReactNode => (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {PROMPT_CATEGORIES.map((cat, index) => {
        const colors = promptColorClasses(cat.color);
        const Icon = cat.icon;
        const isActive = activePrompt === cat.key && isLoading;

        return (
          <motion.button
            key={cat.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
            onClick={() => handleRunPrompt(cat)}
            disabled={isLoading}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors text-center ${colors.bg} ${colors.border} ${isLoading ? 'opacity-50 cursor-not-allowed' : colors.hover + ' cursor-pointer'}`}
          >
            {isActive ? (
              <Loader2 className={`w-5 h-5 ${colors.text} animate-spin`} />
            ) : (
              <Icon className={`w-5 h-5 ${colors.text}`} />
            )}
            <span className={`text-sm font-medium ${colors.text} font-thai`}>
              {cat.labelTh}
            </span>
            <span className="text-xs text-white/40 font-thai leading-tight">
              {cat.description}
            </span>
          </motion.button>
        );
      })}
    </div>
  );

  const renderResult = (): ReactNode => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center gap-3 py-12">
          <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
          <span className="text-white/60 font-thai">
            {'\u0E01\u0E33\u0E25\u0E31\u0E07\u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C...'}
          </span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      );
    }

    if (result) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-xl p-6"
        >
          {renderMarkdown(result)}
        </motion.div>
      );
    }

    return null;
  };

  const renderHistory = (): ReactNode => {
    if (itemLogs.length === 0) return null;

    const typeLabel = (type: AnalysisType): string => {
      const cat = PROMPT_CATEGORIES.find((c) => c.key === type);
      return cat?.labelTh ?? type;
    };

    const typeColor = (type: AnalysisType): string => {
      const cat = PROMPT_CATEGORIES.find((c) => c.key === type);
      if (!cat) return 'text-white/60';
      const colors = promptColorClasses(cat.color);
      return colors.text;
    };

    return (
      <div className="mt-6">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors"
        >
          <History className="w-4 h-4" />
          <span className="font-thai">
            {'\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23\u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C'} ({itemLogs.length})
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${showHistory ? 'rotate-180' : ''}`}
          />
        </button>

        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-2">
                {itemLogs.map((log) => {
                  const preview =
                    log.resultMarkdown.slice(0, 120).replace(/[#*\n]/g, ' ').trim() +
                    (log.resultMarkdown.length > 120 ? '...' : '');
                  const timestamp = new Date(log.createdAt).toLocaleString('th-TH', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <button
                      key={log.id}
                      onClick={() => handleViewLog(log.resultMarkdown)}
                      className="w-full text-left bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-lg p-3 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-medium ${typeColor(log.analysisType)} font-thai`}
                        >
                          {typeLabel(log.analysisType)}
                        </span>
                        <span className="text-xs text-white/30">
                          {timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-white/50 line-clamp-2">
                        {preview}
                      </p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // -------------------------------------------------------------------------
  // Main render
  // -------------------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Crosshair className="w-6 h-6 text-emerald-400" />
        <h2 className="text-xl font-semibold text-white">Focus View</h2>
      </div>

      {/* Item Selector */}
      {renderSelector()}

      {/* Content */}
      {focusedItem ? (
        <div className="space-y-6">
          {/* Item detail card */}
          {renderItemDetail(focusedItem)}

          {/* Prompt buttons */}
          {renderPromptButtons()}

          {/* Result area */}
          {renderResult()}

          {/* History */}
          {renderHistory()}
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Crosshair className="w-12 h-12 text-white/20 mb-4" />
          <p className="text-white/40 font-thai text-lg">
            {'\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E40\u0E1E\u0E37\u0E48\u0E2D Focus'}
          </p>
          <p className="text-white/25 text-sm mt-1 font-thai">
            {'\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E08\u0E32\u0E01\u0E14\u0E49\u0E32\u0E19\u0E1A\u0E19\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E23\u0E34\u0E48\u0E21\u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C'}
          </p>
        </div>
      )}
    </div>
  );
}
