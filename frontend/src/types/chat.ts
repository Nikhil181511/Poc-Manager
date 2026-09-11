export type ChatMode = 
  | 'ORGANIZATION'
  | 'POC_SPECIFIC'
  | 'DOCUMENT_SPECIFIC'
  | 'CATEGORY_SPECIFIC'
  | 'GENERAL_EXPLANATION';

export interface Citation {
  poc_code: string;
  poc_title: string;
  document_name?: string;
  section?: string;
  page?: number;
  similarity_score?: number;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  retrieved_sources?: Citation[];
  token_usage?: any;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  mode: ChatMode;
  poc_id?: string;
  document_id?: string;
  category?: string;
  created_at: string;
  updated_at: string;
}
