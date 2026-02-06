import { Dashboard } from '@/components/Dashboard';
import { parseMarathiPDFs } from '@/lib/pdf-parser';
import { getReportCounts } from '@/lib/actions';
import wardDataRaw from '../public/ward_directory.json';

// --- Configuration for ISR ---
export const revalidate = 60; // Revalidate every 60 seconds
export const dynamic = 'force-dynamic'; // Since we are reading local files that might change via scraper

interface WardEntry {
  ward_no: number;
  areas: string[];
  nagarsevak_name: string;
  party: string;
  mobile: string;
}

// Helper to safely access ward data
const wardList = (wardDataRaw as any[]).filter(item => item.ward_no) as WardEntry[];

export default async function Home() {
  // Fetch data on the server
  const [projects, reportCounts] = await Promise.all([
    parseMarathiPDFs(),
    getReportCounts()
  ]);

  return (
    <Dashboard
      initialProjects={projects}
      reportCounts={reportCounts}
      wardList={wardList}
    />
  );
}
