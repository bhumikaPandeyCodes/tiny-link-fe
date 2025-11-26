// src/api.ts
import axios from 'axios';
import type { LinkData, CreateLinkPayload } from './types';

const API_BASE_URL = 'http://localhost:3000/api';

export const api = {
    getLinks: () => axios.get<LinkData[]>(`${API_BASE_URL}/links`),
    createLink: (data: CreateLinkPayload) => axios.post<LinkData>(`${API_BASE_URL}/links`, data),
    getStats: (code: string) => axios.get<LinkData>(`${API_BASE_URL}/links/${code}`),
    deleteLink: (code: string) => axios.delete(`${API_BASE_URL}/links/${code}`),
};