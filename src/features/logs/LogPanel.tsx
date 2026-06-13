import { useState, useMemo } from 'react';
import { LogForm } from './LogForm';
import { LogCard } from './LogCard';
import { LogFilter } from './LogFilter';
import type { LogFilters } from './LogFilter';
import { LogReviewDraft } from './LogReviewDraft';
import { ReviewSummaryForm } from './ReviewSummaryForm';
import { ReviewSummaryList } from './ReviewSummaryList';
import { getAiLogs, deleteAiLog } from './logStorage';
import {
  deleteAiReviewSummary,
  getAiReviewSummaries,
} from './reviewSummaryStorage';

const defaultFilters: LogFilters = {
  keyword: '',
  tool: 'all',
  status: 'all',
};

export function LogPanel() {
  const [logs, setLogs] = useState(getAiLogs);
  const [filters, setFilters] = useState<LogFilters>(defaultFilters);
  const [summaries, setSummaries] = useState(getAiReviewSummaries);

  function refresh() {
    setLogs(getAiLogs());
  }

  function refreshSummaries() {
    setSummaries(getAiReviewSummaries());
  }

  function handleDeleteLog(id: string, title: string) {
    if (!window.confirm(`确认删除"${title}"吗？`)) return;
    deleteAiLog(id);
    refresh();
  }

  function handleDeleteSummary(id: string, title: string) {
    if (!window.confirm(`确认删除"${title}"吗？`)) return;
    deleteAiReviewSummary(id);
    refreshSummaries();
  }

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

  return (
    <div className="log-panel">
      <h2 className="log-panel-title">AI 编程日志</h2>
      {logs.length > 0 && (
        <nav className="log-quick-nav">
          <a href="#log-form-section">新增日志</a>
          <a href="#log-review-section">复盘材料</a>
          <a href="#log-list-section">日志列表</a>
          <a href="#review-summary-section">已保存复盘</a>
        </nav>
      )}
      <div id="log-form-section">
        <LogForm onCreated={refresh} />
      </div>
      {logs.length === 0 ? (
        <div className="log-empty">还没有日志，使用上方表单添加第一条</div>
      ) : (
        <>
          <LogFilter
            filters={filters}
            resultCount={filteredLogs.length}
            totalCount={logs.length}
            onChange={setFilters}
            onReset={() => setFilters(defaultFilters)}
          />
          <div id="log-review-section">
            <LogReviewDraft logs={filteredLogs} filters={filters} />
            <ReviewSummaryForm sourceLogs={filteredLogs} onSaved={refreshSummaries} />
          </div>
          <div id="log-list-section" className="log-list">
            {logs.map((log) => (
              <LogCard key={log.id} log={log} onDeleteLog={handleDeleteLog} />
            ))}
          </div>
        </>
      )}
      <div id="review-summary-section">
        <ReviewSummaryList summaries={summaries} logs={logs} onDelete={handleDeleteSummary} />
      </div>
    </div>
  );
}
