import { Dashboard } from '@/components/Dashboard';
import { getReportCounts } from '@/lib/actions';
import wardDataRaw from '../public/ward_directory.json';
import latestTenders from '@/data/latest_tenders.json';

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
  const [reportCounts] = await Promise.all([
    getReportCounts()
  ]);

  // Map scraped data to the expected shape
  const projects = latestTenders.map((tender: any) => ({
    id: tender.id,
    project_name_english: tender.title,
    project_name_marathi: '',
    cost_in_inr: tender.cost_in_inr || 0,
    ward_no: null,
    sanction_date: tender.publish_date,
    duration_months: 0
  })) as any;

  return (
    <Dashboard
      initialProjects={projects}
      reportCounts={reportCounts}
      wardList={wardList}
    />
  );
}
