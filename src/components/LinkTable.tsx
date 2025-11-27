import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Trash2, ExternalLink, BarChart2, Check, Search, Link2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { api } from '../lib/api';

export interface LinkData {
    id: number;
    short_code: string;
    original_url: string;
    click_count: number;
    last_clicked_at: string | null;
    created_at: string;
}

interface LinkListProps {
    links: LinkData[];
    fetchLinks: () => void;
}

const LinkList = ({ links, fetchLinks }: LinkListProps) => {
    const [search, setSearch] = useState<string>('');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const filteredLinks = links.filter(link =>
        link.short_code.toLowerCase().includes(search.toLowerCase()) ||
        link.original_url.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (code: string) => {
        if (!window.confirm('Are you sure you want to delete this link?')) return;
        try {
            await api.deleteLink(code);
            fetchLinks();
        } catch (err) {
            alert('Failed to delete link');
        }
    };

    const handleCopy = (code: string) => {
        let fullUrl = '';

        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            fullUrl = `http://localhost:3000/${code}`;
        } else {
            fullUrl = `${window.location.origin}/${code}`;
        }

        navigator.clipboard.writeText(fullUrl);
        setCopiedId(code);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
            <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-gray-100/50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="font-bold text-xl text-gray-800">Your Links</h2>
                        <p className="text-sm text-gray-500 mt-0.5">{links.length} total links</p>
                    </div>
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search links..."
                            className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="text-xs font-semibold text-gray-600 uppercase bg-gray-50/50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left">Short Code</th>
                            <th className="px-6 py-4 text-left">Original URL</th>
                            <th className="px-6 py-4 text-center">Clicks</th>
                            <th className="px-6 py-4 text-left">Last Clicked</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredLinks.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-16 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="p-4 bg-gray-100 rounded-full">
                                            <Link2 className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-500 font-medium">No links found</p>
                                        <p className="text-sm text-gray-400">Create your first shortened link above!</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredLinks.map((link) => (
                                <tr key={link.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <Link
                                            to={`/code/${link.short_code}`}
                                            className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 hover:text-indigo-700 group"
                                        >
                                            <span className="font-mono">{link.short_code}</span>
                                            <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 max-w-sm">
                                        <div className="truncate text-gray-600 hover:text-gray-900" title={link.original_url}>
                                            {link.original_url}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                                            {link.click_count}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        {link.last_clicked_at
                                            ? formatDistanceToNow(new Date(link.last_clicked_at), { addSuffix: true })
                                            : <span className="text-gray-400">Never</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-1">
                                            <button
                                                onClick={() => handleCopy(link.short_code)}
                                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                                                title="Copy Short Link"
                                            >
                                                {copiedId === link.short_code ?
                                                    <Check className="h-4 w-4 text-green-600" /> :
                                                    <Copy className="h-4 w-4" />
                                                }
                                            </button>
                                            <Link
                                                to={`/code/${link.short_code}`}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                                title="View Stats"
                                            >
                                                <BarChart2 className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(link.short_code)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LinkList;