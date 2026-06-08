import { useState } from 'react';
import type { Task, TaskPriority } from '../../types';
import { createTask, updateTask } from './taskStorage';

interface TaskFormProps {
  onCreated: () => void;
  editingTask?: Task | null;
  onCancelEdit?: () => void;
  onSaved?: () => void;
}

export function TaskForm({ onCreated, editingTask, onCancelEdit, onSaved }: TaskFormProps) {
  const [title, setTitle] = useState(editingTask?.title ?? '');
  const [course, setCourse] = useState(editingTask?.course ?? '');
  const [deadline, setDeadline] = useState(editingTask?.deadline ?? '');
  const [priority, setPriority] = useState<TaskPriority>(editingTask?.priority ?? 'medium');
  const [estimatedHours, setEstimatedHours] = useState(
    editingTask && editingTask.estimatedHours > 0 ? String(editingTask.estimatedHours) : ''
  );
  const [resourceLink, setResourceLink] = useState(editingTask?.resourceLink ?? '');
  const [errors, setErrors] = useState<{ title?: string; course?: string }>({});

  const isEditing = !!editingTask;

  function resetForm() {
    setTitle('');
    setCourse('');
    setDeadline('');
    setPriority('medium');
    setEstimatedHours('');
    setResourceLink('');
    setErrors({});
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = '请输入任务标题';
    if (!course.trim()) newErrors.course = '请输入课程名称';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isEditing && editingTask) {
      updateTask(editingTask.id, {
        title: title.trim(),
        course: course.trim(),
        deadline,
        priority,
        estimatedHours: estimatedHours ? Number(estimatedHours) : 0,
        resourceLink: resourceLink.trim(),
      });
      resetForm();
      onSaved?.();
    } else {
      createTask({
        title: title.trim(),
        course: course.trim(),
        deadline,
        priority,
        estimatedHours: estimatedHours ? Number(estimatedHours) : 0,
        resourceLink: resourceLink.trim(),
      });
      resetForm();
      onCreated();
    }
  }

  function handleCancel() {
    resetForm();
    onCancelEdit?.();
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      {isEditing && (
        <div className="task-form-banner">正在编辑：{editingTask?.title}</div>
      )}
      <div className="task-form-row">
        <div className="task-form-field">
          <label htmlFor="task-title">任务标题 *</label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors((p) => ({ ...p, title: undefined })); }}
            placeholder="例如：高数第三章习题"
          />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>
        <div className="task-form-field">
          <label htmlFor="task-course">课程 *</label>
          <input
            id="task-course"
            type="text"
            value={course}
            onChange={(e) => { setCourse(e.target.value); if (errors.course) setErrors((p) => ({ ...p, course: undefined })); }}
            placeholder="例如：高等数学"
          />
          {errors.course && <span className="field-error">{errors.course}</span>}
        </div>
        <div className="task-form-field">
          <label htmlFor="task-deadline">截止日期</label>
          <input
            id="task-deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>
      </div>
      <div className="task-form-row">
        <div className="task-form-field">
          <label htmlFor="task-priority">优先级</label>
          <select
            id="task-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
          >
            <option value="low">低</option>
            <option value="medium">中</option>
            <option value="high">高</option>
          </select>
        </div>
        <div className="task-form-field">
          <label htmlFor="task-hours">预计用时 (h)</label>
          <input
            id="task-hours"
            type="number"
            min="0"
            step="0.5"
            value={estimatedHours}
            onChange={(e) => setEstimatedHours(e.target.value)}
            placeholder="0"
          />
        </div>
        <div className="task-form-field">
          <label htmlFor="task-link">资料链接</label>
          <input
            id="task-link"
            type="url"
            value={resourceLink}
            onChange={(e) => setResourceLink(e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>
      <div className="task-form-actions">
        {isEditing && (
          <button type="button" className="task-form-cancel" onClick={handleCancel}>取消</button>
        )}
        <button type="submit" className="task-form-submit">
          {isEditing ? '保存修改' : '添加任务'}
        </button>
      </div>
    </form>
  );
}
