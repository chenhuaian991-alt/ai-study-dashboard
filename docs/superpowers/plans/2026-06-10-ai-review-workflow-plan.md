# AI Review Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build v0.3 AI review workflow: filter AI logs, generate copyable Markdown review material, and save AI-generated review summaries.

**Architecture:** Keep existing `AiLog` storage unchanged. Add a separate `AiReviewSummary` localStorage-backed data model, then add UI-only filters and Markdown generation inside the logs feature.

**Tech Stack:** Vite, React, TypeScript, plain CSS, localStorage.

---

## File Map

- Create `src/features/logs/reviewSummaryStorage.ts`: CRUD helpers for saved AI review summaries.
- Create `src/features/logs/LogFilter.tsx`: filter controls for keyword, tool, and status.
- Create `src/features/logs/LogReviewDraft.tsx`: Markdown preview and copy button for filtered logs.
- Create `src/features/logs/ReviewSummaryForm.tsx`: form for saving AI-generated review summaries.
- Create `src/features/logs/ReviewSummaryCard.tsx`: single saved summary display and delete action.
- Create `src/features/logs/ReviewSummaryList.tsx`: saved summaries list.
- Modify `src/types/index.ts`: add `AiReviewSummary` type.
- Modify `src/utils/storageKeys.ts`: add `AI_REVIEW_SUMMARIES` key.
- Modify `src/features/logs/LogPanel.tsx`: wire filters, draft, summary form/list, and existing log list.
- Modify `src/App.css`: add styles for filter, review draft, summary form, and summary cards.

## Task 1: Add Review Summary Data Model

**Files:**
- Modify: `src/types/index.ts`
- Modify: `src/utils/storageKeys.ts`
- Create: `src/features/logs/reviewSummaryStorage.ts`

- [ ] **Step 1: Add the `AiReviewSummary` type**

In `src/types/index.ts`, add this after the `AiLog` interface:

```ts
export interface AiReviewSummary {
  id: string;
  title: string;
  sourceLogCount: number;
  summary: string;
  actionItems: string;
  createdAt: string;
  updatedAt: string;
}
```

- [ ] **Step 2: Add the storage key**

In `src/utils/storageKeys.ts`, add:

```ts
AI_REVIEW_SUMMARIES: 'ai-study-dashboard:ai-review-summaries',
```

The full object should include `TASKS`, `AI_LOGS`, `DAILY_REVIEWS`, and `AI_REVIEW_SUMMARIES`.

- [ ] **Step 3: Create summary storage helpers**

Create `src/features/logs/reviewSummaryStorage.ts`:

```ts
import type { AiReviewSummary } from '../../types';
import { createId } from '../../utils/ids';
import { loadFromStorage, saveToStorage } from '../../utils/storage';
import { STORAGE_KEYS } from '../../utils/storageKeys';

type CreateAiReviewSummaryInput = Omit<
  AiReviewSummary,
  'id' | 'createdAt' | 'updatedAt'
>;

export function getAiReviewSummaries(): AiReviewSummary[] {
  return loadFromStorage<AiReviewSummary[]>(STORAGE_KEYS.AI_REVIEW_SUMMARIES, []);
}

export function saveAiReviewSummaries(summaries: AiReviewSummary[]): void {
  saveToStorage(STORAGE_KEYS.AI_REVIEW_SUMMARIES, summaries);
}

export function createAiReviewSummary(input: CreateAiReviewSummaryInput): AiReviewSummary {
  const now = new Date().toISOString();
  const summary: AiReviewSummary = {
    ...input,
    id: createId('review-summary'),
    createdAt: now,
    updatedAt: now,
  };

  const summaries = getAiReviewSummaries();
  saveAiReviewSummaries([summary, ...summaries]);
  return summary;
}

export function deleteAiReviewSummary(id: string): boolean {
  const summaries = getAiReviewSummaries();
  const nextSummaries = summaries.filter((summary) => summary.id !== id);
  if (nextSummaries.length === summaries.length) return false;
  saveAiReviewSummaries(nextSummaries);
  return true;
}
```

- [ ] **Step 4: Verify build**

Run:

```bash
npm run build
```

Expected: TypeScript build and Vite build both pass.

## Task 2: Add Log Filtering

**Files:**
- Create: `src/features/logs/LogFilter.tsx`
- Modify: `src/features/logs/LogPanel.tsx`
- Modify: `src/App.css`

- [ ] **Step 1: Create filter component**

Create `src/features/logs/LogFilter.tsx`:

```tsx
import type { AiLogStatus, AiLogTool } from '../../types';

export interface LogFilters {
  keyword: string;
  tool: AiLogTool | 'all';
  status: AiLogStatus | 'all';
}

interface LogFilterProps {
  filters: LogFilters;
  resultCount: number;
  totalCount: number;
  onChange: (filters: LogFilters) => void;
  onReset: () => void;
}

export function LogFilter({
  filters,
  resultCount,
  totalCount,
  onChange,
  onReset,
}: LogFilterProps) {
  return (
    <div className="log-filter">
      <div className="log-filter-header">
        <h3>日志筛选</h3>
        <span>
          显示 {resultCount} / {totalCount} 条
        </span>
      </div>
      <div className="log-filter-controls">
        <label>
          关键词
          <input
            type="search"
            value={filters.keyword}
            onChange={(event) =>
              onChange({ ...filters, keyword: event.target.value })
            }
            placeholder="搜索标题、prompt、结果或经验"
          />
        </label>
        <label>
          工具
          <select
            value={filters.tool}
            onChange={(event) =>
              onChange({ ...filters, tool: event.target.value as LogFilters['tool'] })
            }
          >
            <option value="all">全部</option>
            <option value="claude">Claude</option>
            <option value="codex">Codex</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>
          状态
          <select
            value={filters.status}
            onChange={(event) =>
              onChange({ ...filters, status: event.target.value as LogFilters['status'] })
            }
          >
            <option value="all">全部</option>
            <option value="success">成功</option>
            <option value="partial">部分成功</option>
            <option value="failed">失败</option>
          </select>
        </label>
        <button type="button" onClick={onReset}>
          重置筛选
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire filters in LogPanel**

In `src/features/logs/LogPanel.tsx`, import `useMemo`, `LogFilter`, and `LogFilters`. Add:

```ts
const defaultFilters: LogFilters = {
  keyword: '',
  tool: 'all',
  status: 'all',
};
```

Inside `LogPanel`, add:

```ts
const [filters, setFilters] = useState<LogFilters>(defaultFilters);

const filteredLogs = useMemo(() => {
  const keyword = filters.keyword.trim().toLowerCase();
  return logs.filter((log) => {
    const matchesTool = filters.tool === 'all' || log.tool === filters.tool;
    const matchesStatus = filters.status === 'all' || log.status === filters.status;
    const searchableText = [
      log.title,
      log.prompt,
      log.result,
      log.lesson ?? '',
    ]
      .join(' ')
      .toLowerCase();
    const matchesKeyword = !keyword || searchableText.includes(keyword);
    return matchesTool && matchesStatus && matchesKeyword;
  });
}, [logs, filters]);
```

Render `LogFilter` after `LogForm` and render `filteredLogs` instead of `logs`.

- [ ] **Step 3: Add filter CSS**

In `src/App.css`, add:

```css
.log-filter {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  background: #f9fafb;
}

.log-filter-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}

.log-filter-header h3 {
  margin: 0;
  font-size: 1rem;
}

.log-filter-controls {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) minmax(140px, 180px) minmax(140px, 180px) auto;
  gap: 12px;
  align-items: end;
}

.log-filter-controls label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-weight: 600;
}

.log-filter-controls input,
.log-filter-controls select {
  min-height: 38px;
}

.log-filter-controls button {
  min-height: 38px;
}

@media (max-width: 760px) {
  .log-filter-controls {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 4: Verify build**

Run:

```bash
npm run build
```

Expected: Build passes, log list changes when filters change.

## Task 3: Add Markdown Review Draft

**Files:**
- Create: `src/features/logs/LogReviewDraft.tsx`
- Modify: `src/features/logs/LogPanel.tsx`
- Modify: `src/App.css`

- [ ] **Step 1: Create draft component**

Create `src/features/logs/LogReviewDraft.tsx`:

```tsx
import { useMemo, useState } from 'react';
import type { AiLog } from '../../types';
import type { LogFilters } from './LogFilter';

interface LogReviewDraftProps {
  logs: AiLog[];
  filters: LogFilters;
}

function formatTool(tool: AiLog['tool']) {
  if (tool === 'claude') return 'Claude';
  if (tool === 'codex') return 'Codex';
  return 'Other';
}

function formatStatus(status: AiLog['status']) {
  if (status === 'success') return '成功';
  if (status === 'partial') return '部分成功';
  return '失败';
}

function formatFilterValue(value: string) {
  return value === 'all' || value.trim() === '' ? '全部' : value;
}

function buildReviewMarkdown(logs: AiLog[], filters: LogFilters) {
  const sections = logs.map((log, index) => {
    return [
      `## 日志 ${index + 1}：${log.title}`,
      `- 工具：${formatTool(log.tool)}`,
      `- 状态：${formatStatus(log.status)}`,
      `- 时间：${log.createdAt}`,
      '',
      '### Prompt',
      log.prompt,
      '',
      '### Result',
      log.result,
      '',
      '### Lesson',
      log.lesson?.trim() || '无',
    ].join('\n');
  });

  return [
    '# AI 协作复盘材料',
    '',
    '## 范围',
    `- 日志数量：${logs.length}`,
    `- 工具筛选：${formatFilterValue(filters.tool)}`,
    `- 状态筛选：${formatFilterValue(filters.status)}`,
    `- 关键词：${filters.keyword.trim() || '无'}`,
    '',
    ...sections,
    '',
    '## 请帮我总结',
    '请基于以上日志，总结：',
    '1. 我这轮 AI 协作做得好的地方',
    '2. 我的问题和低效点',
    '3. 可复用的 prompt 模式',
    '4. 下次开发建议',
  ].join('\n');
}

export function LogReviewDraft({ logs, filters }: LogReviewDraftProps) {
  const [message, setMessage] = useState('');
  const markdown = useMemo(() => buildReviewMarkdown(logs, filters), [logs, filters]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(markdown);
      setMessage('复盘材料已复制');
    } catch {
      setMessage('复制失败，请手动复制预览内容');
    }
  }

  if (logs.length === 0) {
    return (
      <div className="log-review-draft">
        <h3>复盘材料</h3>
        <p>当前筛选条件下没有日志。</p>
      </div>
    );
  }

  return (
    <div className="log-review-draft">
      <div className="log-review-draft-header">
        <h3>复盘材料</h3>
        <button type="button" onClick={handleCopy}>
          复制复盘材料
        </button>
      </div>
      <textarea readOnly value={markdown} rows={14} />
      {message && <p className="log-review-message">{message}</p>}
    </div>
  );
}
```

- [ ] **Step 2: Render draft in LogPanel**

Import `LogReviewDraft` and render it after `LogFilter`:

```tsx
<LogReviewDraft logs={filteredLogs} filters={filters} />
```

- [ ] **Step 3: Add draft CSS**

In `src/App.css`, add:

```css
.log-review-draft {
  border: 1px solid #dbeafe;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  background: #eff6ff;
}

.log-review-draft-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}

.log-review-draft-header h3 {
  margin: 0;
  font-size: 1rem;
}

.log-review-draft textarea {
  width: 100%;
  resize: vertical;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  line-height: 1.5;
}

.log-review-message {
  margin: 8px 0 0;
  color: #1d4ed8;
}
```

- [ ] **Step 4: Verify build**

Run:

```bash
npm run build
```

Expected: Build passes, Markdown preview updates with filters, copy button works where clipboard is available.

## Task 4: Add Saved Review Summaries UI

**Files:**
- Create: `src/features/logs/ReviewSummaryForm.tsx`
- Create: `src/features/logs/ReviewSummaryCard.tsx`
- Create: `src/features/logs/ReviewSummaryList.tsx`
- Modify: `src/features/logs/LogPanel.tsx`
- Modify: `src/App.css`

- [ ] **Step 1: Create summary form**

Create `src/features/logs/ReviewSummaryForm.tsx`:

```tsx
import { useState } from 'react';
import { createAiReviewSummary } from './reviewSummaryStorage';

interface ReviewSummaryFormProps {
  sourceLogCount: number;
  onSaved: () => void;
}

export function ReviewSummaryForm({ sourceLogCount, onSaved }: ReviewSummaryFormProps) {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [actionItems, setActionItems] = useState('');
  const [errors, setErrors] = useState<{ title?: string; summary?: string }>({});

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
      sourceLogCount,
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
        <input
          type="text"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            if (errors.title) setErrors((current) => ({ ...current, title: undefined }));
          }}
          placeholder="例如：v0.3 AI 协作复盘"
        />
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
```

- [ ] **Step 2: Create summary card**

Create `src/features/logs/ReviewSummaryCard.tsx`:

```tsx
import type { AiReviewSummary } from '../../types';

interface ReviewSummaryCardProps {
  summary: AiReviewSummary;
  onDelete: (id: string, title: string) => void;
}

export function ReviewSummaryCard({ summary, onDelete }: ReviewSummaryCardProps) {
  return (
    <article className="review-summary-card">
      <div className="review-summary-card-header">
        <h4>{summary.title}</h4>
        <span>{new Date(summary.createdAt).toLocaleString()}</span>
      </div>
      <p className="review-summary-meta">基于 {summary.sourceLogCount} 条日志</p>
      <div>
        <strong>AI 总结</strong>
        <p>{summary.summary}</p>
      </div>
      {summary.actionItems && (
        <div>
          <strong>下次行动</strong>
          <p>{summary.actionItems}</p>
        </div>
      )}
      <button type="button" className="review-summary-delete" onClick={() => onDelete(summary.id, summary.title)}>
        删除
      </button>
    </article>
  );
}
```

- [ ] **Step 3: Create summary list**

Create `src/features/logs/ReviewSummaryList.tsx`:

```tsx
import type { AiReviewSummary } from '../../types';
import { ReviewSummaryCard } from './ReviewSummaryCard';

interface ReviewSummaryListProps {
  summaries: AiReviewSummary[];
  onDelete: (id: string, title: string) => void;
}

export function ReviewSummaryList({ summaries, onDelete }: ReviewSummaryListProps) {
  if (summaries.length === 0) {
    return <p className="review-summary-empty">还没有保存 AI 复盘摘要。</p>;
  }

  return (
    <div className="review-summary-list">
      {summaries.map((summary) => (
        <ReviewSummaryCard key={summary.id} summary={summary} onDelete={onDelete} />
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Wire summaries in LogPanel**

In `LogPanel`, import:

```ts
import { ReviewSummaryForm } from './ReviewSummaryForm';
import { ReviewSummaryList } from './ReviewSummaryList';
import {
  deleteAiReviewSummary,
  getAiReviewSummaries,
} from './reviewSummaryStorage';
```

Add state:

```ts
const [summaries, setSummaries] = useState(getAiReviewSummaries);

function refreshSummaries() {
  setSummaries(getAiReviewSummaries());
}

function handleDeleteSummary(id: string, title: string) {
  if (!window.confirm(`确认删除“${title}”吗？`)) return;
  deleteAiReviewSummary(id);
  refreshSummaries();
}
```

Render after `LogReviewDraft`:

```tsx
<ReviewSummaryForm sourceLogCount={filteredLogs.length} onSaved={refreshSummaries} />
<ReviewSummaryList summaries={summaries} onDelete={handleDeleteSummary} />
```

- [ ] **Step 5: Add summary CSS**

In `src/App.css`, add:

```css
.review-summary-form {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  background: #ffffff;
}

.review-summary-form h3 {
  margin-top: 0;
}

.review-summary-form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
  font-weight: 600;
}

.review-summary-form textarea {
  resize: vertical;
}

.review-summary-list {
  display: grid;
  gap: 12px;
  margin: 16px 0;
}

.review-summary-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  background: #ffffff;
}

.review-summary-card-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: start;
}

.review-summary-card-header h4 {
  margin: 0;
}

.review-summary-card-header span,
.review-summary-meta {
  color: #6b7280;
  font-size: 0.9rem;
}

.review-summary-delete {
  color: #b91c1c;
  border-color: #fecaca;
  background: #fff1f2;
}

.review-summary-empty {
  color: #6b7280;
}
```

- [ ] **Step 6: Verify build**

Run:

```bash
npm run build
```

Expected: Build passes, summaries save to localStorage and can be deleted.

## Task 5: Final Manual Verification

**Files:**
- No code changes unless verification finds a defect.

- [ ] **Step 1: Run production build**

Run:

```bash
npm run build
```

Expected: Build passes.

- [ ] **Step 2: Start dev server**

Run:

```bash
npm run dev
```

Expected: Vite serves the app at `http://localhost:5173`.

- [ ] **Step 3: Verify log filtering**

In the browser:

1. Add at least three AI logs with different tools and statuses.
2. Filter by Claude.
3. Filter by Codex.
4. Filter by success.
5. Search by a word from a prompt.

Expected: Log list and result count update correctly.

- [ ] **Step 4: Verify review draft**

With filtered logs visible:

1. Confirm Markdown preview includes the filtered log count.
2. Confirm it includes Prompt, Result, and Lesson sections.
3. Click “复制复盘材料”.

Expected: Clipboard copy succeeds where supported, or preview remains available for manual copy.

- [ ] **Step 5: Verify saved summaries**

1. Paste a mock AI summary into the summary form.
2. Save it.
3. Refresh the page.
4. Confirm the saved summary remains.
5. Delete the summary and confirm it disappears after refresh.

Expected: Summary persistence and deletion work.

- [ ] **Step 6: Verify existing behavior**

Check that:

1. AI log creation still works.
2. AI log deletion still works.
3. Task board still renders.
4. Daily review still renders.
5. Backup panel still renders.

Expected: v0.1 and v0.2 core functionality remains usable.
