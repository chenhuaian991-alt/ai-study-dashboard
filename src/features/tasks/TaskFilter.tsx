import type { TaskStatus, TaskPriority } from '../../types';

interface TaskFilterProps {
  keyword: string;
  onKeywordChange: (v: string) => void;
  statusFilter: TaskStatus | 'all';
  onStatusChange: (v: TaskStatus | 'all') => void;
  priorityFilter: TaskPriority | 'all';
  onPriorityChange: (v: TaskPriority | 'all') => void;
  courseFilter: string;
  onCourseChange: (v: string) => void;
  courses: string[];
  totalCount: number;
  filteredCount: number;
  onClear: () => void;
}

export function TaskFilter({
  keyword,
  onKeywordChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  courseFilter,
  onCourseChange,
  courses,
  totalCount,
  filteredCount,
  onClear,
}: TaskFilterProps) {
  const isFiltered =
    keyword.trim() !== '' ||
    statusFilter !== 'all' ||
    priorityFilter !== 'all' ||
    courseFilter !== 'all';

  return (
    <div className="task-filter">
      <div className="task-filter-row">
        <div className="task-filter-field">
          <input
            type="text"
            placeholder="搜索标题、课程、链接…"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
          />
        </div>
        <div className="task-filter-field">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as TaskStatus | 'all')}
          >
            <option value="all">全部状态</option>
            <option value="todo">待做</option>
            <option value="in-progress">进行中</option>
            <option value="done">已完成</option>
          </select>
        </div>
        <div className="task-filter-field">
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value as TaskPriority | 'all')}
          >
            <option value="all">全部优先级</option>
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
        </div>
        <div className="task-filter-field">
          <select
            value={courseFilter}
            onChange={(e) => onCourseChange(e.target.value)}
          >
            <option value="all">全部课程</option>
            {courses.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        {isFiltered && (
          <button
            type="button"
            className="task-filter-clear"
            onClick={onClear}
          >
            清空筛选
          </button>
        )}
      </div>
      <div className="task-filter-info">
        显示 {filteredCount} / {totalCount} 个任务
      </div>
    </div>
  );
}
