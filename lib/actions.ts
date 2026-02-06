"use server";

import fs from 'fs';
import path from 'path';

export async function getReportCounts(): Promise<Record<string, number>> {
    try {
        const reportsFile = path.join(process.cwd(), 'data', 'reports.json');

        if (!fs.existsSync(reportsFile)) {
            return {};
        }

        const fileContent = fs.readFileSync(reportsFile, 'utf-8');
        const reports = JSON.parse(fileContent);

        // Count reports per projectId
        const counts: Record<string, number> = {};
        if (Array.isArray(reports)) {
            reports.forEach((r: any) => {
                if (r.projectId) {
                    counts[r.projectId] = (counts[r.projectId] || 0) + 1;
                }
            });
        }

        return counts;
    } catch (error) {
        console.error("Error reading report counts:", error);
        return {};
    }
}
