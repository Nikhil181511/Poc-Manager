import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { 
  Sparkles, 
  Download, 
  Copy, 
  BookmarkCheck, 
  Globe, 
  ShieldCheck, 
  ArrowLeft,
  Check,
  CheckCircle2,
  ExternalLink,
  Layers
} from 'lucide-react';
import { researchService } from '../services/researchService';
import { ResearchReport } from '../types/research';

export default function ResearchReportPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<ResearchReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'report' | 'sources' | 'findings'>('report');

  useEffect(() => {
    if (!id) return;
    const fetchReport = async () => {
      setIsLoading(true);
      try {
        const data = await researchService.getReport(id);
        setReport(data);
        setIsSaved(data.saved_to_knowledge_base);
      } catch (err) {
        console.error('Failed to load report:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const handleCopy = () => {
    if (!report) return;
    navigator.clipboard.writeText(report.content_markdown);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!report) return;
    const element = document.createElement('a');
    const file = new Blob([report.content_markdown], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${report.title.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSaveToKB = async () => {
    if (!report) return;
    try {
      await researchService.saveToKnowledgeBase(report.id);
      setIsSaved(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Sparkles className="w-8 h-8 animate-spin text-amber-400" />
        <p className="text-slate-400 text-sm">Loading verified research intelligence...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-slate-400 text-sm">Research report could not be found.</p>
        <button onClick={() => navigate('/research')} className="text-indigo-400 text-sm hover:underline">
          Return to Research Workspace
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="space-y-1">
          <button 
            onClick={() => navigate('/research')} 
            className="inline-flex items-center text-xs text-slate-400 hover:text-slate-200 transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Back to Research Workspace</span>
          </button>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full">
              17-Section Verified Report
            </span>
            <span className="text-xs text-slate-500">
              {new Date(report.created_at).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-100">{report.title}</h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 px-3 py-2 rounded-xl text-xs font-medium transition"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Copied' : 'Copy Markdown'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 px-3 py-2 rounded-xl text-xs font-medium transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export .md</span>
          </button>

          <button
            onClick={handleSaveToKB}
            disabled={isSaved}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
              isSaved 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'Saved to Knowledge Base' : 'Save to Knowledge Base'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('report')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === 'report'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Research Report
        </button>
        <button
          onClick={() => setActiveTab('sources')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition flex items-center space-x-1.5 ${
            activeTab === 'sources'
              ? 'border-indigo-400 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Discovered Sources</span>
          <span className="px-1.5 py-0.2 bg-slate-800 text-[10px] rounded-full">
            {report.sources?.length || 0}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('findings')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition flex items-center space-x-1.5 ${
            activeTab === 'findings'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Validated Claims</span>
          <span className="px-1.5 py-0.2 bg-slate-800 text-[10px] rounded-full">
            {report.findings?.length || 0}
          </span>
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'report' && (
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <div className="p-6 bg-gradient-to-br from-slate-900/90 to-slate-900/40 border border-slate-800 rounded-2xl space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Executive Takeaways
            </span>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {report.executive_summary}
            </p>
          </div>

          {/* Full Markdown Report */}
          <div className="p-8 bg-slate-900/30 border border-slate-800 rounded-2xl prose prose-invert prose-indigo max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h2:border-b prose-h2:border-slate-800 prose-h2:pb-2 prose-p:text-slate-300 prose-p:leading-relaxed prose-li:text-slate-300 prose-table:border-collapse prose-th:bg-slate-950 prose-th:p-3 prose-td:p-3 prose-td:border-b prose-td:border-slate-800">
            <ReactMarkdown>{report.content_markdown}</ReactMarkdown>
          </div>
        </div>
      )}

      {activeTab === 'sources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.sources?.map((s, i) => (
            <div key={i} className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">
                  {s.source_type.replace('_', ' ')}
                </span>
                <span className="text-[11px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                  {s.verification_status}
                </span>
              </div>
              <h4 className="font-semibold text-sm text-slate-100 line-clamp-2">{s.title}</h4>
              <p className="text-xs text-slate-500">{s.domain}</p>
              <a 
                href={s.url} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center text-xs text-indigo-400 hover:text-indigo-300 pt-1"
              >
                <span>Visit Source</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'findings' && (
        <div className="space-y-4">
          {report.findings?.map((f, i) => (
            <div key={i} className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-amber-400">Claim & Finding #{i + 1}</span>
                <span className="text-xs px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full">
                  Confidence: {Math.round(f.confidence * 100)}%
                </span>
              </div>
              <h4 className="text-sm font-semibold text-slate-200">{f.question}</h4>
              <p className="text-xs text-slate-400">{f.finding}</p>
              {f.evidence && (
                <div className="p-3 bg-slate-950 rounded-lg text-xs text-slate-400 font-mono border border-slate-850">
                  <span className="text-slate-500 block mb-1">Evidence Snippet:</span>
                  {f.evidence}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
