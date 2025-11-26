// src/types.ts

export interface LinkData {
    id: number;
    short_code: string;
    original_url: string;
    click_count: number;
    created_at: string;
    last_clicked_at: string | null;
}

export interface CreateLinkPayload {
    url: string;
    shortCode?: string;
}

export interface ApiError {
    error: string;
}