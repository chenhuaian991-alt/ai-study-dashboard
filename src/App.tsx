import './App.css'
import { TaskBoard } from './features/tasks/TaskBoard'
import { LogPanel } from './features/logs/LogPanel'
import { ReviewPanel } from './features/reviews/ReviewPanel'
import { BackupPanel } from './features/backup/BackupPanel'

function App() {
  return (
    <>
      <header className="app-header">
        <h1>AI Study Dashboard</h1>
        <p>本地 AI 学习任务管家</p>
      </header>

      <section className="section">
        <TaskBoard />
      </section>

      <section className="section">
        <LogPanel />
      </section>

      <section className="section">
        <ReviewPanel />
      </section>

      <footer className="footer">
        <BackupPanel />
      </footer>
    </>
  )
}

export default App
