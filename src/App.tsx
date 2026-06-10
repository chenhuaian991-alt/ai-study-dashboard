import { useState } from 'react'
import './App.css'
import { Dashboard } from './features/dashboard/Dashboard'
import { TaskBoard } from './features/tasks/TaskBoard'
import { LogPanel } from './features/logs/LogPanel'
import { ReviewPanel } from './features/reviews/ReviewPanel'
import { BackupPanel } from './features/backup/BackupPanel'

type Tab = 'dashboard' | 'manage'

function App() {
  const [tab, setTab] = useState<Tab>('dashboard')

  return (
    <>
      <header className="app-header">
        <h1>AI Study Dashboard</h1>
        <p>本地 AI 学习任务管家</p>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-tab ${tab === 'dashboard' ? 'nav-tab--active' : ''}`}
          onClick={() => setTab('dashboard')}
        >
          首页概览
        </button>
        <button
          className={`nav-tab ${tab === 'manage' ? 'nav-tab--active' : ''}`}
          onClick={() => setTab('manage')}
        >
          任务管理
        </button>
      </nav>

      {tab === 'dashboard' && <Dashboard />}

      {tab === 'manage' && (
        <>
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
      )}
    </>
  )
}

export default App
