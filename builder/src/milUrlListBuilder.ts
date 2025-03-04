import DataFrame from "dataframe-js";
import path from 'path';

const DOD_2025_SOURCELIST = 'https://raw.githubusercontent.com/GSA/federal-website-index/refs/heads/main/data/source-lists/dod_2025.csv';
const DOD_PUBLIC_SOURCELIST = 'https://raw.githubusercontent.com/GSA/federal-website-index/refs/heads/main/data/source-lists/dod_public.csv';
const DOTMIL_WEBSITES_SOURCELIST = 'https://raw.githubusercontent.com/GSA/federal-website-index/refs/heads/main/data/source-lists/dotmil_websites.csv';
const DOTMIL_WEBSITES2_SOURCELIST = 'https://raw.githubusercontent.com/GSA/federal-website-index/refs/heads/main/data/source-lists/dotmil_websites-2.csv';
const DOTMIL_DOMAINS_SOURCELIST = 'https://raw.githubusercontent.com/GSA/federal-website-index/refs/heads/main/data/source-lists/dotmil_domains.csv';

const DOTMIL_DOMAINS_FINAL = '../../data/source-lists/TESTdotmil_domains.csv';

/**
 * The main entry point of the Mil Url List Builder.
 */
async function main() {

  // Load all source lists
  console.log('Loading and formatting source lists...');
  let sourceDod2025 = await loadSourceList(DOD_2025_SOURCELIST, true, 'Website');
  sourceDod2025 = addTypeAndAgencyColumns(sourceDod2025);

  let sourceDodPublic = await loadSourceList(DOD_PUBLIC_SOURCELIST, true, 'Website');
  sourceDodPublic = addTypeAndAgencyColumns(sourceDodPublic);

  let sourceDotmilWebsites = await loadSourceList(DOTMIL_WEBSITES_SOURCELIST, true, 'Website');
  sourceDotmilWebsites = addTypeAndAgencyColumns(sourceDotmilWebsites);

  let sourceDotmilWebsites2 = await loadSourceList(DOTMIL_WEBSITES2_SOURCELIST, false);
  sourceDotmilWebsites2 = addTypeAndAgencyColumns(sourceDotmilWebsites2);

  let sourceDotmilDomains = await loadSourceList(DOTMIL_DOMAINS_SOURCELIST, true, 'Domain name');

  // Combine all source lists into one DataFrame
  console.log('Combining source lists...');
  let domainList = sourceDod2025
    .union(sourceDodPublic)
    .union(sourceDotmilWebsites)
    .union(sourceDotmilWebsites2);

  // Remove all non-mil domains
  console.log('Removing non-mil domains...');
  domainList = removeAllNonMilDomains(domainList);

  // Convert the domain to a second-level domain
  console.log('Converting to second-level domain...');
  domainList = convertDomainToSecondLevelDomain(domainList);

  // Union with the dotmil domains
  console.log('Combining with dotmil domains...');
  domainList = domainList.union(sourceDotmilDomains);

  // Remove duplicates
  console.log('Removing duplicates...');
  domainList = domainList.dropDuplicates('Domain name');

  // Sort the domain list
  console.log('Sorting domain list...');
  domainList = domainList.sortBy('Domain name');

  // Save the domain list to a CSV file
  console.log('Saving domain list to CSV...');
  domainList.toCSV(true, path.join(__dirname, DOTMIL_DOMAINS_FINAL));

}

main();

async function loadSourceList(url: string, hasHeaders: boolean, urlHeader?: string): Promise<DataFrame> {
  try {
    let source = await DataFrame.fromCSV(url, hasHeaders);
    if (urlHeader) {
      source = source.rename(urlHeader, 'Domain name');
    }
    if (!urlHeader) {
      source = source.rename('0', 'Domain name');
    }
    return source;
  } catch (error) {
    console.error(`Error loading source list from ${url}:`, error);
    throw error;
  }
}

function addTypeAndAgencyColumns(data: DataFrame): DataFrame {
  // Add the Branch and Agency columns based on the source list
  data = data.withColumn('Domain type', () => 'Federal - Executive');
  data = data.withColumn('Agency', () => 'Department of Defense');
  return data;
}

function removeAllNonMilDomains(data: DataFrame): DataFrame {
  // Remove all non-Mil domains
  //@ts-ignore
  data = data.filter(row => {
    const domain = row.get('Domain name');
    return domain.endsWith('.mil');
  }
  );
  return data;
}

function convertDomainToSecondLevelDomain(data: DataFrame): DataFrame {
  // Convert the domain to a second-level domain
  //@ts-ignore
  data = data.withColumn('Domain name', (row) => {
    const domain = row.get('Domain name');
    const parts = domain.split('.');
    if (parts.length > 2) {
      return parts.slice(parts.length - 2).join('.');
    }
    return domain;
  });
  return data;
}