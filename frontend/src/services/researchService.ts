import axios from 'axios';
import { ResearchJob, ResearchReport } from '../types/research';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const researchService = {
  createJob: async (data: { topic: string; depth?: string; source_preferences?: string[] }): Promise<ResearchJob> => {
    const res = await axios.post(`${API_BASE_URL}/research`, data);
    return res.data;
  },

  getJob: async (jobId: string): Promise<ResearchJob> => {
    const res = await axios.get(`${API_BASE_URL}/research/${jobId}`);
    return res.data;
  },

  getProgress: async (jobId: string) => {
    const res = await axios.get(`${API_BASE_URL}/research/${jobId}/progress`);
    return res.data;
  },

  getReport: async (reportOrJobId: string): Promise<ResearchReport> => {
    const res = await axios.get(`${API_BASE_URL}/reports/${reportOrJobId}`);
    return res.data;
  },

  saveToKnowledgeBase: async (reportId: string) => {
    const res = await axios.post(`${API_BASE_URL}/reports/${reportId}/save-to-knowledge`);
    return res.data;
  },

  getEventSource: (jobId: string): EventSource => {
    return new EventSource(`${API_BASE_URL}/research/${jobId}/events`);
  }
};
