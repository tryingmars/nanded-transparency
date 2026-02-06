"use client";

import { useState } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { ProjectCard } from '@/components/ProjectCard';
import { ParsedTender } from '@/lib/pdf-parser';
import { calculateProjectStatus } from '@/lib/civic-engine';

interface WardEntry {
    ward_no: number;
    areas: string[];
    nagarsevak_name: string;
    party: string;
    mobile: string;
}

interface DashboardProps {
    initialProjects: ParsedTender[];
    reportCounts: Record<string, number>;
    wardList: WardEntry[];
}

export function Dashboard({ initialProjects, reportCounts, wardList }: DashboardProps) {
    const [projects] = useState<ParsedTender[]>(initialProjects);
    const [filteredProjects, setFilteredProjects] = useState<ParsedTender[]>(initialProjects);

    const handleSearch = (query: string) => {
        // 1. Normalize the search term
        const searchTerm = query.toLowerCase().trim();
        const originalTerm = query.trim(); // For Marathi matching (case-sensitive/exact)

        console.log(`[Search] Query: "${query}", Normalized: "${searchTerm}"`);

        if (!searchTerm) {
            setFilteredProjects(projects);
            return;
        }

        // 2. Check Ward X special case
        const wardMatch = searchTerm.match(/ward\s*(\d+)/);
        if (wardMatch) {
            const wardNum = parseInt(wardMatch[1]);
            console.log(`[Search] Detected Ward Filter: ${wardNum}`);
            setFilteredProjects(projects.filter(p => p.ward_no === wardNum));
            return;
        }

        // 3. General Filtering Logic
        const filtered = projects.filter(project => {
            // English Title: Lowercase comparison
            const titleMatch = project.project_name_english?.toLowerCase().includes(searchTerm);

            // Marathi Title: Original term comparison (No lowercase)
            const marathiMatch = project.project_name_marathi?.includes(originalTerm);

            // Ward Number: String comparison
            const wardNoMatch = project.ward_no?.toString().includes(searchTerm);

            return titleMatch || marathiMatch || wardNoMatch;
        });

        console.log(`[Search] Found ${filtered.length} results.`);
        setFilteredProjects(filtered);
    };

    return (
        <main className="min-h-screen bg-slate-50 font-sans">
            {/* Hero Section */}
            <div className="bg-indigo-700 pb-24 pt-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl tracking-tight">
                        Nanded Civic Transparency
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-indigo-100">
                        Tracking development projects in your ward. Powered by AI.
                    </p>
                    <div className="mt-10">
                        <SearchBar onSearch={handleSearch} />
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="-mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => {
                        const status = calculateProjectStatus(project.sanction_date, project.duration_months, 50); // Mock 50% completion
                        const ward = wardList.find(w => w.ward_no === project.ward_no);

                        return (
                            <ProjectCard
                                key={project.id}
                                title={project.project_name_english}
                                marathiTitle={project.project_name_marathi}
                                cost={project.cost_in_inr}
                                status={status}
                                wardInfo={ward}
                                citizenPhotosCount={reportCounts[project.id] || 0}
                            />
                        );
                    })}
                </div>

                {filteredProjects.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        No projects found. Try searching for "Cidco" or "Ward 25".
                    </div>
                )}
            </div>
        </main>
    );
}
