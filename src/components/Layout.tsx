// src/components/Layout.tsx
import React from 'react';
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom';
import { Link2 } from 'lucide-react';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition">
                        <Link2 className="h-6 w-6" />
                        <span className="font-bold text-xl tracking-tight">TinyLink</span>
                    </Link>
                    <nav>
                        <a
                            href="https://github.com/yourusername/tinylink"
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-medium text-gray-500 hover:text-gray-900"
                        >
                            GitHub Repo
                        </a>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 py-6 mt-auto">
                <div className="max-w-5xl mx-auto px-4 text-center text-sm text-gray-400">
                    TinyLink Assignment &copy; {new Date().getFullYear()}
                </div>
            </footer>
        </div>
    );
};

export default Layout;