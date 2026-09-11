import { create } from 'zustand';
import { ResearchJob, ResearchReport } from '../types/research';

export interface ResearchLogEvent {
  timestamp: string;
  agent?: string;
  task?: string;
  status?: string;
  progress?: number;
  message?: string;
}

interface ResearchState {
  currentJob: ResearchJob | null;
  currentReport: ResearchReport | null;
  events: ResearchLogEvent[];
  isLoading: boolean;
  error: string | null;
  setCurrentJob: (job: ResearchJob | null) => void;
  setCurrentReport: (report: ResearchReport | null) => void;
  addEvent: (event: ResearchLogEvent) => void;
  clearEvents: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useResearchStore = create<ResearchState>((set) => ({
  currentJob: null,
  currentReport: null,
  events: [],
  isLoading: false,
  error: null,
  setCurrentJob: (job) => set({ currentJob: job }),
  setCurrentReport: (report) => set({ currentReport: report }),
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  clearEvents: () => set({ events: [] }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
