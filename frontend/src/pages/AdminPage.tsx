import React from 'react'
import { ShieldCheck, Users, Activity, Settings } from 'lucide-react'

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Platform Administration</h2>
        <p className="text-slate-400 text-sm">Manage user roles, team workspaces, system health, and audit logs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center space-x-2 text-purple-400">
            <Users className="w-5 h-5" />
            <h3 className="font-semibold text-white">Users & Roles</h3>
          </div>
          <p className="text-xs text-slate-400">Manage 7 RBAC roles and permissions.</p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Activity className="w-5 h-5" />
            <h3 className="font-semibold text-white">Audit Logs</h3>
          </div>
          <p className="text-xs text-slate-400">Review mutation logs and access trails.</p>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center space-x-2 text-indigo-400">
            <Settings className="w-5 h-5" />
            <h3 className="font-semibold text-white">System Config</h3>
          </div>
          <p className="text-xs text-slate-400">LLM providers, embeddings, and vector DB.</p>
        </div>
      </div>
    </div>
  )
}
