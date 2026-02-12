import type { RoadmapItem, DepartmentConfig, OwnerConfig, AnalysisLog, AnalysisType } from '../types';

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

export function mapItemFromDb(row: DbRoadmapItem): RoadmapItem {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle ?? undefined,
    department: row.department,
    priority: row.priority as RoadmapItem['priority'],
    status: row.status as RoadmapItem['status'],
    owner: row.owner,
    startDate: row.start_date,
    endDate: row.end_date,
    progress: row.progress,
    parentId: row.parent_id ?? undefined,
    milestones: row.milestones ?? [],
    dependencies: row.dependencies ?? [],
    links: row.links ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapItemToDb(item: Partial<RoadmapItem> & { id?: string }): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (item.id !== undefined) result.id = item.id;
  if (item.title !== undefined) result.title = item.title;
  if (item.subtitle !== undefined) result.subtitle = item.subtitle || null;
  if (item.department !== undefined) result.department = item.department;
  if (item.priority !== undefined) result.priority = item.priority;
  if (item.status !== undefined) result.status = item.status;
  if (item.owner !== undefined) result.owner = item.owner;
  if (item.startDate !== undefined) result.start_date = item.startDate;
  if (item.endDate !== undefined) result.end_date = item.endDate;
  if (item.progress !== undefined) result.progress = item.progress;
  if (item.parentId !== undefined) result.parent_id = item.parentId || null;
  if (item.milestones !== undefined) result.milestones = item.milestones;
  if (item.dependencies !== undefined) result.dependencies = item.dependencies;
  if (item.links !== undefined) result.links = item.links || null;
  if (item.notes !== undefined) result.notes = item.notes || null;
  return result;
}

export function mapDeptFromDb(row: DbDepartment): DepartmentConfig {
  return {
    key: row.key,
    nameTh: row.name_th,
    nameEn: row.name_en,
    color: row.color,
    bgClass: row.bg_class,
    textClass: row.text_class,
    borderClass: row.border_class,
  };
}

export function mapDeptToDb(dept: DepartmentConfig): Record<string, unknown> {
  return {
    key: dept.key,
    name_th: dept.nameTh,
    name_en: dept.nameEn,
    color: dept.color,
    bg_class: dept.bgClass,
    text_class: dept.textClass,
    border_class: dept.borderClass,
  };
}

export function mapOwnerFromDb(row: DbOwner): OwnerConfig {
  return {
    key: row.key,
    label: row.label,
    color: row.color ?? undefined,
  };
}

export function mapOwnerToDb(owner: OwnerConfig): Record<string, unknown> {
  return {
    key: owner.key,
    label: owner.label,
    color: owner.color || null,
  };
}

// Analysis Logs mappers

interface DbAnalysisLog {
  id: string;
  user_id: string;
  user_email: string;
  analysis_type: string;
  item_id: string | null;
  prompt_summary: string;
  result_markdown: string;
  model_used: string;
  created_at: string;
}

export function mapAnalysisLogFromDb(row: DbAnalysisLog): AnalysisLog {
  return {
    id: row.id,
    userId: row.user_id,
    userEmail: row.user_email,
    analysisType: row.analysis_type as AnalysisType,
    itemId: row.item_id,
    promptSummary: row.prompt_summary,
    resultMarkdown: row.result_markdown,
    modelUsed: row.model_used,
    createdAt: row.created_at,
  };
}

export function mapAnalysisLogToDb(log: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (log.userId !== undefined) result.user_id = log.userId;
  if (log.userEmail !== undefined) result.user_email = log.userEmail;
  if (log.analysisType !== undefined) result.analysis_type = log.analysisType;
  if (log.itemId !== undefined) result.item_id = log.itemId;
  if (log.promptSummary !== undefined) result.prompt_summary = log.promptSummary;
  if (log.resultMarkdown !== undefined) result.result_markdown = log.resultMarkdown;
  if (log.modelUsed !== undefined) result.model_used = log.modelUsed;
  return result;
}
