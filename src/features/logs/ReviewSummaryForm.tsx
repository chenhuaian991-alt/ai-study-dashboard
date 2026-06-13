import { useState } from 'react';
import type { AiLog } from '../../types';
import { createAiReviewSummary } from './reviewSummaryStorage';

interface ReviewSummaryFormProps {
  sourceLogs: AiLog[];
  onSaved: () => void;
}

function suggestTitle(logs: AiLog[]): string {
  if (logs.length === 0) return '';
  const titles = logs.slice(0, 3).map((l) => l.title);
  const joined = titles.join('、');
  return logs.length > 3 ? `${joined} 等${logs.length}条日志复盘` : `${joined} 复盘`;
}

export function ReviewSummaryForm({ sourceLogs, onSaved }: ReviewSummaryFormProps) {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [actionItems, setActionItems] = useState('');
  const [errors, setErrors] = useState<{ title?: string; summary?: string }>({});

  function handleSuggestTitle() {
    const suggested = suggestTitle(sourceLogs);
    if (suggested) setTitle(suggested);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!title.trim()) nextErrors.title = '请输入复盘标题';
    if (!summary.trim()) nextErrors.summary = '请粘贴 AI 总结内容';
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    createAiReviewSummary({
      title: title.trim(),
      sourceLogCount: sourceLogs.length,
      sourceLogIds: sourceLogs.map((l) => l.id),
      summary: summary.trim(),
      actionItems: actionItems.trim(),
    });
    setTitle('');
    setSummary('');
    setActionItems('');
    setErrors({});
    onSaved();
  }

  return (
    <form className="review-summary-form" onSubmit={handleSubmit}>
      <h3>保存 AI 复盘摘要</h3>
      <label>
        标题 *
        <div className="review-summary-title-row">
          <input
            type="text"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              if (errors.title) setErrors((current) => ({ ...current, title: undefined }));
            }}
            placeholder="例如：v0.3 AI 协作复盘"
          />
          {sourceLogs.length > 0 && (
            <button type="button" className="title-suggest-btn" onClick={handleSuggestTitle}>
              自动填充
            </button>
          )}
        </div>
        {errors.title && <span className="field-error">{errors.title}</span>}
      </label>
      <label>
        AI 总结 *
        <textarea
          value={summary}
          onChange={(event) => {
            setSummary(event.target.value);
            if (errors.summary) setErrors((current) => ({ ...current, summary: undefined }));
          }}
          rows={6}
          placeholder="把 Codex 或 Claude 返回的总结粘贴到这里"
        />
        {errors.summary && <span className="field-error">{errors.summary}</span>}
      </label>
      <label>
        下次行动
        <textarea
          value={actionItems}
          onChange={(event) => setActionItems(event.target.value)}
          rows={4}
          placeholder="记录下一轮要改进的具体动作"
        />
      </label>
      <button type="submit">保存复盘摘要</button>
    </form>
  );
}
