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
