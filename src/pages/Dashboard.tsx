// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import CreateLinkForm from '../components/CreateLinkForm.tsx';
import LinkList from '../components/LinkTable.tsx';
import { api } from '../lib/api.ts';
import type { LinkData } from '../lib/types.ts';

const Dashboard: React.FC = () => {
    const [links, setLinks] = useState<LinkData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchLinks = async () => {
        try {
            const res = await api.getLinks();
            setLinks(res.data);
        } catch (err) {
            console.error("Failed to load links", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLinks();
    }, []);

    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-2">Manage your short links and view performance.</p>
            </div>

            <CreateLinkForm onSuccess={fetchLinks} />

            {loading ? (
                <div className="text-center py-10 text-gray-500">Loading links...</div>
            ) : (
                <LinkList links={links} fetchLinks={fetchLinks} />
            )}
        </div>
    );
};

export default Dashboard;