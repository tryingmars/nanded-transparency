"use client";

import { Search } from 'lucide-react';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
    return (
        <div className="relative max-w-2xl mx-auto w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
                type="text"
                className="block w-full pl-10 pr-3 py-4 border border-slate-300 rounded-full leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-lg shadow-sm"
                placeholder="Search projects by name, or type 'Ward 25'..."
                onChange={(e) => onSearch(e.target.value)}
            />
        </div>
    );
}
