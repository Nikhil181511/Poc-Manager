export type POCStatus = 
  | 'Draft'
  | 'Planned'
  | 'In Progress'
  | 'On Hold'
  | 'Under Review'
  | 'Completed'
  | 'Successful'
  | 'Partially Successful'
  | 'Failed'
  | 'Archived'
  | 'Cancelled';

export type POCPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface POC {
  id: string;
  poc_code: string;
  title: string;
  short_description: string;
  detailed_description: string;
  business_problem: string;
  technical_problem: string;
  objective: string;
  scope: string;
  out_of_scope?: string;
  category: string;
  priority: POCPriority;
  status: POCStatus;
  owner_id: string;
  team_id: string;
  technology_stack: string[];
  architecture_details?: string;
  evaluation_criteria?: any;
  test_results?: string;
  performance_results?: string;
  cost_estimation?: string;
  scalability_findings?: string;
  security_findings?: string;
  limitations?: string;
  risks?: string;
  recommendations?: string;
  outcome?: string;
  production_readiness?: string;
  lessons_learned?: string;
  ai_summary?: string;
  start_date?: string;
  expected_end_date?: string;
  completed_date?: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface POCDocument {
  id: string;
  poc_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_url: string;
  version: number;
  description?: string;
  uploaded_by: string;
  processing_status: string;
  indexing_status: string;
  created_at: string;
}
