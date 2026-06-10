export function todayStr(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function isValidDateStr(dateStr: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
}

export function isToday(dateStr: string): boolean {
  if (!isValidDateStr(dateStr)) return false;
  return dateStr === todayStr();
}

export function isBeforeToday(dateStr: string): boolean {
  if (!isValidDateStr(dateStr)) return false;
  return dateStr < todayStr();
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '无日期';
  if (isValidDateStr(dateStr)) return dateStr;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '无日期';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
