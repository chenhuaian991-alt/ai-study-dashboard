import { useState } from 'react';
import { createDailyReview } from './reviewStorage';
import { todayStr } from '../../utils/date';

interface ReviewFormProps {
  onCreated: () => void;
}

export function ReviewForm({ onCreated }: ReviewFormProps) {
  const [date, setDate] = useState(todayStr);
  const [completed, setCompleted] = useState('');
  const [postponed, setPostponed] = useState('');
  const [tomorrowPlan, setTomorrowPlan] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  function resetForm() {
    setDate(todayStr());
    setCompleted('');
    setPostponed('');
    setTomorrowPlan('');
    setNote('');
    setErrors({});
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newErrors: Record<string, string | undefined> = {};
    if (!date) newErrors.date = '请选择日期';
    if (!completed.trim()) newErrors.completed = '请填写完成内容';
    if (!tomorrowPlan.trim()) newErrors.tomorrowPlan = '请填写明日计划';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    createDailyReview({
      date,
      completed: completed.trim(),
      postponed: postponed.trim(),
      tomorrowPlan: tomorrowPlan.trim(),
      note: note.trim(),
    });

    resetForm();
    onCreated();
  }

  function clearError(field: string) {
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <div className="review-form-row">
        <div className="review-form-field">
          <label htmlFor="review-date">日期 *</label>
          <input
            id="review-date"
            type="date"
            value={date}
            onChange={(e) => { setDate(e.target.value); clearError('date'); }}
          />
          {errors.date && <span className="field-error">{errors.date}</span>}
        </div>
      </div>
      <div className="review-form-row review-form-row-single">
        <div className="review-form-field">
          <label htmlFor="review-completed">今天完成了什么 *</label>
          <textarea
            id="review-completed"
            value={completed}
            onChange={(e) => { setCompleted(e.target.value); clearError('completed'); }}
            placeholder="完成了哪些任务、学到了什么..."
            rows={3}
          />
          {errors.completed && <span className="field-error">{errors.completed}</span>}
        </div>
      </div>
      <div className="review-form-row review-form-row-single">
        <div className="review-form-field">
          <label htmlFor="review-postponed">延期了什么</label>
          <textarea
            id="review-postponed"
            value={postponed}
            onChange={(e) => setPostponed(e.target.value)}
            placeholder="可选：哪些任务延期了、原因..."
            rows={2}
          />
        </div>
      </div>
      <div className="review-form-row review-form-row-single">
        <div className="review-form-field">
          <label htmlFor="review-tomorrow">明天计划 *</label>
          <textarea
            id="review-tomorrow"
            value={tomorrowPlan}
            onChange={(e) => { setTomorrowPlan(e.target.value); clearError('tomorrowPlan'); }}
            placeholder="明天打算做什么..."
            rows={3}
          />
          {errors.tomorrowPlan && <span className="field-error">{errors.tomorrowPlan}</span>}
        </div>
      </div>
      <div className="review-form-row review-form-row-single">
        <div className="review-form-field">
          <label htmlFor="review-note">备注</label>
          <textarea
            id="review-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="可选：心情、想法、其他..."
            rows={2}
          />
        </div>
      </div>
      <div className="review-form-actions">
        <button type="submit" className="review-form-submit">添加复盘</button>
      </div>
    </form>
  );
}
