import { useState, useMemo, useEffect } from 'react';
import type { Task, TaskStatus, TaskPriority } from '../../types';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { TaskFilter } from './TaskFilter';
import { getTasks, moveTask, deleteTask } from './taskStorage';

const columns: { key: TaskStatus; title: string }[] = [
  { key: 'todo', title: '待做' },
  { key: 'in-progress', title: '进行中' },
  { key: 'done', title: '已完成' },
];

function filterTasks(
  tasks: Task[],
  keyword: string,
  status: TaskStatus | 'all',
  priority: TaskPriority | 'all',
  course: string,
): Task[] {
  const kw = keyword.trim().toLowerCase();
  return tasks.filter((t) => {
    if (status !== 'all' && t.status !== status) return false;
    if (priority !== 'all' && t.priority !== priority) return false;
    if (course !== 'all' && t.course !== course) return false;
    if (kw) {
      const keywords = kw.split(/\s+/).filter(Boolean);
      const haystack = [t.title, t.course]
        .join(' ')
        .toLowerCase();
      if (keywords.length > 0 && !keywords.every((word) => haystack.includes(word))) return false;
    }
    return true;
  });
}

export function TaskBoard() {
  const [tasks, setTasks] = useState(getTasks);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [courseFilter, setCourseFilter] = useState('all');

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

  function handleClearFilters() {
    setKeyword('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setCourseFilter('all');
  }

  const courses = useMemo(() => {
    const set = new Set<string>();
    for (const t of tasks) {
      if (t.course) set.add(t.course);
    }
    return [...set].sort();
  }, [tasks]);

  useEffect(() => {
    if (courseFilter !== 'all' && !courses.includes(courseFilter)) {
      setCourseFilter('all');
    }
  }, [courses, courseFilter]);

  const filteredTasks = useMemo(
    () => filterTasks(tasks, keyword, statusFilter, priorityFilter, courseFilter),
    [tasks, keyword, statusFilter, priorityFilter, courseFilter],
  );

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

      {!hasNoTasks && (
        <TaskFilter
          keyword={keyword}
          onKeywordChange={setKeyword}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          courseFilter={courseFilter}
          onCourseChange={setCourseFilter}
          courses={courses}
          totalCount={tasks.length}
          filteredCount={filteredTasks.length}
          onClear={handleClearFilters}
        />
      )}

      {hasNoTasks && (
        <div className="task-empty-global">
          <p>还没有任务</p>
          <p className="task-empty-hint">请使用上方表单添加你的第一个任务</p>
        </div>
      )}

      {!hasNoTasks && filteredTasks.length === 0 && (
        <div className="task-empty-global">
          <p>没有符合当前筛选条件的任务</p>
          <button
            type="button"
            className="task-filter-clear"
            onClick={handleClearFilters}
          >
            清空筛选
          </button>
        </div>
      )}

      <div className="task-board">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.key);
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
