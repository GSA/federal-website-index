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
import DataFrame from "dataframe-js";
import { sourceListConfig } from "./config/source-list.config";
import { SourceList } from "./types/config";
import { deduplicateSiteList, extractBaseDomainFromUrl, extractTLDFromUrl, mergeUrlInfo, removeNonGovNonMilSites, tagIgnoreListSites } from "./utils/utilities";
import path from 'path';

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
  ]);
}

/**
 * 
 * @param sourceLists The dataframes that you would like to union together. They must have the same columns.
 * @returns A dataframe that is the union of all the source lists.
 */
function unionSourceLists(sourceLists: DataFrame[]): DataFrame {
  let allSites = sourceLists[0];
  for (let i = 1; i < sourceLists.length; i++) {
    allSites = allSites.union(sourceLists[i]);
  }
  return allSites;
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
  ]);
}

/**
 * 
 * @param sourceLists The DataFrames that you would like to ensure have the same column names.
 * @param columnNames The column names that you would like to ensure are in each DataFrame.
 * @returns The sourceList dataframes with consistent column names.
 */
function ensureColumnNames(sourceLists: DataFrame[], columnNames: string[]): DataFrame[] {
  for (let i = 0; i < sourceLists.length; i++) {
    for (let j = 0; j < columnNames.length; j++) {
      if (!sourceLists[i].listColumns().includes(columnNames[j])) {
        sourceLists[i] = sourceLists[i].withColumn(columnNames[j], ()=>'');
      }
    }
  }
  return sourceLists;
}

/**
 * 
 * @param sourceLists The DataFrames that you would like to get the full column name list from.
 * @returns A list of all the column names from all the DataFrames.
 */
function fullColumnNameList(sourceLists: DataFrame[]): string[] {
  let columns: string[] = [];
  for (let i = 0; i < sourceLists.length; i++) {
    columns = columns.concat(sourceLists[i].listColumns());
  }
  return columns;
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

  // build a rowcount for each source list and a running total
  let rowCount = 0;
  sourceLists.forEach((df, i) => {
    rowCount += df.count();
    console.log(`Source List ${i + 1} contains ${df.count()} rows and ${df.listColumns().length} columns.`);
  });
  console.log(`Total rows in all source lists: ${rowCount}`);

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
  allSites.toCSV(true, path.join(__dirname, './testing/after-union.csv'));

  // Drop duplicates
  console.log("Deduplicating target URLs...");
  allSites = deduplicateSiteList(allSites);
  allSites.toCSV(true, path.join(__dirname, './testing/after-dedup.csv'));

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
  allSites.toCSV(true, path.join(__dirname, './testing/after-addColumns.csv'));

  // Merge in agency, bureau, and branch for .gov sites
  console.log("Merging in agency, bureau, and branch for .gov sites...");
  allSites = mergeUrlInfo(allSites, sourceLists[0]);
  allSites.toCSV(true, path.join(__dirname, './testing/after-mergeSourceValues.csv'));

  // Merge in agency, bureau, and branch for .mil sites
  console.log("Merging in agency, bureau, and branch for .mil sites...");
  const milDomains = await MilDomainsSourceList.loadData();
  allSites = mergeUrlInfo(allSites, milDomains);
  allSites.toCSV(true, path.join(__dirname, './testing/after-mergeMilSourceValues.csv'));

  // Filter out all non .gov and .mil sites
  console.log("Filtering out non .gov and .mil sites...");
  allSites = removeNonGovNonMilSites(allSites, milDomains, sourceLists[0]);
  allSites.toCSV(true, path.join(__dirname, './testing/after-gov_mil-filter.csv'));

  // Add filtered column based on if the url matches the starts_with or contains list
  console.log("Tagging sites based on ignore list...");
  const containsDf = await DataFrame.fromCSV(path.join(__dirname, '../criteria/ignore-list-contains.csv'));
  const beginsDf = await DataFrame.fromCSV(path.join(__dirname, '../criteria/ignore-list-begins.csv'));
  allSites = tagIgnoreListSites(allSites, containsDf, beginsDf);
  allSites.toCSV(true, path.join(__dirname, './testing/after-ignore-list.csv'));

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
      'omb_idea_public',
      'filtered'
    ]
  );
  allSites.toCSV(true, path.join(__dirname, './testing/after-column-reorder.csv'));

  // Sort Columns
  console.log("Sorting columns...");
  allSites = allSites.sortBy(['base_domain', 'target_url']);
  allSites.toCSV(true, path.join(__dirname, './testing/after-sort.csv'));
}

main();
