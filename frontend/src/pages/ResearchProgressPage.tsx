import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Terminal, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  ArrowRight,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { researchService } from '../services/researchService';
import { useResearchStore, ResearchLogEvent } from '../stores/researchStore';

const AGENT_STEPS = [
  { key: 'PLANNING', name: 'Planning Agent', label: 'Formulate Research Plan' },
  { key: 'SEARCHING', name: 'Discovery Agent', label: 'Discover Authoritative Sources' },
  { key: 'ANALYZING', name: 'Analysis Agent', label: 'Extract Technical Insights' },
  { key: 'VALIDATING', name: 'Validation Agent', label: 'Cross-Reference & Fact Check' },
  { key: 'COMPLETED', name: 'Report Writer', label: 'Synthesize 17-Section Report' }
];

export default function ResearchProgressPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [jobStatus, setJobStatus] = useState<string>('PLANNING');
  const [progress, setProgress] = useState<number>(10);
  const [currentTask, setCurrentTask] = useState<string>('Initializing autonomous agents...');
  const [currentAgent, setCurrentAgent] = useState<string>('Planning Agent');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { events, addEvent } = useResearchStore();
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;

    // Connect to Server-Sent Events (SSE) Stream
    const eventSource = researchService.getEventSource(id);

    eventSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.message) {
          const newEvent: ResearchLogEvent = {
            timestamp: data.timestamp || new Date().toISOString(),
            agent: data.agent,
            task: data.task,
            status: data.status,
            progress: data.progress,
            message: data.message
          };
          addEvent(newEvent);

          if (data.status) setJobStatus(data.status);
          if (data.progress !== undefined) setProgress(data.progress);
          if (data.agent) setCurrentAgent(data.agent);
          if (data.task) setCurrentTask(data.task);

          if (data.status === 'COMPLETED') {
            eventSource.close();
            // Small delay to allow user to view final progress before redirect
            setTimeout(() => {
              navigate(`/research/report/${id}`);
            }, 1500);
          } else if (data.status === 'FAILED') {
            setErrorMsg(data.message || 'Execution failed.');
            eventSource.close();
          }
        }
      } catch (err) {
        console.error('SSE parse error:', err);
      }
    };

    eventSource.onerror = () => {
      // Fallback polling if SSE disconnects
      const interval = setInterval(async () => {
        try {
          const res = await researchService.getProgress(id);
          setJobStatus(res.status);
          setProgress(res.progress);
          if (res.current_agent) setCurrentAgent(res.current_agent);
          if (res.current_task) setCurrentTask(res.current_task);

          if (res.status === 'COMPLETED') {
            clearInterval(interval);
            navigate(`/research/report/${id}`);
          }
        } catch (e) {
          console.error(e);
        }
      }, 3000);

      return () => clearInterval(interval);
    };

    return () => {
      eventSource.close();
    };
  }, [id, navigate, addEvent]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Active Research Workflow</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Multi-Agent Intelligence in Progress</h2>
          <p className="text-slate-400 text-xs mt-0.5">Job ID: {id}</p>
        </div>

        {jobStatus === 'COMPLETED' ? (
          <button 
            onClick={() => navigate(`/research/report/${id}`)}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
          >
            <span>View Final Report</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs text-slate-300">
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            <span>Autonomous Execution Active</span>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Progress Bar & Current Task */}
      <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2">
            <Bot className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-200">{currentAgent}:</span>
            <span className="text-slate-400">{currentTask}</span>
          </div>
          <span className="font-bold text-amber-400 text-base">{progress}%</span>
        </div>

        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-400 transition-all duration-500 rounded-full"
            style={{ width: `${Math.max(progress, 5)}%` }}
          />
        </div>

        {/* Step Progression Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 pt-3">
          {AGENT_STEPS.map((step, idx) => {
            const isCompleted = progress >= (idx + 1) * 20;
            const isCurrent = progress < (idx + 1) * 20 && progress >= idx * 20;

            return (
              <div 
                key={step.key} 
                className={`p-3 rounded-xl border text-xs transition ${
                  isCompleted 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                    : isCurrent 
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center space-x-1.5 font-semibold mb-1">
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : isCurrent ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-slate-600" />
                  )}
                  <span>{step.name}</span>
                </div>
                <p className="text-[11px] opacity-80">{step.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Terminal Event Console */}
      <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 font-mono shadow-2xl">
        <div className="flex items-center space-x-2 text-xs text-slate-400 pb-2 border-b border-slate-800">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-300">Crew Execution Stream & Agent Logs</span>
        </div>

        <div className="h-64 overflow-y-auto space-y-2 text-xs text-slate-300 pr-2">
          {events.length === 0 ? (
            <div className="text-slate-600 italic">Waiting for agent heartbeat signals...</div>
          ) : (
            events.map((ev, i) => (
              <div key={i} className="flex space-x-2 items-start">
                <span className="text-slate-600 text-[10px]">
                  {new Date(ev.timestamp).toLocaleTimeString()}
                </span>
                <span className="text-indigo-400 font-semibold">[{ev.agent || 'Agent'}]</span>
                <span className="text-slate-200">{ev.message}</span>
              </div>
            ))
          )}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
}
