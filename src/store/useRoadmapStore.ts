import { create } from 'zustand';
import type { RoadmapItem, FilterState, DepartmentConfig, OwnerConfig, FeedbackItem, ActiveSection, SortBy, SortDirection, AnalysisLog } from '../types';
import { supabase } from '../lib/supabase';
import { mapItemFromDb, mapItemToDb, mapDeptToDb, mapAnalysisLogFromDb, mapAnalysisLogToDb } from '../lib/mappers';

interface RoadmapStore {
  // Server state (synced with Supabase)
  items: RoadmapItem[];
  departments: DepartmentConfig[];
  owners: OwnerConfig[];
  feedbackItems: FeedbackItem[];

  // Auth state
  isAuthenticated: boolean;
  currentUser: { id: string; email: string } | null;

  // Loading/error
  isLoading: boolean;
  error: string | null;

  // Analysis logs
  analysisLogs: AnalysisLog[];
  analysisLogsLoaded: boolean;

  // Focus page
  focusedItemId: string | null;

  // Year selector
  selectedYear: number;

  // Client-only state
  filters: FilterState;
  viewMode: 'gantt' | 'list';
  activeSection: ActiveSection;
  editingItem: RoadmapItem | null;
  showForm: boolean;
  theme: 'dark' | 'light';
  newItemDefaults: { department?: string; startDate?: string; endDate?: string } | null;

  // Server actions (async)
  addItem: (item: Omit<RoadmapItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateItem: (id: string, updates: Partial<RoadmapItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  addDepartment: (dept: DepartmentConfig) => Promise<void>;
  updateDepartment: (key: string, updates: Partial<DepartmentConfig>) => Promise<void>;
  removeDepartment: (key: string) => Promise<void>;
  addOwner: (owner: OwnerConfig) => Promise<void>;
  updateOwner: (key: string, updates: Partial<OwnerConfig>) => Promise<void>;
  removeOwner: (key: string) => Promise<void>;
  addFeedback: (item: Omit<FeedbackItem, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateFeedbackStatus: (id: string, status: FeedbackItem['status']) => Promise<void>;

  // Analysis logs actions
  fetchAnalysisLogs: () => Promise<void>;
  addAnalysisLog: (log: Omit<AnalysisLog, 'id' | 'createdAt'>) => Promise<AnalysisLog | null>;

  // Focus page actions
  setFocusedItem: (id: string | null) => void;
  navigateToFocus: (itemId: string) => void;

  // Year selector actions
  setSelectedYear: (year: number) => void;
  getAvailableYears: () => number[];

  // Bulk setters (called by sync layer)
  setItems: (items: RoadmapItem[]) => void;
  setDepartments: (depts: DepartmentConfig[]) => void;
  setOwners: (owners: OwnerConfig[]) => void;
  setFeedbackItems: (items: FeedbackItem[]) => void;

  // Client-only actions
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  setViewMode: (mode: 'gantt' | 'list') => void;
  setActiveSection: (section: ActiveSection) => void;
  setEditingItem: (item: RoadmapItem | null) => void;
  setShowForm: (show: boolean) => void;
  setNewItemDefaults: (defaults: { department?: string; startDate?: string; endDate?: string } | null) => void;
  getFilteredItems: () => RoadmapItem[];
  setSortOptions: (sortBy: SortBy, sortDirection: SortDirection) => void;
  toggleTheme: () => void;

  // Auth/UI actions
  setAuthenticated: (v: boolean) => void;
  setCurrentUser: (user: { id: string; email: string } | null) => void;
  setLoading: (v: boolean) => void;
  setError: (msg: string | null) => void;
  clearError: () => void;
  logout: () => Promise<void>;
}

const defaultFilters: FilterState = {
  departments: [],
  priorities: [],
  statuses: [],
  owner: 'all',
  search: '',
  sortBy: 'startDate',
  sortDirection: 'asc',
};

export const useRoadmapStore = create<RoadmapStore>()((set, get) => ({
  // Initial state
  items: [],
  departments: [],
  owners: [],
  feedbackItems: [],
  analysisLogs: [],
  analysisLogsLoaded: false,
  focusedItemId: null,
  selectedYear: new Date().getFullYear(),
  isAuthenticated: false,
  currentUser: null,
  isLoading: true,
  error: null,
  filters: defaultFilters,
  viewMode: 'gantt',
  activeSection: 'overview',
  editingItem: null,
  showForm: false,
  theme: (localStorage.getItem('dryoungdo-roadmap-theme') as 'dark' | 'light') || 'dark',
  newItemDefaults: null,

  // Server actions
  addItem: async (item) => {
    try {
      const dbItem = mapItemToDb(item);
      const { data, error } = await supabase
        .from('roadmap_items')
        .insert(dbItem)
        .select()
        .single();
      if (error) throw error;
      const newItem = mapItemFromDb(data);
      set((state) => ({ items: [...state.items, newItem] }));
    } catch (err: any) {
      set({ error: `Failed to add item: ${err.message}` });
    }
  },

  updateItem: async (id, updates) => {
    try {
      const dbUpdates = mapItemToDb(updates);
      const { data, error } = await supabase
        .from('roadmap_items')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      const updatedItem = mapItemFromDb(data);
      set((state) => ({
        items: state.items.map((item) => item.id === id ? updatedItem : item)
      }));
    } catch (err: any) {
      set({ error: `Failed to update item: ${err.message}` });
    }
  },

  deleteItem: async (id) => {
    try {
      const { error } = await supabase
        .from('roadmap_items')
        .delete()
        .eq('id', id);
      if (error) throw error;
      set((state) => ({
        items: state.items.filter((item) => item.id !== id)
      }));
    } catch (err: any) {
      set({ error: `Failed to delete item: ${err.message}` });
    }
  },

  addDepartment: async (dept) => {
    try {
      const dbDept = mapDeptToDb(dept);
      const maxOrder = get().departments.length;
      const { error } = await supabase
        .from('departments')
        .insert({ ...dbDept, sort_order: maxOrder });
      if (error) throw error;
      set((state) => ({ departments: [...state.departments, dept] }));
    } catch (err: any) {
      set({ error: `Failed to add department: ${err.message}` });
    }
  },

  updateDepartment: async (key, updates) => {
    try {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.nameTh !== undefined) dbUpdates.name_th = updates.nameTh;
      if (updates.nameEn !== undefined) dbUpdates.name_en = updates.nameEn;
      if (updates.color !== undefined) dbUpdates.color = updates.color;
      if (updates.bgClass !== undefined) dbUpdates.bg_class = updates.bgClass;
      if (updates.textClass !== undefined) dbUpdates.text_class = updates.textClass;
      if (updates.borderClass !== undefined) dbUpdates.border_class = updates.borderClass;
      const { error } = await supabase
        .from('departments')
        .update(dbUpdates)
        .eq('key', key);
      if (error) throw error;
      set((state) => ({
        departments: state.departments.map((d) =>
          d.key === key ? { ...d, ...updates } : d
        )
      }));
    } catch (err: any) {
      set({ error: `Failed to update department: ${err.message}` });
    }
  },

  removeDepartment: async (key) => {
    try {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('key', key);
      if (error) throw error;
      set((state) => ({
        departments: state.departments.filter((d) => d.key !== key)
      }));
    } catch (err: any) {
      set({ error: `Failed to remove department: ${err.message}` });
    }
  },

  addOwner: async (owner) => {
    try {
      const maxOrder = get().owners.length;
      const { error } = await supabase
        .from('owners')
        .insert({ key: owner.key, label: owner.label, color: owner.color || null, sort_order: maxOrder });
      if (error) throw error;
      set((state) => ({ owners: [...state.owners, owner] }));
    } catch (err: any) {
      set({ error: `Failed to add owner: ${err.message}` });
    }
  },

  updateOwner: async (key, updates) => {
    try {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.label !== undefined) dbUpdates.label = updates.label;
      if (updates.color !== undefined) dbUpdates.color = updates.color;
      const { error } = await supabase
        .from('owners')
        .update(dbUpdates)
        .eq('key', key);
      if (error) throw error;
      set((state) => ({
        owners: state.owners.map((o) =>
          o.key === key ? { ...o, ...updates } : o
        )
      }));
    } catch (err: any) {
      set({ error: `Failed to update owner: ${err.message}` });
    }
  },

  removeOwner: async (key) => {
    try {
      const { error } = await supabase
        .from('owners')
        .delete()
        .eq('key', key);
      if (error) throw error;
      set((state) => ({
        owners: state.owners.filter((o) => o.key !== key)
      }));
    } catch (err: any) {
      set({ error: `Failed to remove owner: ${err.message}` });
    }
  },

  addFeedback: async (item) => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .insert(item)
        .select()
        .single();
      if (error) throw error;
      set((state) => ({ feedbackItems: [data, ...state.feedbackItems] }));
    } catch (err: any) {
      set({ error: `Failed to submit feedback: ${err.message}` });
    }
  },

  updateFeedbackStatus: async (id, status) => {
    try {
      const { error } = await supabase
        .from('feedback')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
      set((state) => ({
        feedbackItems: state.feedbackItems.map((f) =>
          f.id === id ? { ...f, status } : f
        )
      }));
    } catch (err: any) {
      set({ error: `Failed to update feedback: ${err.message}` });
    }
  },

  // Analysis logs actions
  fetchAnalysisLogs: async () => {
    if (get().analysisLogsLoaded) return;
    try {
      const { data, error } = await supabase
        .from('analysis_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) {
        // Silently degrade if table doesn't exist yet
        if (error.message?.includes('schema cache') || error.code === '42P01') {
          console.warn('analysis_logs table not found -- run SQL setup in Supabase dashboard');
          set({ analysisLogsLoaded: true });
          return;
        }
        throw error;
      }
      set({
        analysisLogs: (data ?? []).map(mapAnalysisLogFromDb),
        analysisLogsLoaded: true,
      });
    } catch (err: any) {
      set({ error: `Failed to load analysis logs: ${err.message}` });
    }
  },

  addAnalysisLog: async (log) => {
    try {
      const dbLog = mapAnalysisLogToDb(log as Record<string, unknown>);
      const { data, error } = await supabase
        .from('analysis_logs')
        .insert(dbLog)
        .select()
        .single();
      if (error) {
        // Silently degrade if table doesn't exist yet
        if (error.message?.includes('schema cache') || error.code === '42P01') {
          console.warn('analysis_logs table not found -- analysis not saved');
          return null;
        }
        throw error;
      }
      const newLog = mapAnalysisLogFromDb(data);
      set((state) => ({
        analysisLogs: [newLog, ...state.analysisLogs],
      }));
      return newLog;
    } catch (err: any) {
      set({ error: `Failed to save analysis: ${err.message}` });
      return null;
    }
  },

  // Focus page actions
  setFocusedItem: (id) => set({ focusedItemId: id }),
  navigateToFocus: (itemId) => set({ focusedItemId: itemId, activeSection: 'focus' }),

  // Year selector actions
  setSelectedYear: (year) => set({ selectedYear: year }),
  getAvailableYears: () => {
    const { items, selectedYear } = get();
    const years = new Set<number>();
    years.add(selectedYear); // Always include current selection
    years.add(new Date().getFullYear()); // Always include current year
    for (const item of items) {
      if (item.startDate) years.add(new Date(item.startDate).getFullYear());
      if (item.endDate) years.add(new Date(item.endDate).getFullYear());
    }
    return Array.from(years).sort((a, b) => b - a); // Newest first
  },

  // Bulk setters
  setItems: (items) => set({ items }),
  setDepartments: (departments) => set({ departments }),
  setOwners: (owners) => set({ owners }),
  setFeedbackItems: (feedbackItems) => set({ feedbackItems }),

  // Client-only actions
  setFilters: (filters) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }));
  },
  resetFilters: () => set({ filters: defaultFilters }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setActiveSection: (section) => set({ activeSection: section }),
  setEditingItem: (item) => set({ editingItem: item }),
  setShowForm: (show) => set({ showForm: show }),
  setNewItemDefaults: (defaults) => set({ newItemDefaults: defaults }),

  setSortOptions: (sortBy, sortDirection) => {
    set((state) => ({ filters: { ...state.filters, sortBy, sortDirection } }));
  },

  getFilteredItems: () => {
    const { items, filters } = get();
    return items.filter((item) => {
      // Year filter
      const itemStart = new Date(item.startDate).getFullYear();
      const itemEnd = new Date(item.endDate).getFullYear();
      const { selectedYear } = get();
      if (selectedYear < itemStart || selectedYear > itemEnd) return false;

      if (filters.departments.length > 0 && !filters.departments.includes(item.department)) return false;
      if (filters.priorities.length > 0 && !filters.priorities.includes(item.priority)) return false;
      if (filters.statuses.length > 0 && !filters.statuses.includes(item.status)) return false;
      if (filters.owner !== 'all' && item.owner !== filters.owner) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(searchLower);
        const matchesSubtitle = item.subtitle?.toLowerCase().includes(searchLower);
        const matchesNotes = item.notes?.toLowerCase().includes(searchLower);
        if (!matchesTitle && !matchesSubtitle && !matchesNotes) return false;
      }
      return true;
    });
  },

  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('dryoungdo-roadmap-theme', newTheme);
      return { theme: newTheme };
    });
  },

  // Auth/UI actions
  setAuthenticated: (v) => set({ isAuthenticated: v }),
  setCurrentUser: (user) => set({ currentUser: user }),
  setLoading: (v) => set({ isLoading: v }),
  setError: (msg) => set({ error: msg }),
  clearError: () => set({ error: null }),
  logout: async () => {
    await supabase.auth.signOut();
    set({ isAuthenticated: false, currentUser: null, items: [], feedbackItems: [], analysisLogs: [], analysisLogsLoaded: false, focusedItemId: null, selectedYear: new Date().getFullYear() });
  },
}));
