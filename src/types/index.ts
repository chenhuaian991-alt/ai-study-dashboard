export type TaskStatus = 'todo' | 'in-progress' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  course: string;
  deadline: string;
  priority: TaskPriority;
  estimatedHours: number;
  resourceLink: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export type AiLogTool = 'claude' | 'codex' | 'other';
export type AiLogStatus = 'success' | 'partial' | 'failed';

export interface AiLog {
  id: string;
  title: string;
  tool: AiLogTool;
  prompt: string;
  result: string;
  status: AiLogStatus;
  lesson?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AiReviewSummary {
  id: string;
  title: string;
  sourceLogCount: number;
  sourceLogIds: string[];
  summary: string;
  actionItems: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailyReview {
  id: string;
  date: string;
  completed: string;
  postponed: string;
  tomorrowPlan: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}
