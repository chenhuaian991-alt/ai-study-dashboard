import { getTasks } from '../tasks/taskStorage';
import { getAiLogs } from '../logs/logStorage';
import { getDailyReviews } from '../reviews/reviewStorage';
import { isToday, isBeforeToday, formatDate } from '../../utils/date';
import type { Task, AiLog, DailyReview } from '../../types';

const RECENT_LIMIT = 3;

const priorityLabel: Record<string, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

const toolLabel: Record<string, string> = {
  claude: 'Claude',
  codex: 'Codex',
  other: '其他',
};

function getDueToday(tasks: Task[]): Task[] {
  return tasks.filter(
    (t) => t.deadline && isToday(t.deadline) && t.status !== 'done'
  );
}

function getOverdue(tasks: Task[]): Task[] {
  return tasks.filter(
    (t) => t.deadline && isBeforeToday(t.deadline) && t.status !== 'done'
  );
}

function getInProgress(tasks: Task[]): Task[] {
  return tasks.filter((t) => t.status === 'in-progress');
}

export function Dashboard() {
  const tasks = getTasks();
  const logs = getAiLogs();
  const reviews = getDailyReviews();

  const dueToday = getDueToday(tasks);
  const overdue = getOverdue(tasks);
  const inProgress = getInProgress(tasks);

  const recentLogs = [...logs]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, RECENT_LIMIT);

  const recentReviews = [...reviews]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, RECENT_LIMIT);

  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        <div className="dashboard-card dashboard-card--urgent">
          <div className="dashboard-card-header">
            <h3>今日到期</h3>
            <span className="task-count">{dueToday.length}</span>
          </div>
          <div className="dashboard-card-body">
            {dueToday.length === 0 ? (
              <p className="dashboard-empty">今日无到期任务</p>
            ) : (
              dueToday.map((t) => <TaskRow key={t.id} task={t} />)
            )}
          </div>
        </div>

        <div className="dashboard-card dashboard-card--overdue">
          <div className="dashboard-card-header">
            <h3>已逾期</h3>
            <span className="task-count">{overdue.length}</span>
          </div>
          <div className="dashboard-card-body">
            {overdue.length === 0 ? (
              <p className="dashboard-empty">暂无逾期任务</p>
            ) : (
              overdue.map((t) => <TaskRow key={t.id} task={t} />)
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>进行中</h3>
            <span className="task-count">{inProgress.length}</span>
          </div>
          <div className="dashboard-card-body">
            {inProgress.length === 0 ? (
              <p className="dashboard-empty">暂无进行中任务</p>
            ) : (
              inProgress.map((t) => <TaskRow key={t.id} task={t} />)
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-bottom">
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>最近 AI 编程日志</h3>
          </div>
          <div className="dashboard-card-body">
            {recentLogs.length === 0 ? (
              <p className="dashboard-empty">暂无 AI 编程日志</p>
            ) : (
              recentLogs.map((l) => <LogRow key={l.id} log={l} />)
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>最近每日复盘</h3>
          </div>
          <div className="dashboard-card-body">
            {recentReviews.length === 0 ? (
              <p className="dashboard-empty">暂无每日复盘</p>
            ) : (
              recentReviews.map((r) => <ReviewRow key={r.id} review={r} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskRow({ task }: { task: Task }) {
  return (
    <div className="dashboard-task-row">
      <div className="dashboard-task-title">{task.title}</div>
      <div className="dashboard-task-meta">
        {task.course && <span>{task.course}</span>}
        {task.deadline && <span>截止 {formatDate(task.deadline)}</span>}
        <span className={`priority-badge ${task.priority}`}>
          {priorityLabel[task.priority] || task.priority}
        </span>
      </div>
    </div>
  );
}

function LogRow({ log }: { log: AiLog }) {
  return (
    <div className="dashboard-log-row">
      <div className="dashboard-log-title">{log.title}</div>
      <div className="dashboard-log-meta">
        <span>{formatDate(log.createdAt)}</span>
        <span className="log-tool-badge">{toolLabel[log.tool] || log.tool}</span>
        <span className={`log-status-badge ${log.status}`}>
          {log.status === 'success' ? '成功' : log.status === 'partial' ? '部分' : '失败'}
        </span>
      </div>
    </div>
  );
}

function ReviewRow({ review }: { review: DailyReview }) {
  const preview =
    review.completed.length > 60
      ? review.completed.slice(0, 60) + '…'
      : review.completed;

  return (
    <div className="dashboard-review-row">
      <div className="dashboard-review-date">{formatDate(review.date)}</div>
      <div className="dashboard-review-preview">
        {preview || '（无完成内容记录）'}
      </div>
    </div>
  );
}
