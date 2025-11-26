import axios from 'axios';
import type { LinkData, CreateLinkPayload } from './types';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: `${BACKEND_URL}/api`,
});

export const apiCalls = {
    getLinks: () => api.get<LinkData[]>('/links'),
    createLink: (data: CreateLinkPayload) => api.post<LinkData>('/links', data),
    getStats: (code: string) => api.get<LinkData>(`/links/${code}`),
    deleteLink: (code: string) => api.delete(`/links/${code}`),
};

export { apiCalls as api };