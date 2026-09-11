import React from 'react'
import { FolderGit2, Sparkles, MessageSquareText, ShieldCheck, ArrowUpRight } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Executive Dashboard</h2>
        <p className="text-slate-400 text-sm">Real-time telemetry across POC lifecycle, autonomous research jobs, and knowledge base.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Total Active POCs</span>
            <FolderGit2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold mt-2">18</div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center">
            <span>+3 new this month</span>
          </div>
        </div>

        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Research Reports</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold mt-2">42</div>
          <div className="text-xs text-amber-400 mt-1 flex items-center">
            <span>CrewAI Orchestrated</span>
          </div>
        </div>

        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>Indexed Documents</span>
            <MessageSquareText className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold mt-2">128</div>
          <div className="text-xs text-cyan-400 mt-1 flex items-center">
            <span>pgvector embeddings</span>
          </div>
        </div>

        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span>System Status</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold mt-2 text-emerald-400">100%</div>
          <div className="text-xs text-slate-500 mt-1">
            <span>RBAC & Vector Isolation</span>
          </div>
        </div>
      </div>

      {/* Module Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-xl">
          <h3 className="font-semibold text-base mb-2 flex items-center justify-between">
            <span>Module 2: Multi-Agent Research</span>
            <span className="text-xs px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20">Your Role</span>
          </h3>
          <p className="text-slate-400 text-sm mb-4">
            Autonomous 5-agent CrewAI research workflow with real-time SSE progress streaming and verified fact-checking.
          </p>
          <a href="/research" className="inline-flex items-center text-sm text-indigo-400 hover:text-indigo-300 font-medium">
            Launch Research Workspace <ArrowUpRight className="w-4 h-4 ml-1" />
          </a>
        </div>

        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-xl">
          <h3 className="font-semibold text-base mb-2 flex items-center justify-between">
            <span>Module 3: RAG Knowledge Chat</span>
            <span className="text-xs px-2 py-0.5 bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20">LangChain</span>
          </h3>
          <p className="text-slate-400 text-sm mb-4">
            Grounded citation-backed conversational search across all historical POCs and architecture specifications.
          </p>
          <a href="/chat" className="inline-flex items-center text-sm text-indigo-400 hover:text-indigo-300 font-medium">
            Open Knowledge Chat <ArrowUpRight className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>
    </div>
  )
}
