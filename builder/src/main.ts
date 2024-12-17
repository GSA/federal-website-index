import { FederalDomainsSourceList } from './services/source-lists/FederalDomainsSourceList';
import { PulseSourceList } from "./services/source-lists/PulseSourceList";
import DataFrame from "dataframe-js";
import { sourceListConfig } from "./config/source-list.config";
import { SourceList } from "./types/config";

async function fetchAllSourceListData(): Promise<DataFrame[]> {
  return Promise.all([
    FederalDomainsSourceList.loadData(),
    PulseSourceList.loadData(),
  ]);
}

function mergeSourceLists(sourceLists: DataFrame[]): DataFrame {
  let allSites = sourceLists[0];
  for (let i = 1; i < sourceLists.length; i++) {
    allSites = allSites.leftJoin(sourceLists[i], 'target_url');
  }
  return allSites;
}

function setSourceListColumnDefaults(allSites: DataFrame) {
  return allSites.fillMissingValues("FALSE", [
    sourceListConfig[SourceList.FEDERAL_DOMAINS].sourceColumnName,
    sourceListConfig[SourceList.PULSE].sourceColumnName,
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
  const sourceLists = await fetchAllSourceListData();

  // Combine all of them
  let allSites = mergeSourceLists(sourceLists);

  // Apply default source list column values
  allSites = setSourceListColumnDefaults(allSites);

  // Check our Progress
  allSites.show();
}

main();
