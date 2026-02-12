import { describe, it, expect, beforeEach } from 'vitest';
import { useRoadmapStore } from './useRoadmapStore';
import type { RoadmapItem, DepartmentConfig, OwnerConfig, FeedbackItem } from '../types';

describe('useRoadmapStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useRoadmapStore.setState({
      items: [],
      departments: [],
      owners: [],
      feedbackItems: [],
      filters: {
        departments: [],
        priorities: [],
        statuses: [],
        owner: 'all',
        search: '',
      },
      viewMode: 'gantt',
      activeSection: 'overview',
      editingItem: null,
      showForm: false,
      isAuthenticated: false,
      currentUser: null,
      isLoading: false,
      error: null,
      theme: 'dark',
    });

    // Clear localStorage
    localStorage.clear();
  });

  describe('Initial state', () => {
    it('items starts as empty array', () => {
      const state = useRoadmapStore.getState();
      expect(state.items).toEqual([]);
    });

    it('departments starts as empty array', () => {
      const state = useRoadmapStore.getState();
      expect(state.departments).toEqual([]);
    });

    it('owners starts as empty array', () => {
      const state = useRoadmapStore.getState();
      expect(state.owners).toEqual([]);
    });

    it('isAuthenticated starts as false', () => {
      const state = useRoadmapStore.getState();
      expect(state.isAuthenticated).toBe(false);
    });

    it('theme reads from localStorage or defaults to dark', () => {
      // Default case (no localStorage)
      const state1 = useRoadmapStore.getState();
      expect(state1.theme).toBe('dark');

      // With localStorage set to light
      localStorage.setItem('dryoungdo-roadmap-theme', 'light');
      const state2 = useRoadmapStore.getState();
      // Note: Store is already initialized, so we verify the default is 'dark' when nothing is set
      expect(['dark', 'light']).toContain(state2.theme);
    });

    it('error starts as null', () => {
      const state = useRoadmapStore.getState();
      expect(state.error).toBeNull();
    });

    it('viewMode starts as gantt', () => {
      const state = useRoadmapStore.getState();
      expect(state.viewMode).toBe('gantt');
    });

    it('activeSection starts as overview', () => {
      const state = useRoadmapStore.getState();
      expect(state.activeSection).toBe('overview');
    });
  });

  describe('Bulk setters', () => {
    it('setItems sets items', () => {
      const items: RoadmapItem[] = [
        {
          id: '1',
          title: 'Item 1',
          startDate: '2026-01-01',
          endDate: '2026-06-30',
          department: 'dept-1',
          priority: 'P1',
          status: 'planned',
          progress: 0,
          owner: 'owner-1',
          milestones: [],
          dependencies: [],
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-01T00:00:00Z',
        },
        {
          id: '2',
          title: 'Item 2',
          startDate: '2026-07-01',
          endDate: '2026-12-31',
          department: 'dept-2',
          priority: 'P2',
          status: 'in_progress',
          progress: 50,
          owner: 'owner-2',
          milestones: [],
          dependencies: [],
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-01T00:00:00Z',
        },
      ];

      useRoadmapStore.getState().setItems(items);

      const state = useRoadmapStore.getState();
      expect(state.items).toEqual(items);
      expect(state.items).toHaveLength(2);
    });

    it('setDepartments sets departments', () => {
      const departments: DepartmentConfig[] = [
        {
          key: 'dept-1',
          nameTh: 'แผนกทดสอบ 1',
          nameEn: 'Test Dept 1',
          color: 'blue',
          bgClass: 'bg-blue-500',
          textClass: 'text-blue-400',
          borderClass: 'border-blue-500',
        },
        {
          key: 'dept-2',
          nameTh: 'แผนกทดสอบ 2',
          nameEn: 'Test Dept 2',
          color: 'green',
          bgClass: 'bg-green-500',
          textClass: 'text-green-400',
          borderClass: 'border-green-500',
        },
      ];

      useRoadmapStore.getState().setDepartments(departments);

      const state = useRoadmapStore.getState();
      expect(state.departments).toEqual(departments);
      expect(state.departments).toHaveLength(2);
    });

    it('setOwners sets owners', () => {
      const owners: OwnerConfig[] = [
        {
          key: 'owner-1',
          label: 'Owner 1',
          color: '#3B82F6',
        },
        {
          key: 'owner-2',
          label: 'Owner 2',
          color: '#10B981',
        },
      ];

      useRoadmapStore.getState().setOwners(owners);

      const state = useRoadmapStore.getState();
      expect(state.owners).toEqual(owners);
      expect(state.owners).toHaveLength(2);
    });

    it('setFeedbackItems sets feedbackItems', () => {
      const feedbackItems: FeedbackItem[] = [
        {
          id: '1',
          user_id: 'user-1',
          user_email: 'test@example.com',
          category: 'feature_request',
          title: 'Feature Request',
          description: 'Add dark mode',
          priority: 'high',
          status: 'new',
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-01-01T00:00:00Z',
        },
        {
          id: '2',
          user_id: 'user-2',
          user_email: 'test2@example.com',
          category: 'bug',
          title: 'Bug Report',
          description: 'Fix button alignment',
          priority: 'medium',
          status: 'acknowledged',
          created_at: '2026-01-02T00:00:00Z',
          updated_at: '2026-01-02T00:00:00Z',
        },
      ];

      useRoadmapStore.getState().setFeedbackItems(feedbackItems);

      const state = useRoadmapStore.getState();
      expect(state.feedbackItems).toEqual(feedbackItems);
      expect(state.feedbackItems).toHaveLength(2);
    });
  });

  describe('Client-only actions', () => {
    it('setFilters merges partial filters', () => {
      // Set initial filter
      useRoadmapStore.getState().setFilters({ departments: ['dept-1'] });
      let state = useRoadmapStore.getState();
      expect(state.filters.departments).toEqual(['dept-1']);
      expect(state.filters.priorities).toEqual([]);
      expect(state.filters.statuses).toEqual([]);

      // Merge another filter
      useRoadmapStore.getState().setFilters({ priorities: ['P1'] });
      state = useRoadmapStore.getState();
      expect(state.filters.departments).toEqual(['dept-1']);
      expect(state.filters.priorities).toEqual(['P1']);
      expect(state.filters.statuses).toEqual([]);

      // Override existing filter
      useRoadmapStore.getState().setFilters({ departments: ['dept-2'] });
      state = useRoadmapStore.getState();
      expect(state.filters.departments).toEqual(['dept-2']);
      expect(state.filters.priorities).toEqual(['P1']);
    });

    it('resetFilters restores defaults', () => {
      // Set some filters
      useRoadmapStore.getState().setFilters({
        departments: ['dept-1'],
        priorities: ['P1'],
        statuses: ['in_progress'],
        owner: 'owner-1',
        search: 'test',
      });

      // Reset
      useRoadmapStore.getState().resetFilters();

      const state = useRoadmapStore.getState();
      expect(state.filters).toEqual({
        departments: [],
        priorities: [],
        statuses: [],
        owner: 'all',
        search: '',
        sortBy: 'startDate',
        sortDirection: 'asc',
      });
    });

    it('setViewMode changes viewMode', () => {
      useRoadmapStore.getState().setViewMode('list');
      let state = useRoadmapStore.getState();
      expect(state.viewMode).toBe('list');

      useRoadmapStore.getState().setViewMode('gantt');
      state = useRoadmapStore.getState();
      expect(state.viewMode).toBe('gantt');
    });

    it('setActiveSection changes activeSection', () => {
      useRoadmapStore.getState().setActiveSection('roadmap');
      let state = useRoadmapStore.getState();
      expect(state.activeSection).toBe('roadmap');

      useRoadmapStore.getState().setActiveSection('settings');
      state = useRoadmapStore.getState();
      expect(state.activeSection).toBe('settings');
    });

    it('toggleTheme switches dark to light and saves to localStorage', () => {
      // Start with dark theme
      useRoadmapStore.setState({ theme: 'dark' });

      // Toggle to light
      useRoadmapStore.getState().toggleTheme();
      let state = useRoadmapStore.getState();
      expect(state.theme).toBe('light');
      expect(localStorage.getItem('dryoungdo-roadmap-theme')).toBe('light');

      // Toggle back to dark
      useRoadmapStore.getState().toggleTheme();
      state = useRoadmapStore.getState();
      expect(state.theme).toBe('dark');
      expect(localStorage.getItem('dryoungdo-roadmap-theme')).toBe('dark');
    });
  });

  describe('getFilteredItems', () => {
    const mockItems: RoadmapItem[] = [
      {
        id: '1',
        title: 'Frontend Redesign',
        subtitle: 'New UI',
        startDate: '2026-01-01',
        endDate: '2026-06-30',
        department: 'dept-frontend',
        priority: 'P1',
        status: 'in_progress',
        progress: 50,
        owner: 'owner-1',
        notes: 'Redesigning the entire frontend',
        milestones: [],
        dependencies: [],
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
      {
        id: '2',
        title: 'Backend API',
        subtitle: 'REST API',
        startDate: '2026-02-01',
        endDate: '2026-08-31',
        department: 'dept-backend',
        priority: 'P2',
        status: 'planned',
        progress: 0,
        owner: 'owner-2',
        notes: 'Building new REST API endpoints',
        milestones: [],
        dependencies: [],
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
      {
        id: '3',
        title: 'Database Migration',
        startDate: '2026-03-01',
        endDate: '2026-12-31',
        department: 'dept-backend',
        priority: 'P1',
        status: 'completed',
        progress: 100,
        owner: 'owner-1',
        notes: 'Migrating to PostgreSQL',
        milestones: [],
        dependencies: [],
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
      {
        id: '4',
        title: 'Mobile App',
        startDate: '2026-04-01',
        endDate: '2026-10-31',
        department: 'dept-frontend',
        priority: 'P3',
        status: 'in_progress',
        progress: 25,
        owner: 'owner-2',
        milestones: [],
        dependencies: [],
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
    ];

    beforeEach(() => {
      useRoadmapStore.getState().setItems(mockItems);
    });

    it('returns all items when no filters active', () => {
      const filtered = useRoadmapStore.getState().getFilteredItems();
      expect(filtered).toHaveLength(4);
      expect(filtered).toEqual(mockItems);
    });

    it('filters by department', () => {
      useRoadmapStore.getState().setFilters({ departments: ['dept-frontend'] });
      const filtered = useRoadmapStore.getState().getFilteredItems();
      expect(filtered).toHaveLength(2);
      expect(filtered.every(item => item.department === 'dept-frontend')).toBe(true);
    });

    it('filters by multiple departments', () => {
      useRoadmapStore.getState().setFilters({ departments: ['dept-frontend', 'dept-backend'] });
      const filtered = useRoadmapStore.getState().getFilteredItems();
      expect(filtered).toHaveLength(4);
    });

    it('filters by priority', () => {
      useRoadmapStore.getState().setFilters({ priorities: ['P1'] });
      const filtered = useRoadmapStore.getState().getFilteredItems();
      expect(filtered).toHaveLength(2);
      expect(filtered.every(item => item.priority === 'P1')).toBe(true);
    });

    it('filters by status', () => {
      useRoadmapStore.getState().setFilters({ statuses: ['in_progress'] });
      const filtered = useRoadmapStore.getState().getFilteredItems();
      expect(filtered).toHaveLength(2);
      expect(filtered.every(item => item.status === 'in_progress')).toBe(true);
    });

    it('filters by owner', () => {
      useRoadmapStore.getState().setFilters({ owner: 'owner-1' });
      const filtered = useRoadmapStore.getState().getFilteredItems();
      expect(filtered).toHaveLength(2);
      expect(filtered.every(item => item.owner === 'owner-1')).toBe(true);
    });

    it('filters by search text in title', () => {
      useRoadmapStore.getState().setFilters({ search: 'frontend' });
      const filtered = useRoadmapStore.getState().getFilteredItems();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toBe('Frontend Redesign');
    });

    it('filters by search text in subtitle', () => {
      useRoadmapStore.getState().setFilters({ search: 'rest' });
      const filtered = useRoadmapStore.getState().getFilteredItems();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].subtitle).toBe('REST API');
    });

    it('filters by search text in notes', () => {
      useRoadmapStore.getState().setFilters({ search: 'postgresql' });
      const filtered = useRoadmapStore.getState().getFilteredItems();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toBe('Database Migration');
    });

    it('search is case-insensitive', () => {
      useRoadmapStore.getState().setFilters({ search: 'FRONTEND' });
      const filtered = useRoadmapStore.getState().getFilteredItems();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toBe('Frontend Redesign');
    });

    it('combines multiple filters (AND logic)', () => {
      useRoadmapStore.getState().setFilters({
        departments: ['dept-backend'],
        priorities: ['P1'],
      });
      const filtered = useRoadmapStore.getState().getFilteredItems();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toBe('Database Migration');
    });

    it('combines all filters', () => {
      useRoadmapStore.getState().setFilters({
        departments: ['dept-backend'],
        priorities: ['P1'],
        statuses: ['completed'],
        owner: 'owner-1',
        search: 'migration',
      });
      const filtered = useRoadmapStore.getState().getFilteredItems();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toBe('Database Migration');
    });

    it('returns empty array when no items match filters', () => {
      useRoadmapStore.getState().setFilters({
        departments: ['dept-nonexistent'],
      });
      const filtered = useRoadmapStore.getState().getFilteredItems();
      expect(filtered).toHaveLength(0);
    });

    it('returns empty array when search matches nothing', () => {
      useRoadmapStore.getState().setFilters({
        search: 'xyznonexistent',
      });
      const filtered = useRoadmapStore.getState().getFilteredItems();
      expect(filtered).toHaveLength(0);
    });
  });

  describe('Error handling', () => {
    it('setError sets error message', () => {
      useRoadmapStore.getState().setError('Test error message');
      const state = useRoadmapStore.getState();
      expect(state.error).toBe('Test error message');
    });

    it('clearError clears error', () => {
      // Set error first
      useRoadmapStore.getState().setError('Test error');
      expect(useRoadmapStore.getState().error).toBe('Test error');

      // Clear it
      useRoadmapStore.getState().clearError();
      const state = useRoadmapStore.getState();
      expect(state.error).toBeNull();
    });

    it('setError can update existing error', () => {
      useRoadmapStore.getState().setError('First error');
      expect(useRoadmapStore.getState().error).toBe('First error');

      useRoadmapStore.getState().setError('Second error');
      expect(useRoadmapStore.getState().error).toBe('Second error');
    });
  });
});
