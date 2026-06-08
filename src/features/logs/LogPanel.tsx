import { useState } from 'react';
import { LogForm } from './LogForm';
import { LogCard } from './LogCard';
import { getAiLogs, deleteAiLog } from './logStorage';

export function LogPanel() {
  const [logs, setLogs] = useState(getAiLogs);

  function refresh() {
    setLogs(getAiLogs());
  }

  function handleDeleteLog(id: string, title: string) {
    if (!window.confirm(`确认删除"${title}"吗？`)) return;
    deleteAiLog(id);
    refresh();
  }

  return (
    <div className="log-panel">
      <h2 className="log-panel-title">AI 编程日志</h2>
      <LogForm onCreated={refresh} />
      {logs.length === 0 ? (
        <div className="log-empty">还没有日志，使用上方表单添加第一条</div>
      ) : (
        <div className="log-list">
          {logs.map((log) => (
            <LogCard key={log.id} log={log} onDeleteLog={handleDeleteLog} />
          ))}
        </div>
      )}
    </div>
  );
}
