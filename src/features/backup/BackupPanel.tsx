import { useRef, useState } from 'react';
import { exportBackup, importBackup } from '../../utils/backup';

export function BackupPanel() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [jsonText, setJsonText] = useState<string | null>(null);

  function handleExport() {
    const json = exportBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-study-dashboard-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage('备份已导出');
  }

  async function handleCopy() {
    const json = exportBackup();
    try {
      await navigator.clipboard.writeText(json);
      setMessage('备份 JSON 已复制');
      setJsonText(null);
    } catch {
      setMessage('复制失败，请手动复制下方内容');
      setJsonText(json);
    }
  }

  function handleShow() {
    setJsonText(exportBackup());
    setMessage(null);
  }

  function handleImport() {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setMessage('请先选择一个 .json 文件');
      return;
    }

    if (!window.confirm('导入会覆盖当前所有数据（任务、日志、复盘），确定继续吗？')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const result = importBackup(text);
      if (result.ok) {
        setMessage('导入成功，正在刷新页面...');
        setTimeout(() => window.location.reload(), 800);
      } else {
        setMessage(`导入失败：${result.message}`);
      }
    };
    reader.onerror = () => {
      setMessage('文件读取失败');
    };
    reader.readAsText(file);
  }

  return (
    <div className="backup-panel">
      <h3 className="backup-title">数据备份</h3>
      <div className="backup-actions">
        <button type="button" className="backup-btn" onClick={handleExport}>
          导出备份
        </button>
        <button type="button" className="backup-btn" onClick={handleCopy}>
          复制备份 JSON
        </button>
        <button type="button" className="backup-btn" onClick={handleShow}>
          显示备份 JSON
        </button>
        <span className="backup-sep">|</span>
        <label className="backup-file-label">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="backup-file-input"
          />
        </label>
        <button type="button" className="backup-btn" onClick={handleImport}>
          导入备份
        </button>
      </div>
      <p className="backup-hint">导入会覆盖当前所有数据，请先导出备份再操作</p>
      {message && <p className="backup-message">{message}</p>}
      {jsonText && (
        <textarea
          className="backup-textarea"
          value={jsonText}
          readOnly
          onClick={(e) => (e.target as HTMLTextAreaElement).select()}
        />
      )}
    </div>
  );
}
