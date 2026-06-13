import type { AiReviewSummary } from '../../types';
import { createId } from '../../utils/ids';
import { loadFromStorage, saveToStorage } from '../../utils/storage';
import { STORAGE_KEYS } from '../../utils/storageKeys';

type CreateAiReviewSummaryInput = Omit<
  AiReviewSummary,
  'id' | 'createdAt' | 'updatedAt'
>;

export function normalizeAiReviewSummary(raw: AiReviewSummary): AiReviewSummary {
  return {
    ...raw,
    sourceLogIds: raw.sourceLogIds ?? [],
  };
}

export function getAiReviewSummaries(): AiReviewSummary[] {
  return loadFromStorage<AiReviewSummary[]>(STORAGE_KEYS.AI_REVIEW_SUMMARIES, []).map(normalizeAiReviewSummary);
}

export function saveAiReviewSummaries(summaries: AiReviewSummary[]): void {
  saveToStorage(STORAGE_KEYS.AI_REVIEW_SUMMARIES, summaries);
}

export function createAiReviewSummary(input: CreateAiReviewSummaryInput): AiReviewSummary {
  const now = new Date().toISOString();
  const summary: AiReviewSummary = {
    ...input,
    id: createId('review-summary'),
    createdAt: now,
    updatedAt: now,
  };

  const summaries = getAiReviewSummaries();
  saveAiReviewSummaries([summary, ...summaries]);
  return summary;
}

export function deleteAiReviewSummary(id: string): boolean {
  const summaries = getAiReviewSummaries();
  const nextSummaries = summaries.filter((summary) => summary.id !== id);
  if (nextSummaries.length === summaries.length) return false;
  saveAiReviewSummaries(nextSummaries);
  return true;
}
