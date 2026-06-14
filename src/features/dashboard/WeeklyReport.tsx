import { useState } from 'react';
import { getTasks } from '../tasks/taskStorage';
import { getAiLogs } from '../logs/logStorage';
import { getDailyReviews } from '../reviews/reviewStorage';
import { getAiReviewSummaries } from '../logs/reviewSummaryStorage';
import { getCurrentWeekRange, isDateInRange, formatDateRange } from '../../utils/week';
import type { Task, AiLog, DailyReview, AiReviewSummary } from '../../types';

const toolLabel: Record<string, string> = {
  claude: 'Claude',
  codex: 'Codex',
  other: '其他',
};

const statusLabel: Record<string, string> = {
  success: '成功',
  partial: '部分成功',
  failed: '失败',
};

export function WeeklyReport() {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

  const range = getCurrentWeekRange();
  const tasks = getTasks();
  const logs = getAiLogs();
  const reviews = getDailyReviews();
  const summaries = getAiReviewSummaries();

  const doneThisWeek = tasks.filter(
    (t) => t.status === 'done' && isDateInRange(t.updatedAt, range)
  );
  const newThisWeek = tasks.filter((t) => isDateInRange(t.createdAt, range));
  const logsThisWeek = logs.filter((l) => isDateInRange(l.createdAt, range));
  const reviewsThisWeek = reviews.filter(
    (r) => isDateInRange(r.date || r.createdAt, range)
  );
  const summariesThisWeek = summaries.filter((s) => isDateInRange(s.createdAt, range));

  const markdown = buildMarkdown(range, doneThisWeek, newThisWeek, logsThisWeek, reviewsThisWeek, summariesThisWeek);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch {
      setCopyStatus('failed');
      setTimeout(() => setCopyStatus('idle'), 3000);
    }
  }

  const isEmpty =
    doneThisWeek.length === 0 &&
    newThisWeek.length === 0 &&
    logsThisWeek.length === 0 &&
    reviewsThisWeek.length === 0 &&
    summariesThisWeek.length === 0;

  return (
    <div className="weekly-report">
      <div className="weekly-report-header">
        <h3>本周回顾</h3>
        <span className="weekly-report-range">{formatDateRange(range)}</span>
      </div>

      <div className="weekly-report-stats">
        <StatCard label="完成任务" value={doneThisWeek.length} />
        <StatCard label="新增任务" value={newThisWeek.length} />
        <StatCard label="AI 日志" value={logsThisWeek.length} />
        <StatCard label="每日复盘" value={reviewsThisWeek.length} />
        <StatCard label="复盘摘要" value={summariesThisWeek.length} />
      </div>

      {isEmpty ? (
        <p className="weekly-report-empty">本周暂无记录</p>
      ) : (
        <>
          {doneThisWeek.length > 0 && (
            <div className="weekly-report-section">
              <h4>本周完成任务</h4>
              <ul className="weekly-report-task-list">
                {doneThisWeek.map((t) => (
                  <li key={t.id}>
                    <span className="weekly-report-task-title">{t.title}</span>
                    {t.course && <span className="weekly-report-task-course">{t.course}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {logsThisWeek.length > 0 && (
            <div className="weekly-report-section">
              <h4>本周 AI 协作记录</h4>
              <ul className="weekly-report-log-list">
                {logsThisWeek.map((l) => (
                  <li key={l.id}>
                    <span className="weekly-report-log-title">{l.title}</span>
                    <span className="weekly-report-log-meta">
                      {toolLabel[l.tool] || l.tool} · {statusLabel[l.status] || l.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="weekly-report-section">
            <h4>周报草稿</h4>
            <textarea
              className="weekly-report-markdown"
              value={markdown}
              readOnly
              rows={12}
            />
            <button
              type="button"
              className="weekly-report-copy-btn"
              onClick={handleCopy}
            >
              {copyStatus === 'copied' ? '已复制' : copyStatus === 'failed' ? '复制失败，请手动选择' : '复制周报草稿'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="weekly-stat-card">
      <span className="weekly-stat-value">{value}</span>
      <span className="weekly-stat-label">{label}</span>
    </div>
  );
}

function buildMarkdown(
  range: { start: string; end: string },
  done: Task[],
  created: Task[],
  logs: AiLog[],
  reviews: DailyReview[],
  summaries: AiReviewSummary[]
): string {
  const lines: string[] = [];
  lines.push(`# 周报 ${range.start} – ${range.end}`);
  lines.push('');

  lines.push('## 本周统计');
  lines.push(`- 完成任务：${done.length}`);
  lines.push(`- 新增任务：${created.length}`);
  lines.push(`- AI 编程日志：${logs.length}`);
  lines.push(`- 每日复盘：${reviews.length}`);
  lines.push(`- AI 复盘摘要：${summaries.length}`);
  lines.push('');

  if (done.length > 0) {
    lines.push('## 本周完成任务');
    done.forEach((t) => lines.push(`- ${t.title}（${t.course || '无课程'}）`));
    lines.push('');
  }

  if (created.length > 0) {
    lines.push('## 本周新增任务');
    created.forEach((t) => lines.push(`- ${t.title}（${t.course || '无课程'}）`));
    lines.push('');
  }

  if (logs.length > 0) {
    lines.push('## 本周 AI 协作记录');
    logs.forEach((l) =>
      lines.push(`- ${l.title} | ${toolLabel[l.tool] || l.tool} | ${statusLabel[l.status] || l.status}`)
    );
    lines.push('');
  }

  if (reviews.length > 0) {
    lines.push('## 本周每日复盘');
    reviews.forEach((r) => {
      lines.push(`### ${r.date}`);
      if (r.completed) lines.push(`完成：${r.completed}`);
      if (r.postponed) lines.push(`延期：${r.postponed}`);
      if (r.tomorrowPlan) lines.push(`明日计划：${r.tomorrowPlan}`);
      if (r.note) lines.push(`备注：${r.note}`);
      lines.push('');
    });
  }

  if (summaries.length > 0) {
    lines.push('## 本周复盘摘要');
    summaries.forEach((s) => {
      lines.push(`### ${s.title}`);
      lines.push(s.summary);
      if (s.actionItems) {
        lines.push('');
        lines.push('**行动项：**');
        lines.push(s.actionItems);
      }
      lines.push('');
    });
  }

  return lines.join('\n');
}
