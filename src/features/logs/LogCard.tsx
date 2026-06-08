import type { AiLog } from '../../types';

const toolLabel: Record<string, string> = {
  claude: 'Claude',
  codex: 'Codex',
  other: '其他',
};

const statusLabel: Record<string, string> = {
  success: '成功',
  partial: '部分成功',
  failed: '失败',
};

interface LogCardProps {
  log: AiLog;
  onDeleteLog: (id: string, title: string) => void;
}

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + '...' : text;
}

export function LogCard({ log, onDeleteLog }: LogCardProps) {
  const dateStr = new Date(log.createdAt).toLocaleDateString('zh-CN');

  return (
    <div className={`log-card status-${log.status}`}>
      <div className="log-card-header">
        <span className="log-title">{log.title}</span>
        <span className={`log-status-badge ${log.status}`}>
          {statusLabel[log.status]}
        </span>
      </div>
      <div className="log-meta">
        <span className="log-tool-badge">{toolLabel[log.tool]}</span>
        <span>{dateStr}</span>
      </div>
      <div className="log-body">
        <div className="log-field">
          <span className="log-field-label">Prompt</span>
          <p>{truncate(log.prompt, 120)}</p>
        </div>
        <div className="log-field">
          <span className="log-field-label">Result</span>
          <p>{truncate(log.result, 120)}</p>
        </div>
        {log.lesson && (
          <div className="log-field">
            <span className="log-field-label">Lesson</span>
            <p>{truncate(log.lesson, 120)}</p>
          </div>
        )}
      </div>
      <div className="log-card-actions">
        <button
          type="button"
          className="log-action-btn log-action-delete"
          onClick={() => onDeleteLog(log.id, log.title)}
        >
          删除
        </button>
      </div>
    </div>
  );
}
