import type { Task, TaskStatus } from '../../types';

const priorityLabel: Record<string, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

interface TaskCardProps {
  task: Task;
  onMoveTask: (id: string, status: TaskStatus) => void;
  onDeleteTask: (id: string, title: string) => void;
  onEditTask: (task: Task) => void;
}

export function TaskCard({ task, onMoveTask, onDeleteTask, onEditTask }: TaskCardProps) {
  return (
    <div className={`task-card priority-${task.priority}`}>
      <div className="task-card-header">
        <span className="task-title">{task.title}</span>
        <span className={`priority-badge ${task.priority}`}>
          {priorityLabel[task.priority]}
        </span>
      </div>
      <div className="task-meta">
        <span>{task.course}</span>
        <span>截止 {task.deadline}</span>
        <span>{task.estimatedHours}h</span>
      </div>
      {task.resourceLink && (
        <a
          className="task-link"
          href={task.resourceLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          资料链接
        </a>
      )}
      <div className="task-actions">
        {task.status === 'todo' && (
          <button
            type="button"
            className="task-action-btn action-start"
            onClick={() => onMoveTask(task.id, 'in-progress')}
          >
            开始
          </button>
        )}
        {task.status === 'in-progress' && (
          <>
            <button
              type="button"
              className="task-action-btn action-done"
              onClick={() => onMoveTask(task.id, 'done')}
            >
              完成
            </button>
            <button
              type="button"
              className="task-action-btn action-back"
              onClick={() => onMoveTask(task.id, 'todo')}
            >
              退回待做
            </button>
          </>
        )}
        {task.status === 'done' && (
          <button
            type="button"
            className="task-action-btn action-reopen"
            onClick={() => onMoveTask(task.id, 'in-progress')}
          >
            重新打开
          </button>
        )}
        <button
          type="button"
          className="task-action-btn action-edit"
          onClick={() => onEditTask(task)}
        >
          编辑
        </button>
        <button
          type="button"
          className="task-action-btn action-delete"
          onClick={() => onDeleteTask(task.id, task.title)}
        >
          删除
        </button>
      </div>
    </div>
  );
}
