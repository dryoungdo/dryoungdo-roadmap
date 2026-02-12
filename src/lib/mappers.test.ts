import { describe, it, expect } from 'vitest';
import {
  mapItemFromDb,
  mapItemToDb,
  mapDeptFromDb,
  mapDeptToDb,
  mapOwnerFromDb,
  mapOwnerToDb,
} from './mappers';

// DB interfaces (matching mappers.ts internal types)
interface DbRoadmapItem {
  id: string;
  title: string;
  subtitle: string | null;
  department: string;
  priority: string;
  status: string;
  owner: string;
  start_date: string;
  end_date: string;
  progress: number;
  parent_id: string | null;
  milestones: any[];
  dependencies: string[];
  links: any[] | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface DbDepartment {
  key: string;
  name_th: string;
  name_en: string;
  color: string;
  bg_class: string;
  text_class: string;
  border_class: string;
  sort_order: number;
  created_at: string;
}

interface DbOwner {
  key: string;
  label: string;
  color: string | null;
  sort_order: number;
  created_at: string;
}

describe('mapItemFromDb', () => {
  it('converts snake_case DB fields to camelCase TypeScript fields', () => {
    const dbItem: DbRoadmapItem = {
      id: '123',
      title: 'Test Item',
      subtitle: 'Test Subtitle',
      start_date: '2026-01-01',
      end_date: '2026-12-31',
      department: 'dept-1',
      priority: 'P1',
      status: 'in_progress',
      progress: 50,
      owner: 'owner-1',
      notes: 'Test notes',
      milestones: [{ id: 'm1', title: 'Milestone 1', date: '2026-06-01', completed: false }],
      dependencies: ['dep-1'],
      parent_id: 'parent-1',
      links: [{ id: 'l1', title: 'Link 1', url: 'https://example.com' }],
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-02T00:00:00Z',
    };

    const result = mapItemFromDb(dbItem);

    expect(result.id).toBe('123');
    expect(result.title).toBe('Test Item');
    expect(result.subtitle).toBe('Test Subtitle');
    expect(result.startDate).toBe('2026-01-01');
    expect(result.endDate).toBe('2026-12-31');
    expect(result.department).toBe('dept-1');
    expect(result.priority).toBe('P1');
    expect(result.status).toBe('in_progress');
    expect(result.progress).toBe(50);
    expect(result.owner).toBe('owner-1');
    expect(result.notes).toBe('Test notes');
    expect(result.milestones).toEqual([{ id: 'm1', title: 'Milestone 1', date: '2026-06-01', completed: false }]);
    expect(result.dependencies).toEqual(['dep-1']);
    expect(result.parentId).toBe('parent-1');
    expect(result.links).toEqual([{ id: 'l1', title: 'Link 1', url: 'https://example.com' }]);
    expect(result.createdAt).toBe('2026-01-01T00:00:00Z');
    expect(result.updatedAt).toBe('2026-01-02T00:00:00Z');
  });

  it('handles null subtitle as undefined', () => {
    const dbItem: DbRoadmapItem = {
      id: '123',
      title: 'Test',
      subtitle: null,
      start_date: '2026-01-01',
      end_date: '2026-12-31',
      department: 'dept-1',
      priority: 'P2',
      status: 'planned',
      progress: 0,
      owner: 'owner-1',
      notes: null,
      milestones: [],
      dependencies: [],
      parent_id: null,
      links: null,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    };

    const result = mapItemFromDb(dbItem);

    expect(result.subtitle).toBeUndefined();
  });

  it('handles null notes as undefined', () => {
    const dbItem: DbRoadmapItem = {
      id: '123',
      title: 'Test',
      subtitle: 'Sub',
      start_date: '2026-01-01',
      end_date: '2026-12-31',
      department: 'dept-1',
      priority: 'P3',
      status: 'completed',
      progress: 100,
      owner: 'owner-1',
      notes: null,
      milestones: [],
      dependencies: [],
      parent_id: null,
      links: null,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    };

    const result = mapItemFromDb(dbItem);

    expect(result.notes).toBeUndefined();
  });

  it('handles null parent_id as undefined', () => {
    const dbItem: DbRoadmapItem = {
      id: '123',
      title: 'Test',
      subtitle: 'Sub',
      start_date: '2026-01-01',
      end_date: '2026-12-31',
      department: 'dept-1',
      priority: 'P0',
      status: 'planned',
      progress: 0,
      owner: 'owner-1',
      notes: 'Notes',
      milestones: [],
      dependencies: [],
      parent_id: null,
      links: null,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    };

    const result = mapItemFromDb(dbItem);

    expect(result.parentId).toBeUndefined();
  });

  it('handles null links as undefined', () => {
    const dbItem: DbRoadmapItem = {
      id: '123',
      title: 'Test',
      subtitle: 'Sub',
      start_date: '2026-01-01',
      end_date: '2026-12-31',
      department: 'dept-1',
      priority: 'P2',
      status: 'in_progress',
      progress: 25,
      owner: 'owner-1',
      notes: 'Notes',
      milestones: [],
      dependencies: [],
      parent_id: 'parent-1',
      links: null,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    };

    const result = mapItemFromDb(dbItem);

    expect(result.links).toBeUndefined();
  });

  it('preserves arrays (milestones, dependencies)', () => {
    const dbItem: DbRoadmapItem = {
      id: '123',
      title: 'Test',
      subtitle: 'Sub',
      start_date: '2026-01-01',
      end_date: '2026-12-31',
      department: 'dept-1',
      priority: 'P1',
      status: 'planned',
      progress: 0,
      owner: 'owner-1',
      notes: 'Notes',
      milestones: [
        { id: 'm1', title: 'M1', date: '2026-03-01', completed: false },
        { id: 'm2', title: 'M2', date: '2026-06-01', completed: false },
        { id: 'm3', title: 'M3', date: '2026-09-01', completed: false }
      ],
      dependencies: ['d1', 'd2'],
      parent_id: null,
      links: null,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    };

    const result = mapItemFromDb(dbItem);

    expect(result.milestones).toHaveLength(3);
    expect(result.dependencies).toEqual(['d1', 'd2']);
  });
});

describe('mapItemToDb', () => {
  it('converts camelCase TypeScript fields to snake_case DB fields', () => {
    const item = {
      id: '123',
      title: 'Test Item',
      subtitle: 'Test Subtitle',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      department: 'dept-1',
      priority: 'P1' as const,
      status: 'in_progress' as const,
      progress: 50,
      owner: 'owner-1',
      notes: 'Test notes',
      milestones: [{ id: 'm1', title: 'M1', date: '2026-06-01', completed: false }],
      dependencies: ['dep-1'],
      parentId: 'parent-1',
      links: [{ id: 'l1', title: 'Link 1', url: 'https://example.com' }],
    };

    const result = mapItemToDb(item);

    expect(result.id).toBe('123');
    expect(result.title).toBe('Test Item');
    expect(result.subtitle).toBe('Test Subtitle');
    expect(result.start_date).toBe('2026-01-01');
    expect(result.end_date).toBe('2026-12-31');
    expect(result.department).toBe('dept-1');
    expect(result.priority).toBe('P1');
    expect(result.status).toBe('in_progress');
    expect(result.progress).toBe(50);
    expect(result.owner).toBe('owner-1');
    expect(result.notes).toBe('Test notes');
    expect(result.milestones).toEqual([{ id: 'm1', title: 'M1', date: '2026-06-01', completed: false }]);
    expect(result.dependencies).toEqual(['dep-1']);
    expect(result.parent_id).toBe('parent-1');
    expect(result.links).toEqual([{ id: 'l1', title: 'Link 1', url: 'https://example.com' }]);
  });

  it('only includes fields that are provided (partial updates)', () => {
    const item = {
      id: '123',
      title: 'Updated Title',
      progress: 75,
    };

    const result = mapItemToDb(item);

    expect(result.id).toBe('123');
    expect(result.title).toBe('Updated Title');
    expect(result.progress).toBe(75);
    expect(result.subtitle).toBeUndefined();
    expect(result.start_date).toBeUndefined();
    expect(result.end_date).toBeUndefined();
    expect(result.department).toBeUndefined();
    expect(result.owner).toBeUndefined();
    expect(result.notes).toBeUndefined();
  });

  it('converts empty string subtitle to null', () => {
    const item = {
      id: '123',
      title: 'Test',
      subtitle: '',
    };

    const result = mapItemToDb(item);

    expect(result.subtitle).toBeNull();
  });

  it('converts empty string notes to null', () => {
    const item = {
      id: '123',
      title: 'Test',
      notes: '',
    };

    const result = mapItemToDb(item);

    expect(result.notes).toBeNull();
  });

  it('preserves non-empty subtitle', () => {
    const item = {
      id: '123',
      title: 'Test',
      subtitle: 'Valid Subtitle',
    };

    const result = mapItemToDb(item);

    expect(result.subtitle).toBe('Valid Subtitle');
  });

  it('preserves non-empty notes', () => {
    const item = {
      id: '123',
      title: 'Test',
      notes: 'Valid Notes',
    };

    const result = mapItemToDb(item);

    expect(result.notes).toBe('Valid Notes');
  });
});

describe('mapDeptFromDb', () => {
  it('converts snake_case DB fields to camelCase TypeScript fields', () => {
    const dbDept: DbDepartment = {
      key: 'dept-1',
      name_th: 'แผนกทดสอบ',
      name_en: 'Test Department',
      color: 'emerald',
      bg_class: 'bg-emerald-500',
      text_class: 'text-emerald-400',
      border_class: 'border-emerald-500',
      sort_order: 1,
      created_at: '2026-01-01T00:00:00Z',
    };

    const result = mapDeptFromDb(dbDept);

    expect(result.key).toBe('dept-1');
    expect(result.nameTh).toBe('แผนกทดสอบ');
    expect(result.nameEn).toBe('Test Department');
    expect(result.color).toBe('emerald');
    expect(result.bgClass).toBe('bg-emerald-500');
    expect(result.textClass).toBe('text-emerald-400');
    expect(result.borderClass).toBe('border-emerald-500');
  });
});

describe('mapDeptToDb', () => {
  it('converts camelCase TypeScript fields to snake_case DB fields', () => {
    const dept = {
      key: 'dept-1',
      nameTh: 'แผนกทดสอบ',
      nameEn: 'Test Department',
      color: 'emerald',
      bgClass: 'bg-emerald-500',
      textClass: 'text-emerald-400',
      borderClass: 'border-emerald-500',
    };

    const result = mapDeptToDb(dept);

    expect(result.key).toBe('dept-1');
    expect(result.name_th).toBe('แผนกทดสอบ');
    expect(result.name_en).toBe('Test Department');
    expect(result.color).toBe('emerald');
    expect(result.bg_class).toBe('bg-emerald-500');
    expect(result.text_class).toBe('text-emerald-400');
    expect(result.border_class).toBe('border-emerald-500');
  });
});

describe('Department round-trip mapping', () => {
  it('preserves data through mapDeptFromDb -> mapDeptToDb', () => {
    const original: DbDepartment = {
      key: 'dept-1',
      name_th: 'แผนกทดสอบ',
      name_en: 'Test Department',
      color: 'green',
      bg_class: 'bg-green-500',
      text_class: 'text-green-400',
      border_class: 'border-green-500',
      sort_order: 1,
      created_at: '2026-01-01T00:00:00Z',
    };

    const tsFormat = mapDeptFromDb(original);
    const backToDb = mapDeptToDb(tsFormat);

    expect(backToDb.key).toBe(original.key);
    expect(backToDb.name_th).toBe(original.name_th);
    expect(backToDb.name_en).toBe(original.name_en);
    expect(backToDb.color).toBe(original.color);
    expect(backToDb.bg_class).toBe(original.bg_class);
    expect(backToDb.text_class).toBe(original.text_class);
    expect(backToDb.border_class).toBe(original.border_class);
  });
});

describe('mapOwnerFromDb', () => {
  it('converts snake_case DB fields to camelCase TypeScript fields', () => {
    const dbOwner: DbOwner = {
      key: 'owner-1',
      label: 'John Doe',
      color: '#3B82F6',
      sort_order: 1,
      created_at: '2026-01-01T00:00:00Z',
    };

    const result = mapOwnerFromDb(dbOwner);

    expect(result.key).toBe('owner-1');
    expect(result.label).toBe('John Doe');
    expect(result.color).toBe('#3B82F6');
  });

  it('handles null color as undefined', () => {
    const dbOwner: DbOwner = {
      key: 'owner-1',
      label: 'Jane Doe',
      color: null,
      sort_order: 1,
      created_at: '2026-01-01T00:00:00Z',
    };

    const result = mapOwnerFromDb(dbOwner);

    expect(result.key).toBe('owner-1');
    expect(result.label).toBe('Jane Doe');
    expect(result.color).toBeUndefined();
  });
});

describe('mapOwnerToDb', () => {
  it('converts camelCase TypeScript fields to snake_case DB fields', () => {
    const owner = {
      key: 'owner-1',
      label: 'John Doe',
      color: '#3B82F6',
    };

    const result = mapOwnerToDb(owner);

    expect(result.key).toBe('owner-1');
    expect(result.label).toBe('John Doe');
    expect(result.color).toBe('#3B82F6');
  });

  it('converts undefined color to null', () => {
    const owner = {
      key: 'owner-1',
      label: 'Jane Doe',
      color: undefined,
    };

    const result = mapOwnerToDb(owner);

    expect(result.key).toBe('owner-1');
    expect(result.label).toBe('Jane Doe');
    expect(result.color).toBeNull();
  });
});

describe('Owner round-trip mapping', () => {
  it('preserves data through mapOwnerFromDb -> mapOwnerToDb', () => {
    const original: DbOwner = {
      key: 'owner-1',
      label: 'Test Owner',
      color: '#10B981',
      sort_order: 1,
      created_at: '2026-01-01T00:00:00Z',
    };

    const tsFormat = mapOwnerFromDb(original);
    const backToDb = mapOwnerToDb(tsFormat);

    expect(backToDb.key).toBe(original.key);
    expect(backToDb.label).toBe(original.label);
    expect(backToDb.color).toBe(original.color);
  });

  it('preserves data when color is null/undefined', () => {
    const original: DbOwner = {
      key: 'owner-2',
      label: 'Test Owner 2',
      color: null,
      sort_order: 2,
      created_at: '2026-01-01T00:00:00Z',
    };

    const tsFormat = mapOwnerFromDb(original);
    const backToDb = mapOwnerToDb(tsFormat);

    expect(backToDb.key).toBe(original.key);
    expect(backToDb.label).toBe(original.label);
    expect(backToDb.color).toBeNull();
  });
});
