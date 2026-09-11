import React from 'react'
import { MessageSquareText, Send, Sparkles, Layers } from 'lucide-react'

export default function KnowledgeChatPage() {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight">RAG Knowledge Chat</h2>
          <p className="text-slate-400 text-xs">Query organizational POC records and documents with grounded citations.</p>
        </div>
        <div className="flex items-center space-x-2 text-xs bg-slate-900 border border-slate-800 rounded-lg p-1">
          <span className="px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded font-medium">Organization Mode</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-slate-900/30 border border-slate-800 rounded-2xl flex flex-col justify-center items-center text-center text-slate-500">
        <MessageSquareText className="w-10 h-10 text-slate-700 mb-3" />
        <p className="text-sm font-medium text-slate-400">Ask any question about past POC experiments and architectures</p>
        <p className="text-xs text-slate-600 mt-1 max-w-sm">
          "What were the evaluation results of our FastEmbed POC?" or "Compare the databases evaluated in previous projects."
        </p>
      </div>

      <div className="relative">
        <input 
          type="text" 
          placeholder="Ask a technical question..."
          className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-4 pr-12 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
        <button className="absolute right-2 top-2 p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
