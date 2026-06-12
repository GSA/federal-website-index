import DataFrame from "dataframe-js";
import path from 'path';
import fs from 'fs';
import { URL } from 'url';

const SNAPSHOT_ALL_URL = 'https://api.gsa.gov/technology/site-scanning/data/site-scanning-latest.csv';
const OUTPUT_PATH = '../../data/source-lists/hyperlink_domains.csv';

/**
 * The main entry point of the Hyperlink Domains Builder.
 */
async function main() {

  // Load the snapshot data
  console.log('Loading snapshot data...');
  const sourceSnapshot = await DataFrame.fromCSV(SNAPSHOT_ALL_URL, true);

  // Extract the hyperlink_domains column
  console.log('Extracting hyperlink_domains column...');
  const hyperlinkDomainsColumn = sourceSnapshot.select("hyperlink_domains");

  // Parse JSON arrays and flatten into a single domain set
  console.log('Parsing and flattening domain arrays...');
  const domainSet = new Set<string>();
  let invalidCount = 0;

  hyperlinkDomainsColumn.toArray().forEach((row: string[]) => {
    const cellValue = row[0]; // single column, so index 0
    if (!cellValue || cellValue.trim() === '' || cellValue.trim() === '[]') {
      return;
    }
    try {
      const parsed = JSON.parse(cellValue);
      if (Array.isArray(parsed)) {
        for (const domain of parsed) {
          if (typeof domain === 'string' && domain.trim() !== '') {
            const normalized = domain.trim().toLowerCase();

            // Validate using Node URL API
            try {
              const url = new URL(`https://${normalized}`);
              const isIP = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(url.hostname);

              // Must contain a dot and not be an IP address
              if (url.hostname.includes('.') && !isIP) {
                domainSet.add(url.hostname);
              } else {
                invalidCount++;
              }
            } catch (e) {
              invalidCount++;
            }
          }
        }
      }
    } catch (e) {
      console.warn(`Warning: Could not parse hyperlink_domains value: ${cellValue}`);
    }
  });

  console.log(`Filtered out ${invalidCount} invalid entries (IPs, phone numbers, protocols, etc.)`);

  // Sort alphabetically for consistency
  console.log(`Found ${domainSet.size} unique domains. Sorting...`);
  const sortedDomains = Array.from(domainSet).sort();

  // Write to CSV with header "domains"
  console.log('Saving hyperlink domains list to CSV...');
  const csvContent = 'domains\n' + sortedDomains.join('\n') + '\n';
  fs.writeFileSync(path.join(__dirname, OUTPUT_PATH), csvContent);

  console.log(`Done. Wrote ${sortedDomains.length} domains to hyperlink_domains.csv`);

}

main();
