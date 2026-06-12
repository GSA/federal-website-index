import DataFrame from "dataframe-js";
import path from 'path';
import fs from 'fs';
import {URL} from 'url';

const SNAPSHOT_ALL_URL = 'https://api.gsa.gov/technology/site-scanning/data/site-scanning-latest.csv';
const OUTPUT_PATH = '../../data/source-lists/hyperlink_domains.csv';

/**
 * Validates a domain string using the Node URL API and ensures it is not an IP address.
 * Returns the normalized hostname if valid, otherwise null.
 */
function validateAndNormalizeDomain(domain: string): string | null {
    const trimmed = domain.trim();
    if (trimmed === '') return null;

    try {
        const normalized = trimmed.toLowerCase();
        const url = new URL(`https://${normalized}`);
        const hostname = url.hostname;
        const isIP = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname);

        // Must contain a dot and not be an IP address
        if (hostname.includes('.') && !isIP) {
            return hostname;
        }
    } catch (e) {
        // Ignore invalid URL parse errors
    }
    return null;
}

/**
 * Parses the raw cell value (which is expected to be a JSON string array of domains)
 * and populates the domain set, returning the number of invalid domains encountered.
 */
function extractDomainsFromCell(cellValue: string, domainSet: Set<string>): number {
    let invalidCount = 0;
    const trimmedCellValue = cellValue?.trim();

    if (!trimmedCellValue || trimmedCellValue === '' || trimmedCellValue === '[]') {
        return invalidCount;
    }

    try {
        const parsed = JSON.parse(trimmedCellValue);
        if (Array.isArray(parsed)) {
            for (const item of parsed) {
                if (typeof item === 'string' && item.trim() !== '') {
                    const validatedHostname = validateAndNormalizeDomain(item);
                    if (validatedHostname) {
                        domainSet.add(validatedHostname);
                    } else {
                        invalidCount++;
                    }
                }
            }
        }
    } catch (e) {
        console.warn(`Warning: Could not parse hyperlink_domains value: ${cellValue}`);
    }

    return invalidCount;
}

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
    let totalInvalidCount = 0;

    hyperlinkDomainsColumn.toArray().forEach((rowData: string[]) => {
        const cellValue = rowData[0]; // single column, so index 0
        totalInvalidCount += extractDomainsFromCell(cellValue, domainSet);
    });

    console.log(`Filtered out ${totalInvalidCount} invalid entries (IPs, phone numbers, protocols, etc.)`);

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
