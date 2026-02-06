import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

interface Tender {
    id: string;
    title: string;
    publish_date: string;
    closing_date: string;
}

// Departments to scrape
const DEPARTMENTS = ['ENG', 'MAR', 'WS'];
const BASE_URL = 'https://www.nwcmc.gov.in/web/tenders.php?uid=NDA4';
const MAX_PAGES = 3;

async function scrapeNWCMC() {
    // Use a Map to prevent duplicates
    const allTendersMap = new Map<string, Tender>();
    let totalRawCount = 0;

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
                    const date = $(cols[2]).text().trim();

                    if (id && title) {
                        totalRawCount++;

                        // Deduplicate based on ID
                        if (!allTendersMap.has(id)) {
                            allTendersMap.set(id, {
                                id,
                                title,
                                publish_date: date,
                                closing_date: 'Check Document'
                            });
                            pageCount++;
                        }
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
