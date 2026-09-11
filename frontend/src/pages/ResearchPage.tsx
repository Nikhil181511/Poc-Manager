import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Play, Search, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { researchService } from '../services/researchService';
import { useResearchStore } from '../stores/researchStore';

const EXAMPLE_TOPICS = [
  "Compare LangChain, LlamaIndex, and Haystack for production RAG in 2026",
  "Evaluate pgvector vs Qdrant for 10M vector enterprise similarity search",
  "Emerging AI Agent orchestration frameworks: CrewAI vs AutoGen vs LangGraph",
  "State of Document Intelligence and OCR models for unstructured PDFs"
];

export default function ResearchPage() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [depth, setDepth] = useState('standard');
  const [selectedSources, setSelectedSources] = useState<string[]>(['official_docs', 'github_repo', 'technical_blog']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { setCurrentJob, clearEvents } = useResearchStore();

  const handleSourceToggle = (source: string) => {
    if (selectedSources.includes(source)) {
      setSelectedSources(selectedSources.filter(s => s !== source));
    } else {
      setSelectedSources([...selectedSources, source]);
    }
  };

  const handleLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setErrorMsg('Please enter a research topic.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    clearEvents();

    try {
      const job = await researchService.createJob({
        topic: topic.trim(),
        depth,
        source_preferences: selectedSources
      });
      setCurrentJob(job);
      navigate(`/research/progress/${job.id}`);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.detail || err.message || 'Failed to start research job.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>CrewAI Multi-Agent Research System</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight">Autonomous Internet Research Workspace</h2>
        <p className="text-slate-400 text-sm mt-1">
          Deploy a team of 5 AI agents to search the web, validate technical claims, and generate a verified 17-section report.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleLaunch} className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-6 shadow-xl">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Research Topic or Technical Question
          </label>
          <textarea
            rows={3}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Compare LangChain, LlamaIndex, and Haystack for production RAG with latency benchmarks..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition"
          />
        </div>

        {/* Quick Presets */}
        <div>
          <span className="text-xs text-slate-500 font-medium block mb-2">Suggested Topics:</span>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_TOPICS.map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setTopic(t)}
                className="text-xs bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg text-left transition"
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Research Depth */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Research Depth & Scope
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              onClick={() => setDepth('shallow')}
              className={`p-4 rounded-xl space-y-1 cursor-pointer border transition ${
                depth === 'shallow' 
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' 
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold">Shallow Overview</span>
                {depth === 'shallow' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
              </div>
              <p className="text-xs text-slate-500">Quick scan, 3 sources, executive takeaways (~45 sec).</p>
            </div>

            <div 
              onClick={() => setDepth('standard')}
              className={`p-4 rounded-xl space-y-1 cursor-pointer border transition ${
                depth === 'standard' 
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' 
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold">Standard Deep Dive</span>
                {depth === 'standard' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
              </div>
              <p className="text-xs text-slate-500">Full 5-agent workflow with fact-checking (~2 min).</p>
            </div>

            <div 
              onClick={() => setDepth('deep')}
              className={`p-4 rounded-xl space-y-1 cursor-pointer border transition ${
                depth === 'deep' 
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' 
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold">Exhaustive Comparison</span>
                {depth === 'deep' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
              </div>
              <p className="text-xs text-slate-500">Cross-validation, benchmark tables & risks (~4 min).</p>
            </div>
          </div>
        </div>

        {/* Source Preferences */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Target Sources
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'official_docs', label: 'Official Documentation' },
              { id: 'github_repo', label: 'GitHub Repositories' },
              { id: 'technical_blog', label: 'Engineering Blogs' },
              { id: 'academic_paper', label: 'ArXiv / Academic' }
            ].map((src) => {
              const active = selectedSources.includes(src.id);
              return (
                <button
                  key={src.id}
                  type="button"
                  onClick={() => handleSourceToggle(src.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                    active 
                      ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300' 
                      : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  {src.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold px-6 py-3 rounded-xl text-sm transition shadow-lg shadow-amber-500/10 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>{isSubmitting ? 'Starting Crew...' : 'Launch Research Crew'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
