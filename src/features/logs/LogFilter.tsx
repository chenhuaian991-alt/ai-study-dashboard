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
