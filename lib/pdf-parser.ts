"use server";

import fs from 'fs';
import path from 'path';

export interface ParsedTender {
    id: string;
    project_name_marathi: string;
    project_name_english: string;
    cost_in_inr: number;
    sanction_date: string;
    duration_months: number;
    ward_no?: number;
}

// Mock database mapping file names to parsed content
const MOCK_DB: Record<string, Omit<ParsedTender, 'id'>> = {
    "tender_filesEAuction 17506.pdf": {
        project_name_marathi: "ई-लिलाव गाळे वाटप",
        project_name_english: "E-Auction Shop Allotment",
        cost_in_inr: 8500000,
        sanction_date: "2025-07-01",
        duration_months: 3,
        ward_no: 10
    },
    "tender_filesElectrical 17245.pdf": {
        project_name_marathi: "विद्युत पंप दुरुस्ती",
        project_name_english: "Electric Pump Repair",
        cost_in_inr: 1200000,
        sanction_date: "2025-09-15",
        duration_months: 1,
        ward_no: 4
    },
    "tender_filesPWD 17323.pdf": {
        project_name_marathi: "रस्ता खडीकरण व डांबरीकरण",
        project_name_english: "Road Metaling & Asphalting (PWD 17323)",
        cost_in_inr: 25000000,
        sanction_date: "2025-05-20",
        duration_months: 8,
        ward_no: 25
    },
    "tender_filesPWD 17324.pdf": {
        project_name_marathi: "नाली बांधकाम",
        project_name_english: "Drainage Construction (PWD 17324)",
        cost_in_inr: 5000000,
        sanction_date: "2025-10-10",
        duration_months: 6,
        ward_no: 25
    },
    "tender_filesPWD 17375.pdf": {
        project_name_marathi: "सांस्कृतिक भवन दुरुस्ती",
        project_name_english: "Cultural Hall Renovation",
        cost_in_inr: 3500000,
        sanction_date: "2025-11-25",
        duration_months: 4,
        ward_no: 12
    },
    "tender_filesYantriki 17215.pdf": {
        project_name_marathi: "कचरा गाडी देखभाल",
        project_name_english: "Garbage Truck Maintenance",
        cost_in_inr: 1800000,
        sanction_date: "2026-01-05",
        duration_months: 12,
        ward_no: 1
    }
};

export async function parseMarathiPDFs(): Promise<ParsedTender[]> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Real file reading
    const tendersDir = path.join(process.cwd(), 'public', 'tenders');

    try {
        const files = fs.readdirSync(tendersDir);

        // Filter for PDFs and map to mock DB
        const tenders = files
            .filter(file => file.endsWith('.pdf'))
            .map(file => {
                const data = MOCK_DB[file];
                // Fallback for files not in mock DB (if any new ones appear)
                if (!data) return {
                    id: file,
                    project_name_marathi: "अज्ञात प्रकल्प",
                    project_name_english: "Unknown Project",
                    cost_in_inr: 0,
                    sanction_date: "2025-01-01",
                    duration_months: 6,
                    ward_no: 0
                };

                return {
                    id: file, // Use filename as ID
                    ...data
                };
            });

        return tenders;
    } catch (error) {
        console.error("Error reading tenders directory:", error);
        return [];
    }
}
