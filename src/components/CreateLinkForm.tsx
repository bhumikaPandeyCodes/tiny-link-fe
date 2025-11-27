import React, { useState } from 'react';
import type { FormEvent } from 'react'
import { api } from '../lib/api';
import { Plus, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

interface CreateLinkFormProps {
    onSuccess: () => void;
}

const CreateLinkForm: React.FC<CreateLinkFormProps> = ({ onSuccess }) => {
    const [url, setUrl] = useState<string>('');
    const [shortCode, setShortCode] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [status, setStatus] = useState<{ type: 'error' | 'success' | ''; msg: string }>({ type: '', msg: '' });

    const validate = (): string | null => {
        if (!url) return 'URL is required.';
        try {
            new URL(url);
        } catch (_) {
            return 'Please enter a valid URL (e.g., https://example.com).';
        }
        if (shortCode && !/^[A-Za-z0-9]{6,8}$/.test(shortCode)) {
            return 'Custom code must be 6-8 alphanumeric characters.';
        }
        return null;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStatus({ type: '', msg: '' });

        const error = validate();
        if (error) {
            setStatus({ type: 'error', msg: error });
            return;
        }

        setLoading(true);
        try {
            await api.createLink({ url, shortCode: shortCode || undefined });
            setStatus({ type: 'success', msg: 'Link created successfully!' });
            setUrl('');
            setShortCode('');
            onSuccess();
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 409) {
                setStatus({ type: 'error', msg: 'That short code is already taken. Please try another.' });
            } else {
                setStatus({ type: 'error', msg: 'Failed to create link. Please try again.' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Create New Link</h2>
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-start">
                <div className="flex-grow w-full">
                    <input
                        type="text"
                        placeholder="Paste long URL here (https://...)"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                        disabled={loading}
                    />
                </div>
                <div className="w-full md:w-48">
                    <input
                        type="text"
                        placeholder="Code (optional)"
                        value={shortCode}
                        onChange={(e) => setShortCode(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                        maxLength={8}
                        disabled={loading}
                    />
                    <p className="text-xs text-gray-400 mt-1">6-8 chars, alphanumeric</p>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition"
                >
                    {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    Shorten
                </button>
            </form>

            {status.msg && (
                <div className={`mt-4 p-3 rounded-md flex items-center gap-2 text-sm ${status.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                    }`}>
                    {status.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    {status.msg}
                </div>
            )}
        </div>
    );
};

export default CreateLinkForm;