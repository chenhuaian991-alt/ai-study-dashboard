import type { Task, AiLog, DailyReview, AiReviewSummary } from '../types';
import { STORAGE_KEYS } from './storageKeys';
import { loadFromStorage, saveToStorage } from './storage';
import { normalizeAiReviewSummary } from '../features/logs/reviewSummaryStorage';

interface BackupData {
  version: number;
  exportedAt: string;
  tasks: Task[];
  aiLogs: AiLog[];
  dailyReviews: DailyReview[];
  aiReviewSummaries: AiReviewSummary[];
}

export function exportBackup(): string {
  const data: BackupData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    tasks: loadFromStorage<Task[]>(STORAGE_KEYS.TASKS, []),
    aiLogs: loadFromStorage<AiLog[]>(STORAGE_KEYS.AI_LOGS, []),
    dailyReviews: loadFromStorage<DailyReview[]>(STORAGE_KEYS.DAILY_REVIEWS, []),
    aiReviewSummaries: loadFromStorage<AiReviewSummary[]>(STORAGE_KEYS.AI_REVIEW_SUMMARIES, []).map(normalizeAiReviewSummary),
  };
  return JSON.stringify(data, null, 2);
}

export function importBackup(jsonText: string): { ok: true } | { ok: false; message: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return { ok: false, message: 'JSON 解析失败，请检查文件格式' };
  }

  if (typeof parsed !== 'object' || parsed === null) {
    return { ok: false, message: '文件内容不是有效的 JSON 对象' };
  }

  const obj = parsed as Record<string, unknown>;

  if (!Array.isArray(obj.tasks)) {
    return { ok: false, message: '缺少 tasks 数组或格式不正确' };
  }
  if (!Array.isArray(obj.aiLogs)) {
    return { ok: false, message: '缺少 aiLogs 数组或格式不正确' };
  }
  if (!Array.isArray(obj.dailyReviews)) {
    return { ok: false, message: '缺少 dailyReviews 数组或格式不正确' };
  }

  saveToStorage(STORAGE_KEYS.TASKS, obj.tasks as Task[]);
  saveToStorage(STORAGE_KEYS.AI_LOGS, obj.aiLogs as AiLog[]);
  saveToStorage(STORAGE_KEYS.DAILY_REVIEWS, obj.dailyReviews as DailyReview[]);

  const aiReviewSummaries = Array.isArray(obj.aiReviewSummaries)
    ? (obj.aiReviewSummaries as AiReviewSummary[]).map(normalizeAiReviewSummary)
    : [];
  saveToStorage(STORAGE_KEYS.AI_REVIEW_SUMMARIES, aiReviewSummaries);

  return { ok: true };
}
