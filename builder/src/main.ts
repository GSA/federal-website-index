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
import DataFrame from "dataframe-js";
import { sourceListConfig } from "./config/source-list.config";
import { SourceList } from "./types/config";
import path from 'path';

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
    MilOneSourceList.loadData(),
    MilTwoSourceList.loadData(),
  ]);
}

function mergeSourceLists(urlList: DataFrame, sourceLists: DataFrame[]): DataFrame {
  let allSites = urlList;
  for (let i = 0; i < sourceLists.length; i++) {
    try {
      console.log(`Merging source list ${i + 1}`);
      allSites = allSites.leftJoin(sourceLists[i], 'target_url');
    } catch (e: any) {
      console.log(`Stack error: ${e.stack}`);
      console.error(`Error merging source list ${i + 1}: ${e}`);
    }
    console.log(`Source list ${i + 1} complete. allSite contains ${allSites.count()} rows :: ${allSites.listColumns().length} columns`);
  }
  return allSites;
}

function buildTargetUrlList(sourceLists: DataFrame[]): DataFrame {
  let targetUrls = sourceLists[0].select('target_url');
  console.log(`targetUrls now contains ${targetUrls.count()} rows :: added ${sourceLists[0].count()} rows`);
  for (let i = 1; i < sourceLists.length; i++) {
    targetUrls = targetUrls.union(sourceLists[i].select('target_url'));
    console.log(`targetUrls now contains ${targetUrls.count()} rows :: added ${sourceLists[i].count()} rows`);
  }
  return targetUrls;
}
function setSourceListColumnDefaults(allSites: DataFrame) {
  return allSites.fillMissingValues("FALSE", [
    sourceListConfig[SourceList.FEDERAL_DOMAINS].sourceColumnName,
    sourceListConfig[SourceList.PULSE].sourceColumnName,
    sourceListConfig[SourceList.DAP].sourceColumnName,
    sourceListConfig[SourceList.OMB_IDEA].sourceColumnName,
    sourceListConfig[SourceList.EOTW].sourceColumnName,
    sourceListConfig[SourceList.USA_GOV].sourceColumnName,
    sourceListConfig[SourceList.GOV_MAN].sourceColumnName,
    sourceListConfig[SourceList.US_COURTS].sourceColumnName,
    //sourceListConfig[SourceList.OIRA].sourceColumnName,
    //sourceListConfig[SourceList.MIL1].sourceColumnName,
    //sourceListConfig[SourceList.MIL2].sourceColumnName,
  ]);
}

/**
 * The main entry point of the Federal Website Index Builder.
 */
async function main() {
  // DataFrame Docs:
  // https://gmousse.gitbooks.io/dataframe-js/content/doc/api/dataframe.html

  // Copy domains from each source files
  // ... and ... Note which source files the domains came from
  console.log("Fetching source lists...");
  const sourceLists = await fetchAllSourceListData();

  // Build a list of all target URLs
  //let allSites = buildTargetUrlList(sourceLists);
  //allSites.toCSV(true, path.join(__dirname, './testing/all-urls.csv'));

  // Combine all of them
  // console.log(`Merging ${sourceLists.length} source lists.`);
  // allSites = mergeSourceLists(allSites, sourceLists);

  console.log("Joining source lists...");
  const df1 = await DataFrame.fromCSV(path.join(__dirname, './testing/source-test-1.csv'));
  const df2 = await DataFrame.fromCSV(path.join(__dirname, './testing/source-test-2.csv'));
  // sourceLists[1].toCSV(true, path.join(__dirname, './testing/sourceLists_1.csv'));
  // sourceLists[5].toCSV(true, path.join(__dirname, './testing/sourceLists_5.csv'));
  let allSites = df1.fullJoin(df2, 'target_url');

  // Apply default source list column values
  //console.log("Applying default source list column values...");
  //allSites = setSourceListColumnDefaults(allSites);

  // Check our Progress
  allSites.show();
  allSites.toCSV(true, path.join(__dirname, './testing/allSites.csv'));
}

main();
