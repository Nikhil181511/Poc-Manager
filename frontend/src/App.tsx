import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FolderGit2, 
  Sparkles, 
  MessageSquareText, 
  ShieldCheck, 
  Settings,
  Flame
} from 'lucide-react'

// Placeholder page imports
import DashboardPage from './pages/DashboardPage'
import POCListPage from './pages/POCListPage'
import ResearchPage from './pages/ResearchPage'
import KnowledgeChatPage from './pages/KnowledgeChatPage'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-100">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 flex flex-col">
        <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide">POC Platform</h1>
            <p className="text-xs text-slate-400">AI Intelligence & Research</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 text-sm">
          <Link to="/dashboard" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition">
            <LayoutDashboard className="w-4 h-4 text-indigo-400" />
            <span>Dashboard</span>
          </Link>
          <Link to="/pocs" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition">
            <FolderGit2 className="w-4 h-4 text-emerald-400" />
            <span>POC Management</span>
          </Link>
          <Link to="/research" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Research</span>
          </Link>
          <Link to="/chat" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition">
            <MessageSquareText className="w-4 h-4 text-cyan-400" />
            <span>Knowledge Chat</span>
          </Link>
          <div className="pt-4 border-t border-slate-800 my-2">
            <Link to="/admin" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Administration</span>
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
          v1.0.0 • 4-Module Enterprise
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-950 p-8">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pocs" element={<POCListPage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/chat" element={<KnowledgeChatPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
