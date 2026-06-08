export function createId(prefix?: string): string {
  let id: string;
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    id = crypto.randomUUID();
  } else {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
  return prefix ? `${prefix}_${id}` : id;
}
