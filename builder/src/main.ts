import { FederalDomainsSourceList } from './services/source-lists/FederalDomainsSourceList';
import { PulseSourceList } from "./services/source-lists/PulseSourceList";
import { DapSourceList } from 'services/source-lists/DapSourceList';
import { OmbIdeaSourceList } from 'services/source-lists/OmbIdeaSourceList';
import { UsaGovSourceList } from 'services/source-lists/UsaGovSourceList';
import { EotwSourceList } from 'services/source-lists/EotwSourceList';
import { GovManSourceList } from 'services/source-lists/GovManSourceList';
import { UsCourtsSourceList } from 'services/source-lists/UsCourtsSourceList';
import { OiraSourceList } from 'services/source-lists/OiraSourceList';
import { MilOneSourceList } from 'services/source-lists/MilOneSourceList';
import { MilTwoSourceList } from 'services/source-lists/MilTwoSourceList';
import { MilDomainsSourceList } from 'services/source-lists/MilDomainsSourceList';
import { OtherSourceList } from 'services/source-lists/OtherSourceList';
import { DodPublicSourceList } from 'services/source-lists/DodPublicSourceList';
import { DotMilSourceList } from 'services/source-lists/DotMilSourceList';
import { FinalUrlWebsitesSourceList } from 'services/source-lists/FinalUrlWebsitesSourceList';
import { House117thSourceList } from 'services/source-lists/House117thSourceList';
import { Senate117thSourceList } from 'services/source-lists/Senate117thSourceList';
import { GpoFdlpSourceList } from 'services/source-lists/GpoFdlpSourceList';
import { CisaSourceList } from 'services/source-lists/CisaSourceList';
import { Dod2025SourceList } from 'services/source-lists/Dod2025SourceList';
import { Dap2SourceList } from 'services/source-lists/Dap2SourceList';
import { UsaGovClicksSourceList } from 'services/source-lists/UsaGovClicksSourceList';
import { UsaGovClicksMilSourceList } from 'services/source-lists/UsaGovClicksMilSourceList';
import { SearchGovSourceList } from 'services/source-lists/SearchGovSourceList';
import { SearchGovMilSourceList } from 'services/source-lists/SearchGovMilSourceList';
import { PublicInventorySourceList } from 'services/source-lists/PublicInventorySourceList';
import DataFrame from "dataframe-js";
import { sourceListConfig } from "./config/source-list.config";
import { SourceList, AnalysisValue } from "./types/config";
import { 
  deduplicateSiteList,
  extractBaseDomainFromUrl,
  extractTLDFromUrl,
  mergeUrlInfo, 
  removeNonGovNonMilSites,
  tagIgnoreListSites,
  unionSourceLists,
  ensureColumnNames,
  fullColumnNameList,
  generateAnalysisEntry,
  mergeDapTopListDataframe,
  mergeOmbIdeaInfo,
  removeDeadSites,
} from "./utils/utilities";
import path from 'path';
import ObjectsToCsv from 'objects-to-csv';

/**
 * Fetches all source list data and returns a Promise with all DataFrames.
 */
async function fetchAllSourceListData(): Promise<DataFrame[]> {
  return Promise.all([
    FederalDomainsSourceList.loadData(),
    PulseSourceList.loadData(),
    DapSourceList.loadData(),
    OmbIdeaSourceList.loadData(),
    EotwSourceList.loadData(),
    UsaGovSourceList.loadData(),
    GovManSourceList.loadData(),
    UsCourtsSourceList.loadData(),
    OiraSourceList.loadData(),
    OtherSourceList.loadData(),
    MilOneSourceList.loadData(),
    MilTwoSourceList.loadData(),
    DodPublicSourceList.loadData(),
    DotMilSourceList.loadData(),
    FinalUrlWebsitesSourceList.loadData(),
    House117thSourceList.loadData(),
    Senate117thSourceList.loadData(),
    GpoFdlpSourceList.loadData(),
    CisaSourceList.loadData(),
    Dod2025SourceList.loadData(),
    Dap2SourceList.loadData(),
    UsaGovClicksSourceList.loadData(),
    UsaGovClicksMilSourceList.loadData(),
    SearchGovSourceList.loadData(),
    SearchGovMilSourceList.loadData()
  ]);
}

/**
 * 
 * @param allSites The DataFrame that you would like to set the default values for the source list columns.
 * @returns A DataFrame with the default values set for the source list columns.
 */
function setSourceListColumnDefaults(allSites: DataFrame) {
  return allSites.replace("", "FALSE", [
    sourceListConfig[SourceList.FEDERAL_DOMAINS].sourceColumnName,
    sourceListConfig[SourceList.PULSE].sourceColumnName,
    sourceListConfig[SourceList.DAP].sourceColumnName,
    sourceListConfig[SourceList.OMB_IDEA].sourceColumnName,
    sourceListConfig[SourceList.EOTW].sourceColumnName,
    sourceListConfig[SourceList.USA_GOV].sourceColumnName,
    sourceListConfig[SourceList.GOV_MAN].sourceColumnName,
    sourceListConfig[SourceList.US_COURTS].sourceColumnName,
    sourceListConfig[SourceList.OIRA].sourceColumnName,
    sourceListConfig[SourceList.OTHER].sourceColumnName,
    sourceListConfig[SourceList.MIL1].sourceColumnName,
    sourceListConfig[SourceList.MIL2].sourceColumnName,
    sourceListConfig[SourceList.DOD_PUBLIC].sourceColumnName,
    sourceListConfig[SourceList.DOTMIL].sourceColumnName,
    sourceListConfig[SourceList.FINAL_URL_WEBSITES].sourceColumnName,
    sourceListConfig[SourceList.HOUSE_117th].sourceColumnName,
    sourceListConfig[SourceList.SENATE_117th].sourceColumnName,
    sourceListConfig[SourceList.GPO_FDLP].sourceColumnName,
    sourceListConfig[SourceList.CISA].sourceColumnName,
    sourceListConfig[SourceList.DOD_2025].sourceColumnName,
    sourceListConfig[SourceList.DAP2].sourceColumnName,
    sourceListConfig[SourceList.USAGOV_CLICKS].sourceColumnName,
    sourceListConfig[SourceList.USAGOV_CLICKS_MIL].sourceColumnName,
    sourceListConfig[SourceList.SEARCH_GOV].sourceColumnName,
    sourceListConfig[SourceList.SEARCH_GOV_MIL].sourceColumnName
  ]);
}

/**
 * The main entry point of the Federal Website Index Builder.
 */
async function main() {
  // DataFrame Docs:
  // https://gmousse.gitbooks.io/dataframe-js/content/doc/api/dataframe.html

  // Copy domains from each source files
  console.log("Fetching source lists...");
  let sourceLists = await fetchAllSourceListData();

  // Initialize our analysis object
  let analysis: AnalysisValue[] = [];

  // Generate analysis entries for each source list
  analysis.push(generateAnalysisEntry('FederalDomainsSourceList', 'gov url list length', sourceLists[0].count()));
  analysis.push(generateAnalysisEntry('PulseSourceList', 'pulse url list length', sourceLists[1].count()));
  analysis.push(generateAnalysisEntry('DapSourceList', 'dap url list length', sourceLists[2].count()));
  analysis.push(generateAnalysisEntry('OmbIdeaSourceList', 'omb idea url list length', sourceLists[3].count()));
  analysis.push(generateAnalysisEntry('EotwSourceList', 'eotw url list length', sourceLists[4].count()));
  analysis.push(generateAnalysisEntry('UsaGovSourceList', 'usagov url list length', sourceLists[5].count()));
  analysis.push(generateAnalysisEntry('GovManSourceList', 'gov_man url list length', sourceLists[6].count()));
  analysis.push(generateAnalysisEntry('UsCourtsSourceList', 'uscourts url list length', sourceLists[7].count()));
  analysis.push(generateAnalysisEntry('OiraSourceList', 'oira url list length', sourceLists[8].count()));
  analysis.push(generateAnalysisEntry('MilOneSourceList', '.mil second url list length', sourceLists[10].count()));
  analysis.push(generateAnalysisEntry('MilTwoSourceList', '.mil first url list length', sourceLists[11].count()));
  analysis.push(generateAnalysisEntry('OtherSourceList', 'other website url list length', sourceLists[9].count()));
  analysis.push(generateAnalysisEntry('DodPublicSourceList', 'dod public url list length', sourceLists[12].count()));
  analysis.push(generateAnalysisEntry('DotMilSourceList', 'dot mil url list length', sourceLists[13].count()));
  analysis.push(generateAnalysisEntry('FinalUrlWebsiteSourceList', 'final url website list length', sourceLists[14].count()));
  analysis.push(generateAnalysisEntry('House117thSourceList', 'House 117th url list length', sourceLists[15].count()));
  analysis.push(generateAnalysisEntry('Senate117thSourceList', 'Senate 117th url list length', sourceLists[16].count()));
  analysis.push(generateAnalysisEntry('GpoFdlpSourceList', 'GpoFdlp url list length', sourceLists[17].count()));
  analysis.push(generateAnalysisEntry('CisaSourceList', 'CISA url list length', sourceLists[18].count()));
  analysis.push(generateAnalysisEntry('Dod2025SourceList', 'DOD 2025 url list length', sourceLists[19].count()));
  analysis.push(generateAnalysisEntry('Dap2SourceList', 'dap2 url list length', sourceLists[20].count()));
  analysis.push(generateAnalysisEntry('UsaGovClicksSourceList', 'usagov clicks url list length', sourceLists[21].count()));
  analysis.push(generateAnalysisEntry('UsaGovClicksMilSourceList', 'usagov clicks mil url list length', sourceLists[22].count()));
  analysis.push(generateAnalysisEntry('SearchGovSourceList', 'search gov url list length', sourceLists[23].count()));
  analysis.push(generateAnalysisEntry('SearchGovMilSourceList', 'search gov mil url list length', sourceLists[24].count()));
  // analysis.push(generateAnalysisEntry('PublicInventorySourceList', 'public inventory url list length', sourceLists[25].count()));

  // Get a list of all column names
  console.log("Ensuring column names are consistent...");
  let fullColumnList = fullColumnNameList(sourceLists);
  fullColumnList = [ ...new Set(fullColumnList) ];

  // Make sure we sync all column names across all DataFrames
  sourceLists = ensureColumnNames(sourceLists, fullColumnList);

  // Union all the source lists together and ensure values exist for the source columns
  console.log("Combining source lists...");
  let allSites = unionSourceLists(sourceLists);
  allSites = setSourceListColumnDefaults(allSites);
  allSites.toCSV(true, path.join(__dirname, '../../data/process-snapshots/after-union.csv'));
  analysis.push(generateAnalysisEntry('Combined', 'combined url list length', allSites.count()));
  
  // Drop duplicates
  console.log("Deduplicating target URLs...");
  allSites = deduplicateSiteList(allSites);
  analysis.push(generateAnalysisEntry('Deduped', 'deduped url list length', allSites.count()));
  allSites.toCSV(true, path.join(__dirname, '../../data/process-snapshots/after-dedup.csv'));

  // Create/Populate base_domain and TLD columns
  console.log("Adding base_domain and TLD columns...");
  //@ts-ignore
  allSites = allSites.withColumn('base_domain', (row) => {
    const targetUrl = row.get('target_url');
    let base_url = extractBaseDomainFromUrl(targetUrl);
    return base_url;
  });
  //@ts-ignore
  allSites = allSites.withColumn('top_level_domain', (row) => {
    const targetUrl = row.get('target_url');
    let tld = extractTLDFromUrl(targetUrl);
    return tld;
  });
  allSites.toCSV(true, path.join(__dirname, '../../data/process-snapshots/after-add-base_domain-tld.csv'));

  // Merge in agency, bureau, and branch for .gov sites
  console.log("Merging in agency, bureau, and branch for .gov sites...");
  allSites = mergeUrlInfo(allSites, sourceLists[0]);
  allSites.toCSV(true, path.join(__dirname, '../../data/process-snapshots/after-GOV-agency-bureau-merge.csv'));

  // Merge in agency, bureau, and branch for .mil sites
  console.log("Merging in agency, bureau, and branch for .mil sites...");
  const milDomains = await MilDomainsSourceList.loadData();
  allSites = mergeUrlInfo(allSites, milDomains);
  allSites.toCSV(true, path.join(__dirname, '../../data/process-snapshots/after-MIL-agency-bureau-merge.csv'));

  // Ensure that the agency and bureau columns from the omb_idea source list are the default values for the urls from that same list
  console.log("Ensuring OMB IDEA agency and bureau columns are the default values...");
  const ombIdeaDf  = await DataFrame.fromCSV('https://raw.githubusercontent.com/GSA/public-website-inventory/refs/heads/main/us-gov-public-website-inventory.csv', true);
  allSites = mergeOmbIdeaInfo(allSites, ombIdeaDf);
  allSites.toCSV(true, path.join(__dirname, '../../data/process-snapshots/after-OMB-agency-bureau-merge.csv'));

  // Add filtered column based on if the url matches the starts_with or contains list
  console.log("Tagging sites based on ignore list...");
  const containsDf = await DataFrame.fromCSV(path.join(__dirname, '../criteria/ignore-list-contains.csv'));
  const beginsDf = await DataFrame.fromCSV(path.join(__dirname, '../criteria/ignore-list-begins.csv'));
  allSites = tagIgnoreListSites(allSites, containsDf, beginsDf);
  analysis.push(generateAnalysisEntry('Ignored', 'urls marked as filtered based on beginning/contains', allSites.countValue(true, 'filtered') ));
  allSites.toCSV(true, path.join(__dirname, '../../data/process-snapshots/after-starts_with-contains-filter.csv'));

  // Filter out all non .gov and .mil sites
  console.log("Filtering out non .gov and .mil sites...");
  const countBefore = allSites.count();
  allSites = removeNonGovNonMilSites(allSites, milDomains, sourceLists[0]);
  analysis.push(generateAnalysisEntry('GovDomains', 'number of .gov base domains', sourceLists[0].count() ));
  analysis.push(generateAnalysisEntry('MilDomains', 'number of .mil base domains', milDomains.count() ));
  analysis.push(generateAnalysisEntry('GovMilNonMatching', 'number of urls with non-.gov or non-.mil base domains removed', countBefore-allSites.count() ));
  analysis.push(generateAnalysisEntry('FinalList', 'url list length after non-federal urls removed', allSites.count() ));
  allSites.toCSV(true, path.join(__dirname, '../../data/process-snapshots/after-gov_mil-filter.csv'));

  // Merge in DAP top list data
  console.log("Merging in DAP top list data...");
  const dapTopDf = await DataFrame.fromCSV(path.join(__dirname, '../../data/source-lists/dap_top_100000_domains_30_days.csv'));
  allSites = mergeDapTopListDataframe(allSites, dapTopDf);
  allSites.toCSV(true, path.join(__dirname, '../../data/process-snapshots/after-dap_top_100000_merge.csv'));

  // Remove sites from the dead-sites list
  console.log("Removing dead sites...");
  const deadSitesDf = await DataFrame.fromCSV('https://raw.githubusercontent.com/GSA/federal-website-index/refs/heads/main/criteria/suspected-dead-sites.csv');
  allSites = removeDeadSites(allSites, deadSitesDf);
  analysis.push(generateAnalysisEntry('DeadSites', 'number of urls after dead sites removed', allSites.count() ));
  allSites.toCSV(true, path.join(__dirname, '../../data/process-snapshots/after-dead-sites-filter.csv'));

  // Reorder the columns
  console.log("Reordering columns...");
  allSites = allSites.restructure(
    [
      'target_url',
      'base_domain',
      'top_level_domain',
      'branch',
      'agency',
      'bureau',
      'source_list_federal_domains',
      'source_list_dap',
      'source_list_pulse',
      'source_list_omb_idea',
      'source_list_eotw',
      'source_list_usagov',
      'source_list_gov_man',
      'source_list_uscourts',
      'source_list_oira',
      'source_list_other',
      'source_list_mil_1',
      'source_list_mil_2',
      'source_list_dod_public',
      'source_list_dotmil',
      'source_list_final_url_websites',
      'source_list_house_117th',
      'source_list_senate_117th',
      'source_list_gpo_fdlp',
      'source_list_cisa',
      'source_list_dod_2025',
      'source_list_dap_2',
      'source_list_usagov_clicks',
      'source_list_usagov_clicks_mil',
      'source_list_search_gov',
      'source_list_search_gov_mil',
      'filtered',
      'pageviews',
      'visits'
    ]
  );
  allSites.toCSV(true, path.join(__dirname, '../../data/process-snapshots/after-column-reorder.csv'));

  // Sort Columns
  console.log("Sorting columns...");
  allSites = allSites.sortBy(['base_domain', 'target_url']);

  // Rename target_url to initial_url
  console.log("Renaming target_url to initial_url...");
  allSites = allSites.rename('target_url', 'initial_url');

  allSites.toCSV(true, path.join(__dirname, '../../data/site-scanning-target-url-list.csv'));

  const analysisCsv = new ObjectsToCsv(analysis);
  await analysisCsv.toDisk(path.join(__dirname, '../../data/site-scanning-target-url-list-analysis.csv'));

  console.log("Final Analysis:");
  analysis.forEach((entry) => {
    console.log(`${entry.value}: ${entry.count}`);
  });
}

main();
