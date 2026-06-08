import type { DailyReview } from '../../types';
import { loadFromStorage, saveToStorage } from '../../utils/storage';
import { STORAGE_KEYS } from '../../utils/storageKeys';
import { createId } from '../../utils/ids';

export function getDailyReviews(): DailyReview[] {
  return loadFromStorage<DailyReview[]>(STORAGE_KEYS.DAILY_REVIEWS, []);
}

export function saveDailyReviews(reviews: DailyReview[]): void {
  saveToStorage(STORAGE_KEYS.DAILY_REVIEWS, reviews);
}

export function createDailyReview(
  input: Omit<DailyReview, 'id' | 'createdAt' | 'updatedAt'>
): DailyReview {
  const now = new Date().toISOString();
  const review: DailyReview = {
    ...input,
    id: createId('review'),
    createdAt: now,
    updatedAt: now,
  };
  const reviews = getDailyReviews();
  reviews.push(review);
  saveDailyReviews(reviews);
  return review;
}

export function updateDailyReview(
  id: string,
  patch: Partial<Omit<DailyReview, 'id' | 'createdAt'>>
): DailyReview | null {
  const reviews = getDailyReviews();
  const index = reviews.findIndex((r) => r.id === id);
  if (index === -1) return null;
  reviews[index] = {
    ...reviews[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  saveDailyReviews(reviews);
  return reviews[index];
}

export function deleteDailyReview(id: string): boolean {
  const reviews = getDailyReviews();
  const index = reviews.findIndex((r) => r.id === id);
  if (index === -1) return false;
  reviews.splice(index, 1);
  saveDailyReviews(reviews);
  return true;
}
