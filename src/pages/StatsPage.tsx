// src/pages/StatsPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { ArrowLeft, Clock, MousePointer, Globe, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import type { LinkData } from '../lib/types';

const StatsPage: React.FC = () => {
    const { code } = useParams<{ code: string }>();
    const [link, setLink] = useState<LinkData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        if (!code) return;

        const fetchStats = async () => {
            try {
                const res = await api.getStats(code);
                setLink(res.data);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [code]);

    if (loading) return <div className="text-center py-20">Loading stats...</div>;

    if (error || !link) return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-800">Link not found</h2>
            <Link to="/" className="text-indigo-600 hover:underline mt-4 inline-block">Return to Dashboard</Link>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
            <Link to="/" className="inline-flex items-center text-gray-500 hover:text-indigo-600 mb-6 transition">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
            </Link>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-8 border-b border-gray-200 text-center">
                    <h1 className="text-4xl font-extrabold text-indigo-600 tracking-tight mb-2">
                        /{link.short_code}
                    </h1>
                    <a
                        href={link.original_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-indigo-600 truncate max-w-lg mx-auto block"
                    >
                        {link.original_url}
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-gray-200">
                    <div className="p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition">
                        <MousePointer className="h-10 w-10 text-indigo-500 mb-3" />
                        <span className="text-3xl font-bold text-gray-900">{link.click_count}</span>
                        <span className="text-sm text-gray-500 uppercase tracking-wide font-medium">Total Clicks</span>
                    </div>

                    <div className="p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition">
                        <Clock className="h-10 w-10 text-emerald-500 mb-3" />
                        <span className="text-lg font-semibold text-gray-900">
                            {link.last_clicked_at
                                ? format(new Date(link.last_clicked_at), 'PPP p')
                                : 'Never clicked'}
                        </span>
                        <span className="text-sm text-gray-500 uppercase tracking-wide font-medium">Last Activity</span>
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-400 flex justify-between">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Created {format(new Date(link.created_at), 'PPP')}
                    </div>
                    <div className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        Public Link
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsPage;