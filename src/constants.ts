import type { DepartmentConfig, Priority, ItemStatus, Owner, CompanyGoal } from './types';

export const DEPARTMENTS: DepartmentConfig[] = [];

export const PRIORITIES: { key: Priority; label: string; color: string; bgClass: string; textClass: string }[] = [
  { key: 'P0', label: 'P0 - วิกฤต', color: 'red', bgClass: 'bg-red-500', textClass: 'text-red-400' },
  { key: 'P1', label: 'P1 - สูง', color: 'orange', bgClass: 'bg-orange-500', textClass: 'text-orange-400' },
  { key: 'P2', label: 'P2 - กลาง', color: 'yellow', bgClass: 'bg-yellow-500', textClass: 'text-yellow-400' },
  { key: 'P3', label: 'P3 - ต่ำ', color: 'gray', bgClass: 'bg-gray-500', textClass: 'text-gray-400' }
];

export const STATUSES: { key: ItemStatus; label: string; labelTh?: string; color: string; bgClass: string; textClass: string }[] = [
  { key: 'planned', label: 'วางแผน', color: 'gray', bgClass: 'bg-gray-500', textClass: 'text-gray-400' },
  { key: 'in_progress', label: 'กำลังดำเนินการ', color: 'blue', bgClass: 'bg-blue-500', textClass: 'text-blue-400' },
  { key: 'on_track', label: 'ตามแผน', color: 'green', bgClass: 'bg-green-500', textClass: 'text-green-400' },
  { key: 'at_risk', label: 'เสี่ยงล่าช้า', color: 'yellow', bgClass: 'bg-yellow-500', textClass: 'text-yellow-400' },
  { key: 'blocked', label: 'ติดขัด', color: 'red', bgClass: 'bg-red-500', textClass: 'text-red-400' },
  { key: 'completed', label: 'เสร็จสิ้น', color: 'emerald', bgClass: 'bg-emerald-500', textClass: 'text-emerald-400' }
];

export const OWNERS: { key: Owner | 'all'; label: string; color?: string }[] = [
  { key: 'all', label: 'all' }
];

export const MONTHS_TH = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

// O(1) lookup Maps
export const DEPARTMENTS_MAP = new Map(DEPARTMENTS.map((d) => [d.key, d]));
export const STATUSES_MAP = new Map(STATUSES.map((s) => [s.key, s]));

// Company Overall Goals
export const COMPANY_GOALS: CompanyGoal[] = [];
