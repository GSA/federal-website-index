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
} from "./utils/utilities";
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
  analysis.push(generateAnalysisEntry('Combined', 'combined url list length', allSites.count()));
  
  // Drop duplicates
  console.log("Deduplicating target URLs...");
  allSites = deduplicateSiteList(allSites);
  analysis.push(generateAnalysisEntry('Deduped', 'deduped url list length', allSites.count()));
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

  // Add filtered column based on if the url matches the starts_with or contains list
  console.log("Tagging sites based on ignore list...");
  const containsDf = await DataFrame.fromCSV(path.join(__dirname, '../criteria/ignore-list-contains.csv'));
  const beginsDf = await DataFrame.fromCSV(path.join(__dirname, '../criteria/ignore-list-begins.csv'));
  allSites = tagIgnoreListSites(allSites, containsDf, beginsDf);
  analysis.push(generateAnalysisEntry('Ignored', 'url list length after ignore list checking beginning/contains of urls processed', allSites.count() - allSites.countValue(true, 'filtered') ));
  allSites.toCSV(true, path.join(__dirname, './testing/after-ignore-list.csv'));

  // Filter out all non .gov and .mil sites
  console.log("Filtering out non .gov and .mil sites...");
  const countBefore = allSites.count();
  allSites = removeNonGovNonMilSites(allSites, milDomains, sourceLists[0]);
  analysis.push(generateAnalysisEntry('GovDomains', 'number of .gov base domains', sourceLists[0].count() ));
  analysis.push(generateAnalysisEntry('MilDomains', 'number of .mil base domains', milDomains.count() ));
  analysis.push(generateAnalysisEntry('GovMilNonMatching', 'number of urls with non-.gov or non-.mil base domains removed', countBefore-allSites.count() ));
  analysis.push(generateAnalysisEntry('FinalList', 'url list length after non-federal urls removed', allSites.count() ));
  allSites.toCSV(true, path.join(__dirname, './testing/after-gov_mil-filter.csv'));

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

  // Collect omb_idea_public counts allSites.countValue(true, 'filtered')
  const ombTrue = allSites.countValue('true', 'omb_idea_public');
  const ombFalse = allSites.countValue('false', 'omb_idea_public');
  const ombBlank = allSites.countValue('', 'omb_idea_public');
  const ombOther = allSites.count() - ombTrue - ombFalse - ombBlank;
  analysis.push(generateAnalysisEntry('OMBTrue', 'Number of omb_idea_public fields = TRUE', ombTrue ));
  analysis.push(generateAnalysisEntry('OMBFalse', 'Number of omb_idea_public fields = FALSE', ombFalse ));
  analysis.push(generateAnalysisEntry('OMBBlank', 'Number of omb_idea_public fields = blank', ombBlank ));
  analysis.push(generateAnalysisEntry('OMBOther', 'Number of omb_idea_public fields that != TRUE FALSE or blank', ombOther ));

  allSites.toCSV(true, path.join(__dirname, './testing/final-list.csv'));

  console.log("Analysis:", analysis);
}

main();