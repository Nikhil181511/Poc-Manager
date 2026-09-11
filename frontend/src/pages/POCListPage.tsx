import React from 'react'
import { Plus, Search, Filter } from 'lucide-react'

export default function POCListPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">POC Management</h2>
          <p className="text-slate-400 text-sm">Create, filter, and track technical Proof of Concept lifecycle.</p>
        </div>
        <button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          <Plus className="w-4 h-4" />
          <span>New POC</span>
        </button>
      </div>

      <div className="flex space-x-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input 
            type="text" 
            placeholder="Search POCs by code, title, or technology stack..." 
            className="w-full bg-slate-900/60 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <button className="flex items-center space-x-2 bg-slate-900 border border-slate-800 text-slate-300 px-3 py-2 rounded-lg text-sm">
          <Filter className="w-4 h-4" />
          <span>Filter</span>
        </button>
      </div>

      <div className="p-12 text-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-sm">
        Module 1: POC list and filtering views will be rendered here.
      </div>
    </div>
  )
}
