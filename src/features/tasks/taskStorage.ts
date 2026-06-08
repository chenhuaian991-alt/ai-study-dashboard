import type { Task, TaskStatus } from '../../types';
import { loadFromStorage, saveToStorage } from '../../utils/storage';
import { STORAGE_KEYS } from '../../utils/storageKeys';
import { createId } from '../../utils/ids';

export function getTasks(): Task[] {
  return loadFromStorage<Task[]>(STORAGE_KEYS.TASKS, []);
}

export function saveTasks(tasks: Task[]): void {
  saveToStorage(STORAGE_KEYS.TASKS, tasks);
}

export function createTask(
  input: Omit<Task, 'id' | 'status' | 'createdAt' | 'updatedAt'>
): Task {
  const now = new Date().toISOString();
  const task: Task = {
    ...input,
    id: createId('task'),
    status: 'todo',
    createdAt: now,
    updatedAt: now,
  };
  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
  return task;
}

export function updateTask(
  id: string,
  patch: Partial<Omit<Task, 'id' | 'createdAt'>>
): Task | null {
  const tasks = getTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;
  tasks[index] = {
    ...tasks[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  saveTasks(tasks);
  return tasks[index];
}

export function deleteTask(id: string): boolean {
  const tasks = getTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  saveTasks(tasks);
  return true;
}

export function moveTask(id: string, status: TaskStatus): Task | null {
  return updateTask(id, { status });
}
