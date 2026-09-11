import React from 'react'
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FolderGit2, 
  Sparkles, 
  MessageSquareText, 
  ShieldCheck, 
  Flame
} from 'lucide-react'

// Page imports
import DashboardPage from './pages/DashboardPage'
import POCListPage from './pages/POCListPage'
import ResearchPage from './pages/ResearchPage'
import ResearchProgressPage from './pages/ResearchProgressPage'
import ResearchReportPage from './pages/ResearchReportPage'
import KnowledgeChatPage from './pages/KnowledgeChatPage'
import AdminPage from './pages/AdminPage'

function App() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 antialiased font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-850 bg-slate-900/60 flex flex-col backdrop-blur-md">
        <div className="p-5 border-b border-slate-800/80 flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-tr from-amber-500 to-indigo-600 rounded-xl shadow-md">
            <Flame className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide text-slate-100">POC Intelligence</h1>
            <p className="text-[11px] text-slate-400">Enterprise AI Workspace</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 text-sm">
          <Link 
            to="/dashboard" 
            className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition ${
              isActive('/dashboard') 
                ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30' 
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-indigo-400" />
            <span>Dashboard</span>
          </Link>

          <Link 
            to="/pocs" 
            className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition ${
              isActive('/pocs') 
                ? 'bg-emerald-600/20 text-emerald-300 font-semibold border border-emerald-500/30' 
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
            }`}
          >
            <FolderGit2 className="w-4 h-4 text-emerald-400" />
            <span>POC Management</span>
          </Link>

          <Link 
            to="/research" 
            className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition ${
              isActive('/research') 
                ? 'bg-amber-600/20 text-amber-300 font-semibold border border-amber-500/30' 
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <div className="flex justify-between items-center w-full">
              <span>AI Research</span>
              <span className="text-[9px] px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded font-semibold">ROLE 2</span>
            </div>
          </Link>

          <Link 
            to="/chat" 
            className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition ${
              isActive('/chat') 
                ? 'bg-cyan-600/20 text-cyan-300 font-semibold border border-cyan-500/30' 
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
            }`}
          >
            <MessageSquareText className="w-4 h-4 text-cyan-400" />
            <span>Knowledge Chat</span>
          </Link>

          <div className="pt-4 border-t border-slate-800/80 my-2">
            <Link 
              to="/admin" 
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition ${
                isActive('/admin') 
                  ? 'bg-purple-600/20 text-purple-300 font-semibold border border-purple-500/30' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Administration</span>
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800/80 text-[11px] text-slate-500">
          CrewAI • LangChain • pgvector
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-950 p-8">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pocs" element={<POCListPage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/research/progress/:id" element={<ResearchProgressPage />} />
          <Route path="/research/report/:id" element={<ResearchReportPage />} />
          <Route path="/chat" element={<KnowledgeChatPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
