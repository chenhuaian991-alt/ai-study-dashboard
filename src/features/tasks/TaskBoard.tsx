import { useState } from 'react';
import type { Task, TaskStatus } from '../../types';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { getTasks, moveTask, deleteTask } from './taskStorage';

const columns: { key: TaskStatus; title: string }[] = [
  { key: 'todo', title: '待做' },
  { key: 'in-progress', title: '进行中' },
  { key: 'done', title: '已完成' },
];

export function TaskBoard() {
  const [tasks, setTasks] = useState(getTasks);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  function refresh() {
    setTasks(getTasks());
  }

  function handleMoveTask(id: string, status: TaskStatus) {
    moveTask(id, status);
    refresh();
  }

  function handleDeleteTask(id: string, title: string) {
    if (!window.confirm(`确认删除"${title}"吗？`)) return;
    deleteTask(id);
    if (editingTask?.id === id) setEditingTask(null);
    refresh();
  }

  function handleEditTask(task: Task) {
    setEditingTask(task);
  }

  function handleCancelEdit() {
    setEditingTask(null);
  }

  function handleSaved() {
    setEditingTask(null);
    refresh();
  }

  const hasNoTasks = tasks.length === 0;

  return (
    <>
      <TaskForm
        key={editingTask?.id ?? 'new-task'}
        onCreated={refresh}
        editingTask={editingTask}
        onCancelEdit={handleCancelEdit}
        onSaved={handleSaved}
      />

      {hasNoTasks && (
        <div className="task-empty-global">
          <p>还没有任务</p>
          <p className="task-empty-hint">请使用上方表单添加你的第一个任务</p>
        </div>
      )}

      <div className="task-board">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);
          return (
            <div key={col.key} className="task-column">
              <div className="task-column-header">
                <span>{col.title}</span>
                <span className="task-count">{colTasks.length}</span>
              </div>
              <div className="task-column-body">
                {colTasks.length === 0 ? (
                  <div className="task-empty">暂无任务</div>
                ) : (
                  colTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onMoveTask={handleMoveTask}
                      onDeleteTask={handleDeleteTask}
                      onEditTask={handleEditTask}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
