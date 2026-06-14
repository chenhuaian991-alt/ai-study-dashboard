export interface WeekRange {
  start: string; // YYYY-MM-DD (Monday)
  end: string;   // YYYY-MM-DD (Sunday)
}

/** Returns the Monday–Sunday range for the current week. */
export function getCurrentWeekRange(): WeekRange {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon … 6=Sat
  const diffToMon = day === 0 ? -6 : 1 - day;

  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMon);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return { start: toDateStr(monday), end: toDateStr(sunday) };
}

/** Checks whether a date string (YYYY-MM-DD or ISO datetime) falls within range (inclusive). */
export function isDateInRange(dateText: string, range: WeekRange): boolean {
  if (!dateText) return false;
  const d = toDateStrFromDate(new Date(dateText));
  if (!d) return false;
  return d >= range.start && d <= range.end;
}

/** Formats a range as "MM/DD – MM/DD" for display. */
export function formatDateRange(range: WeekRange): string {
  return `${range.start.slice(5)} – ${range.end.slice(5)}`;
}

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function toDateStrFromDate(d: Date): string | null {
  if (isNaN(d.getTime())) return null;
  return toDateStr(d);
}
