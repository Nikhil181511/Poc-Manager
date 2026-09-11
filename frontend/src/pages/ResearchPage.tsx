import React, { useState } from 'react'
import { Sparkles, Play, Search, ShieldAlert, Cpu } from 'lucide-react'

export default function ResearchPage() {
  const [topic, setTopic] = useState('')
  const [depth, setDepth] = useState('standard')

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>CrewAI Multi-Agent Research System</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight">Autonomous Internet Research</h2>
        <p className="text-slate-400 text-sm mt-1">
          Deploy a team of 5 AI agents to search the web, validate facts, and generate a comprehensive 17-section technical report.
        </p>
      </div>

      <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Research Topic or Technical Question
          </label>
          <textarea
            rows={3}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Compare LangChain, LlamaIndex, and Haystack for production RAG with latency benchmarks in 2026..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1 cursor-pointer hover:border-slate-700">
            <span className="text-xs font-semibold text-slate-300">Shallow Overview</span>
            <p className="text-xs text-slate-500">Quick 3-agent scan, executive takeaways (~45 sec).</p>
          </div>
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1 cursor-pointer">
            <span className="text-xs font-semibold text-amber-400">Standard Deep Dive</span>
            <p className="text-xs text-slate-400">Full 5-agent workflow with fact-checking (~2 min).</p>
          </div>
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1 cursor-pointer hover:border-slate-700">
            <span className="text-xs font-semibold text-slate-300">Exhaustive Comparison</span>
            <p className="text-xs text-slate-500">Multi-source cross-validation & benchmark tables (~4 min).</p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold px-6 py-3 rounded-xl text-sm transition shadow-lg shadow-amber-500/10">
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Launch Research Crew</span>
          </button>
        </div>
      </div>
    </div>
  )
}
