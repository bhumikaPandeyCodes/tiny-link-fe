import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Trash2, ExternalLink, BarChart2, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { api } from '../lib/api';

// 1. Define the shape of the data coming from your DB
export interface LinkData {
    id: number;
    short_code: string;
    original_url: string;
    click_count: number;
    last_clicked_at: string | null;
    created_at: string;
}

// 2. Define the props expected by this component
interface LinkListProps {
    links: LinkData[];
    fetchLinks: () => void;
}

const LinkList = ({ links, fetchLinks }: LinkListProps) => {
    const [search, setSearch] = useState<string>('');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Filter logic
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

        // Check karein ki hum Localhost par hain ya Production par
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            // CASE 1: LOCALHOST
            // Hum seedha Backend ka port (3000) use karenge
            // Kyunki locally 'vercel.json' kaam nahi karta
            fullUrl = `http://localhost:3000/${code}`;
        } else {
            // CASE 2: PRODUCTION (Vercel)
            // Hum frontend ka hi URL use karenge
            // Kyunki wahan 'vercel.json' redirect handle kar lega
            fullUrl = `${window.location.origin}/${code}`;
        }

        navigator.clipboard.writeText(fullUrl);
        setCopiedId(code);
        setTimeout(() => setCopiedId(null), 2000);
    };



    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className="font-semibold text-gray-700">All Links ({links.length})</h2>
                <input
                    type="text"
                    placeholder="Search by code or URL..."
                    className="px-3 py-1.5 border border-gray-300 rounded text-sm w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3">Short Code</th>
                            <th className="px-6 py-3">Original URL</th>
                            <th className="px-6 py-3 text-center">Clicks</th>
                            <th className="px-6 py-3">Last Clicked</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLinks.length === 0 ? (
                            <tr>
                                {/* Fix: colSpan expects a number, not a string */}
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    No links found. Create one above!
                                </td>
                            </tr>
                        ) : (
                            filteredLinks.map((link) => (
                                <tr key={link.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-indigo-600">
                                        <Link to={`/code/${link.short_code}`} className="hover:underline flex items-center gap-1">
                                            {link.short_code}
                                            <ExternalLink className="h-3 w-3" />
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs truncate text-gray-600" title={link.original_url}>
                                        {link.original_url}
                                    </td>
                                    <td className="px-6 py-4 text-center font-semibold">
                                        {link.click_count}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {link.last_clicked_at
                                            ? formatDistanceToNow(new Date(link.last_clicked_at), { addSuffix: true })
                                            : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <button
                                            onClick={() => handleCopy(link.short_code)}
                                            className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition"
                                            title="Copy Short Link"
                                        >
                                            {copiedId === link.short_code ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                        </button>
                                        <Link
                                            to={`/code/${link.short_code}`}
                                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                                            title="View Stats"
                                        >
                                            <BarChart2 className="h-4 w-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(link.short_code)}
                                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
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