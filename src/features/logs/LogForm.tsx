import { useState } from 'react';
import type { AiLogTool, AiLogStatus } from '../../types';
import { createAiLog } from './logStorage';

interface LogFormProps {
  onCreated: () => void;
}

export function LogForm({ onCreated }: LogFormProps) {
  const [title, setTitle] = useState('');
  const [tool, setTool] = useState<AiLogTool>('claude');
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [status, setStatus] = useState<AiLogStatus>('success');
  const [lesson, setLesson] = useState('');
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  function resetForm() {
    setTitle('');
    setTool('claude');
    setPrompt('');
    setResult('');
    setStatus('success');
    setLesson('');
    setErrors({});
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = '请输入标题';
    if (!prompt.trim()) newErrors.prompt = '请输入提示词';
    if (!result.trim()) newErrors.result = '请输入结果';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    createAiLog({
      title: title.trim(),
      tool,
      prompt: prompt.trim(),
      result: result.trim(),
      status,
      lesson: lesson.trim() || undefined,
    });

    resetForm();
    onCreated();
  }

  function clearError(field: string) {
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  }

  return (
    <form className="log-form" onSubmit={handleSubmit}>
      <div className="log-form-row">
        <div className="log-form-field">
          <label htmlFor="log-title">标题 *</label>
          <input
            id="log-title"
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); clearError('title'); }}
            placeholder="例如：用 Claude 写排序函数"
          />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>
        <div className="log-form-field">
          <label htmlFor="log-tool">工具</label>
          <select id="log-tool" value={tool} onChange={(e) => setTool(e.target.value as AiLogTool)}>
            <option value="claude">Claude</option>
            <option value="codex">Codex</option>
            <option value="other">其他</option>
          </select>
        </div>
        <div className="log-form-field">
          <label htmlFor="log-status">状态</label>
          <select id="log-status" value={status} onChange={(e) => setStatus(e.target.value as AiLogStatus)}>
            <option value="success">成功</option>
            <option value="partial">部分成功</option>
            <option value="failed">失败</option>
          </select>
        </div>
      </div>
      <div className="log-form-row log-form-row-single">
        <div className="log-form-field">
          <label htmlFor="log-prompt">提示词 *</label>
          <textarea
            id="log-prompt"
            value={prompt}
            onChange={(e) => { setPrompt(e.target.value); clearError('prompt'); }}
            placeholder="输入你给 AI 的提示词..."
            rows={3}
          />
          {errors.prompt && <span className="field-error">{errors.prompt}</span>}
        </div>
      </div>
      <div className="log-form-row log-form-row-single">
        <div className="log-form-field">
          <label htmlFor="log-result">结果 *</label>
          <textarea
            id="log-result"
            value={result}
            onChange={(e) => { setResult(e.target.value); clearError('result'); }}
            placeholder="AI 的输出结果或你的执行结果..."
            rows={3}
          />
          {errors.result && <span className="field-error">{errors.result}</span>}
        </div>
      </div>
      <div className="log-form-row log-form-row-single">
        <div className="log-form-field">
          <label htmlFor="log-lesson">经验教训</label>
          <textarea
            id="log-lesson"
            value={lesson}
            onChange={(e) => setLesson(e.target.value)}
            placeholder="可选：这次学到了什么..."
            rows={2}
          />
        </div>
      </div>
      <div className="log-form-actions">
        <button type="submit" className="log-form-submit">添加日志</button>
      </div>
    </form>
  );
}
