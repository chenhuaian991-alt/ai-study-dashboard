import type { DailyReview } from '../../types';

interface ReviewCardProps {
  review: DailyReview;
  onDeleteReview: (id: string, date: string) => void;
}

export function ReviewCard({ review, onDeleteReview }: ReviewCardProps) {
  const dateStr = new Date(review.date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  return (
    <div className="review-card">
      <div className="review-card-header">
        <span className="review-date">{dateStr}</span>
      </div>
      <div className="review-body">
        <div className="review-field">
          <span className="review-field-label">完成</span>
          <p>{review.completed}</p>
        </div>
        {review.postponed && (
          <div className="review-field">
            <span className="review-field-label">延期</span>
            <p>{review.postponed}</p>
          </div>
        )}
        <div className="review-field">
          <span className="review-field-label">明日计划</span>
          <p>{review.tomorrowPlan}</p>
        </div>
        {review.note && (
          <div className="review-field">
            <span className="review-field-label">备注</span>
            <p>{review.note}</p>
          </div>
        )}
      </div>
      <div className="review-card-actions">
        <button
          type="button"
          className="review-action-btn review-action-delete"
          onClick={() => onDeleteReview(review.id, review.date)}
        >
          删除
        </button>
      </div>
    </div>
  );
}
