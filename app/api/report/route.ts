import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { projectId, photoUrl } = body;

        if (!projectId || !photoUrl) {
            return NextResponse.json(
                { error: 'Missing projectId or photoUrl' },
                { status: 400 }
            );
        }

        // Define path to reports DB
        const reportsDir = path.join(process.cwd(), 'data');
        const reportsFile = path.join(reportsDir, 'reports.json');

        // Ensure directory exists
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }

        // Read existing reports
        let reports: any[] = [];
        if (fs.existsSync(reportsFile)) {
            const fileContent = fs.readFileSync(reportsFile, 'utf-8');
            try {
                reports = JSON.parse(fileContent);
            } catch (e) {
                console.error("Error parsing reports.json, resetting db");
                reports = [];
            }
        }

        // Add new report
        const newReport = {
            id: 'rep_' + Date.now(),
            projectId,
            photoUrl,
            timestamp: new Date().toISOString(),
            status: 'pending_review'
        };

        reports.push(newReport);

        // Save back to file
        fs.writeFileSync(reportsFile, JSON.stringify(reports, null, 2));

        console.log(`[API] Saved report for project ${projectId} to ${reportsFile}`);

        return NextResponse.json({
            success: true,
            message: 'Report submitted successfully',
            data: newReport
        });
    } catch (error) {
        console.error('[API Error]', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
