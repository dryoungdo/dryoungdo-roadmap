export type Department = string;
export type Priority = 'P0' | 'P1' | 'P2' | 'P3';
export type ItemStatus = 'planned' | 'in_progress' | 'on_track' | 'at_risk' | 'blocked' | 'completed';
export type Owner = string;

export interface Milestone {
  id: string;
  title: string;
  date: string;
  completed: boolean;
}

export interface ItemLink {
  id: string;
  title: string;
  url: string;
}

export interface RoadmapItem {
  id: string;
  title: string;
  subtitle?: string;
  department: Department;
  priority: Priority;
  status: ItemStatus;
  owner: Owner;
  startDate: string;
  endDate: string;
  progress: number;
  parentId?: string;
  milestones: Milestone[];
  dependencies: string[];
  links?: ItemLink[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentConfig {
  key: Department;
  nameTh: string;
  nameEn: string;
  color: string;       // tailwind color name like 'cyan', 'purple', etc.
  bgClass: string;     // e.g. 'bg-cyan-500'
  textClass: string;   // e.g. 'text-cyan-400'
  borderClass: string; // e.g. 'border-cyan-500'
}

export interface OwnerConfig {
  key: string;
  label: string;
  color?: string;
}

export interface FilterState {
  departments: Department[];
  priorities: Priority[];
  statuses: ItemStatus[];
  owner: Owner | 'all';
  search: string;
  sortBy: SortBy;
  sortDirection: SortDirection;
}

export type FeedbackCategory = 'feature_request' | 'bug' | 'improvement' | 'question' | 'other';
export type FeedbackStatus = 'new' | 'acknowledged' | 'in_progress' | 'resolved' | 'wont_fix';

export interface FeedbackItem {
  id: string;
  user_id: string;
  user_email: string;
  category: FeedbackCategory;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: FeedbackStatus;
  created_at: string;
  updated_at: string;
}

export type ActiveSection = 'overview' | 'goals' | 'roadmap' | 'focus' | 'analysis' | 'definition' | 'settings' | 'feedback';

export type SortBy = 'startDate' | 'endDate' | 'priority' | 'createdAt' | 'updatedAt';
export type SortDirection = 'asc' | 'desc';

export type AnalysisType = 'strategic' | 'roadmap' | 'milestone' | 'kpi' | 'process' | 'critique';

export interface AnalysisLog {
  id: string;
  userId: string;
  userEmail: string;
  analysisType: AnalysisType;
  itemId: string | null;
  promptSummary: string;
  resultMarkdown: string;
  modelUsed: string;
  createdAt: string;
}

export interface CompanyGoal {
  id: string;
  title: string;
  titleEn: string;
  target: string;
  relatedMetric?: {
    name: string;
    target: string;
  };
  status: 'on_track' | 'at_risk' | 'not_started';
  relatedDepartments: string[];
  description: string;
  icon: string;
}
