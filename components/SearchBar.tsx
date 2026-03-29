"use client";

import { Search } from 'lucide-react';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
    return (
        <div className="relative max-w-xl mx-auto">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-6 w-6 text-indigo-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-12 pr-4 py-4 bg-white border border-indigo-100 rounded-full text-lg shadow-xl placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-transparent transition-all"
                    placeholder="Search by Ward (e.g., 'Ward 25') or Project... / प्रकल्प शोधा..."
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>
            <p className="mt-2 text-sm text-indigo-200 text-center font-medium">
                Try: "Ward 25", "Road", "Water" • उदाहरण: "प्रभाग 25", "रस्ता"
            </p>
        </div>
    );
}
