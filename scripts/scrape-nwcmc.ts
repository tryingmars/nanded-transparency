import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

interface Tender {
    id: string;
    title: string;
    publish_date: string;
    closing_date: string;
    cost_in_inr: number;
}

// Departments to scrape
const DEPARTMENTS = ['ENG', 'MAR', 'WS'];
const BASE_URL = 'https://www.nwcmc.gov.in/web/tenders.php?uid=NDA4';
const MAX_PAGES = 3;

async function scrapeNWCMC() {
    // Use a Map to prevent duplicates
    const allTendersMap = new Map<string, Tender>();
    let totalRawCount = 0;

    // Load existing data to avoid overwriting
    try {
        const outputPath = path.join(process.cwd(), 'data', 'latest_tenders.json');
        if (fs.existsSync(outputPath)) {
            const existingData = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
            for (const tender of existingData) {
                if (tender.id) {
                    allTendersMap.set(tender.id, tender);
                }
            }
            console.log(`[SCRAPER] Loaded ${allTendersMap.size} existing tenders.`);
        }
    } catch (e) {
        console.error(`[SCRAPER] Failed to load existing tenders:`, e);
    }

    for (const dept of DEPARTMENTS) {
        for (let page = 1; page <= MAX_PAGES; page++) {
            // Construct URL with department and page parameter
            const url = `${BASE_URL}&id=${dept}&page=${page}`;

            try {
                console.log(`[SCRAPER] Fetching ${dept} (Page ${page})...`);

                let htmlContent = '';

                try {
                    const { data } = await axios.get(url, {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                        },
                        timeout: 10000
                    });
                    htmlContent = data;
                } catch (netError) {
                    console.warn(`[SCRAPER] Failed ${dept} Page ${page}: ${(netError as Error).message}. Skipping.`);
                    continue;
                }

                const $ = cheerio.load(htmlContent);
                let pageCount = 0;

                // Extract rows
                $('table tr').each((i, el) => {
                    if ($(el).find('th').length > 0) return; // Skip header

                    const cols = $(el).find('td');
                    if (cols.length < 2) return;

                    const id = $(cols[0]).text().trim();
                    const title = $(cols[1]).text().trim();
                    const dateInfo = $(cols[2]).text().trim();
                    // Generally, NWCMC site has columns like: Sr.No, Title, Pub Date, Amount, Closing Date
                    const amountText = cols.length > 3 ? $(cols[3]).text().trim() : '';

                    let cost_in_inr = 0;
                    // Example parsing: 4.41 Crore -> 44100000
                    if (amountText.toLowerCase().includes('crore')) {
                        const val = parseFloat(amountText);
                        cost_in_inr = !isNaN(val) ? val * 10000000 : 0;
                    } else if (amountText.toLowerCase().includes('lakh')) {
                        const val = parseFloat(amountText);
                        cost_in_inr = !isNaN(val) ? val * 100000 : 0;
                    } else {
                        // Extract numbers from something like "Rs. 500000"
                        const match = amountText.replace(/,/g, '').match(/\d+(\.\d+)?/);
                        if (match) {
                            cost_in_inr = parseFloat(match[0]);
                        }
                    }

                    if (id && title) {
                        totalRawCount++;

                        // Count new items
                        if (!allTendersMap.has(id)) {
                            pageCount++;
                        }
                        // Always update with fresh website data to ensure we have cost_in_inr
                        allTendersMap.set(id, {
                            ...(allTendersMap.get(id) || {}),
                            id,
                            title,
                            publish_date: dateInfo,
                            closing_date: 'Check Document',
                            cost_in_inr
                        });
                    }
                });

                console.log(`[SCRAPER] Found ${pageCount} new items on ${dept} Page ${page}.`);

                // If no items found on this page, stop paging for this department
                if (pageCount === 0) {
                    console.log(`[SCRAPER] No more items for ${dept}, stopping pagination.`);
                    break;
                }

            } catch (error) {
                console.error(`[SCRAPER] Error processing ${dept} Page ${page}:`, error);
            }

            // Polite delay between requests
            await new Promise(r => setTimeout(r, 1000));
        }
    }

    const uniqueTenders = Array.from(allTendersMap.values());
    const uniqueCount = uniqueTenders.length;

    console.log('------------------------------------------------');
    console.log(`[SCRAPER] SUMMARY:`);
    console.log(`[SCRAPER] Total Raw Items Found: ${totalRawCount}`);
    console.log(`[SCRAPER] Unique Tenders Saved:  ${uniqueCount}`);
    console.log('------------------------------------------------');

    // Save aggregated results
    try {
        const outputPath = path.join(process.cwd(), 'data', 'latest_tenders.json');
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(outputPath, JSON.stringify(uniqueTenders, null, 2));
        console.log(`[SCRAPER] Verified: Data saved locally to data/latest_tenders.json`);

        return uniqueTenders;
    }
    catch (fileError) {
        console.error('[SCRAPER] File Write Error:', fileError);
        return [];
    }
}

// Execute if run directly
scrapeNWCMC();
