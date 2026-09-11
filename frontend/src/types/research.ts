export type ResearchStatus = 
  | 'CREATED'
  | 'QUEUED'
  | 'PLANNING'
  | 'SEARCHING'
  | 'COLLECTING_SOURCES'
  | 'ANALYZING'
  | 'VALIDATING'
  | 'GENERATING_REPORT'
  | 'SAVING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export interface ResearchJob {
  id: string;
  user_id: string;
  topic: string;
  research_type: string;
  depth: string;
  date_range: string;
  source_preferences?: string[];
  status: ResearchStatus;
  progress: number;
  current_agent?: string;
  current_task?: string;
  error_message?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface ResearchSource {
  id: string;
  title: string;
  url: string;
  domain: string;
  source_type: string;
  published_date?: string;
  relevance_score: number;
  summary?: string;
  verification_status: 'VERIFIED' | 'UNVERIFIED' | 'REJECTED';
}

export interface ResearchFinding {
  id: string;
  question: string;
  finding: string;
  evidence: string;
  source_ids: string[];
  confidence: number;
  validation_status: 'VALIDATED' | 'UNCERTAIN' | 'DISPUTED';
}

export interface ResearchReport {
  id: string;
  research_job_id: string;
  title: string;
  executive_summary: string;
  content_markdown: string;
  report_type: string;
  status: string;
  version: number;
  saved_to_knowledge_base: boolean;
  sources?: ResearchSource[];
  findings?: ResearchFinding[];
  created_at: string;
  updated_at: string;
}
