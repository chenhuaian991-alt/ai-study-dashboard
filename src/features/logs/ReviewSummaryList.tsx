import type { AiReviewSummary, AiLog } from '../../types';
import { ReviewSummaryCard } from './ReviewSummaryCard';

interface ReviewSummaryListProps {
  summaries: AiReviewSummary[];
  logs: AiLog[];
  onDelete: (id: string, title: string) => void;
}

export function ReviewSummaryList({ summaries, logs, onDelete }: ReviewSummaryListProps) {
  if (summaries.length === 0) {
    return <p className="review-summary-empty">还没有保存 AI 复盘摘要。</p>;
  }

  return (
    <div className="review-summary-list">
      {summaries.map((summary) => (
        <ReviewSummaryCard key={summary.id} summary={summary} logs={logs} onDelete={onDelete} />
      ))}
    </div>
  );
}
