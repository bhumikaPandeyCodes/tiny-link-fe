import React from 'react';
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom';
import { Link2, Github } from 'lucide-react';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900 font-sans flex flex-col">
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                            <Link2 className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            TinyLink
                        </span>
                    </Link>
                    <nav>
                        <a
                            href="https://github.com/bhumikaPandeyCodes/tiny-link-fe"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                        >
                            <Github className="h-4 w-4" />
                            <span className="hidden sm:inline">GitHub</span>
                        </a>
                    </nav>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-grow">
                {children}
            </main>

            <footer className="border-t border-gray-200/50 bg-white/50 backdrop-blur-sm py-8 mt-auto">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <p className="text-sm text-gray-500">
                        TinyLink © 2025
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;