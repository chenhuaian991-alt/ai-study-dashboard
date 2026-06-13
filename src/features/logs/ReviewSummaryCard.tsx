import type { AiReviewSummary, AiLog } from '../../types';

interface ReviewSummaryCardProps {
  summary: AiReviewSummary;
  logs: AiLog[];
  onDelete: (id: string, title: string) => void;
}

function SourceLogList({ summary, logs }: { summary: AiReviewSummary; logs: AiLog[] }) {
  const sourceLogIds = summary.sourceLogIds ?? [];
  if (sourceLogIds.length === 0) return null;

  const logMap = new Map(logs.map((l) => [l.id, l]));
  const titles = sourceLogIds
    .map((id) => logMap.get(id)?.title)
    .filter(Boolean) as string[];
  const missingCount = sourceLogIds.length - titles.length;

  return (
    <div className="review-summary-source-logs">
      <strong>来源日志</strong>
      {titles.length > 0 ? (
        <ul>
          {titles.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      ) : (
        <p className="review-summary-source-missing">来源日志已被删除</p>
      )}
      {missingCount > 0 && titles.length > 0 && (
        <p className="review-summary-source-missing">
          其中 {missingCount} 条来源日志已被删除
        </p>
      )}
    </div>
  );
}

export function ReviewSummaryCard({ summary, logs, onDelete }: ReviewSummaryCardProps) {
  return (
    <article className="review-summary-card">
      <div className="review-summary-card-header">
        <h4>{summary.title}</h4>
        <span>{new Date(summary.createdAt).toLocaleString()}</span>
      </div>
      <p className="review-summary-meta">基于 {summary.sourceLogCount} 条日志</p>
      <SourceLogList summary={summary} logs={logs} />
      <div>
        <strong>AI 总结</strong>
        <pre className="review-summary-text">{summary.summary}</pre>
      </div>
      {summary.actionItems && (
        <div>
          <strong>下次行动</strong>
          <pre className="review-summary-text">{summary.actionItems}</pre>
        </div>
      )}
      <button type="button" className="review-summary-delete" onClick={() => onDelete(summary.id, summary.title)}>
        删除
      </button>
    </article>
  );
}
