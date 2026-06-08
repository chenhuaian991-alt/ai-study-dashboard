import type { AiLog } from '../../types';
import { loadFromStorage, saveToStorage } from '../../utils/storage';
import { STORAGE_KEYS } from '../../utils/storageKeys';
import { createId } from '../../utils/ids';

export function getAiLogs(): AiLog[] {
  return loadFromStorage<AiLog[]>(STORAGE_KEYS.AI_LOGS, []);
}

export function saveAiLogs(logs: AiLog[]): void {
  saveToStorage(STORAGE_KEYS.AI_LOGS, logs);
}

export function createAiLog(
  input: Omit<AiLog, 'id' | 'createdAt' | 'updatedAt'>
): AiLog {
  const now = new Date().toISOString();
  const log: AiLog = {
    ...input,
    id: createId('log'),
    createdAt: now,
    updatedAt: now,
  };
  const logs = getAiLogs();
  logs.push(log);
  saveAiLogs(logs);
  return log;
}

export function updateAiLog(
  id: string,
  patch: Partial<Omit<AiLog, 'id' | 'createdAt'>>
): AiLog | null {
  const logs = getAiLogs();
  const index = logs.findIndex((l) => l.id === id);
  if (index === -1) return null;
  logs[index] = {
    ...logs[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  saveAiLogs(logs);
  return logs[index];
}

export function deleteAiLog(id: string): boolean {
  const logs = getAiLogs();
  const index = logs.findIndex((l) => l.id === id);
  if (index === -1) return false;
  logs.splice(index, 1);
  saveAiLogs(logs);
  return true;
}
