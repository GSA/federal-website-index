import DataFrame from "dataframe-js";
import { sourceListConfig } from "../config/source-list.config";
import { AnalysisValue, SourceList } from "../types/config";

/**
 * This function is used to generate an analysis entry for the analysis table.
 * @param name The name of the analysis entry.
 * @param value The value of the analysis entry.
 * @param count The count of the analysis entry.
 * @returns 
 */
export function generateAnalysisEntry(name: string, value: string, count: number): AnalysisValue {
  return {
    name: name,
    value: value,
    count: count
  };
}

/**
 * 
 * @param url The URL that you would like to remove the www from.
 * @returns The URL with the www removed.
 */
function removeWwwFromUrl(url: string): string {
  // remove www. from the beginning of the url
  return url.replace(/^www\./, '');  
}

/**
 * 
 * @param url The URL that you would like to remove the protocol from.
 * @returns The URL with the protocol removed.
 */
function removeProtocolFromUrl(url: string): string {
  return url.replace(/(^\w+:|^)\/\//, '');
}

/**
 * 
 * @param url The URL that you would like to remove the path from.
 * @returns The URL with the path removed.
 */
function removePathFromUrl(url: string): string {
  return url.split('/')[0];
}

/**
 * 
 * @param url The URL that you would like to convert to lowercase.
 * @returns The URL in lowercase.
 */
function urlToLowercase(url: string): string {
  return url.toLowerCase();
}

/**
 * 
 * @param url The URL that you would like to extract the base domain from.
 * @returns The base domain extracted from the URL.
 */
export function extractBaseDomainFromUrl(url: string): string {
  const domain = url.split('.').slice(-2).join('.');
  return domain;
}

/**
 * 
 * @param url The URL that you would like to extract the TLD from.
 * @returns The TLD extracted from the URL.
 */
export function extractTLDFromUrl(url: string): string {
  const tld = url.split('.').slice(-1).join('.');
  return tld;
}

/**
 * 
 * @param sourceLists The DataFrames that you would like to ensure have the same column names.
 * @param columnNames The column names that you would like to ensure are in each DataFrame.
 * @returns The sourceList dataframes with consistent column names.
 */
export function ensureColumnNames(sourceLists: DataFrame[], columnNames: string[]): DataFrame[] {
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
export function fullColumnNameList(sourceLists: DataFrame[]): string[] {
  let columns: string[] = [];
  for (let i = 0; i < sourceLists.length; i++) {
    columns = columns.concat(sourceLists[i].listColumns());
  }
  return columns;
}

/**
 * 
 * @param sourceLists The dataframes that you would like to union together. They must have the same columns.
 * @returns A dataframe that is the union of all the source lists.
 */
export function unionSourceLists(sourceLists: DataFrame[]): DataFrame {
  let allSites = sourceLists[0];
  for (let i = 1; i < sourceLists.length; i++) {
    allSites = allSites.union(sourceLists[i]);
  }
  return allSites;
}

/**
 * 
 * @param sourceDataFrame The DataFrame that you would like to clean the target URLs for.
 * @returns The DataFrame with the target URLs cleaned.
 */
export function cleanTargetUrls(sourceDataFrame: DataFrame): DataFrame {
  //@ts-ignore
  sourceDataFrame = sourceDataFrame.withColumn('target_url', (row) => {
    let targetUrl = row.get('target_url');
    targetUrl = removeProtocolFromUrl(targetUrl);
    targetUrl = removePathFromUrl(targetUrl);
    targetUrl = removeWwwFromUrl(targetUrl);
    targetUrl = urlToLowercase(targetUrl);
    targetUrl = targetUrl.trim();
    return targetUrl;
  });
  return sourceDataFrame;
}

/**
 *
 * @param allSites The DataFrame that you would like to merge the source data into.
 * @param sourceDf The DataFrame that you would like to merge into the allSites DataFrame.
 * @returns The allSites DataFrame with the source data merged in.
 */
export function mergeUrlInfo(allSites: DataFrame, sourceDf: DataFrame): DataFrame {
  // Convert source dataframe to an object for faster lookup
  const sourceData = sourceDf.toCollection(); // Convert to an array of rows

  // Loop through each row of the combined dataframe
  const updatedData = allSites.toCollection().map((row) => {
      // Extract the base_domain from the combined dataframe row
      const baseUrl = row.base_domain;

      // Find the matching row from the source dataframe based on base_domain
      const matchedSource = sourceData.find(sourceRow => sourceRow.target_url === baseUrl);

      // If a match is found, update the row with values from the source dataframe
      if (matchedSource) {
          return {
              ...row, // Keep the existing fields
              agency: matchedSource.agency, // Update with the source data
              bureau: matchedSource.bureau, // Update with the source data
              branch: matchedSource.branch, // Update with the source data
          };
      } else {
          // If no match, return the row as is
          return row;
      }
  });

  // Convert the updated data back into a dataframe
  return new DataFrame(updatedData);
};

/**
 * 
 * @param allSites The DataFrame that you would like to deduplicate the site list for.
 * @returns The DataFrame with the site list deduplicated.
 */
export function deduplicateSiteList(allSites: DataFrame): DataFrame {
  const sourceListColumns = [
    sourceListConfig[SourceList.FEDERAL_DOMAINS].sourceColumnName,
    sourceListConfig[SourceList.PULSE].sourceColumnName,
    sourceListConfig[SourceList.DAP].sourceColumnName,
    sourceListConfig[SourceList.OMB_IDEA].sourceColumnName,
    sourceListConfig[SourceList.EOTW].sourceColumnName,
    sourceListConfig[SourceList.USA_GOV].sourceColumnName,
    sourceListConfig[SourceList.GOV_MAN].sourceColumnName,
    sourceListConfig[SourceList.US_COURTS].sourceColumnName,
    sourceListConfig[SourceList.OIRA].sourceColumnName,
    sourceListConfig[SourceList.MIL1].sourceColumnName,
    sourceListConfig[SourceList.MIL2].sourceColumnName,
    sourceListConfig[SourceList.DOD_PUBLIC].sourceColumnName,
    sourceListConfig[SourceList.DOTMIL].sourceColumnName,
    sourceListConfig[SourceList.FINAL_URL_WEBSITES].sourceColumnName,
    sourceListConfig[SourceList.HOUSE_117th].sourceColumnName,
    sourceListConfig[SourceList.SENATE_117th].sourceColumnName,
    sourceListConfig[SourceList.GPO_FDLP].sourceColumnName,
    sourceListConfig[SourceList.CISA].sourceColumnName,
    'omb_idea_public',
  ];
  const columnNames = allSites.listColumns().filter(column => !column.startsWith('source_list_')).map(column => `"${column}"`).join(", ");;

  interface AggregatedRow {
    target_url: string;
    [key: string]: boolean | string;  // The source_list columns will be boolean values
  }

  // Step 1: Group by 'target_url' and aggregate the source list columns using OR logic
  let groupedData: { [key: string]: AggregatedRow } = {};

  allSites.groupBy("target_url").aggregate((group: DataFrame) => {
      let aggregated: { [key: string]: string } = {};
      sourceListColumns.forEach(column => {
        let isTrue = '';
        if (group.select(column).toArray().some(row => String(row[0]).toLowerCase() === 'true')) {
          isTrue = 'true';
        } else if (group.select(column).toArray().some(row => String(row[0]).toLowerCase() === 'false')) {
          isTrue = 'false';
        }
        aggregated[column] = isTrue;
      });
      const targetUrl = group.toArray()[0][0];  // target_url is the first column in each group
      if (targetUrl) {
        groupedData[targetUrl] = { target_url: targetUrl, ...aggregated };
      }
  });

  // Step 2: Keep the other columns (non-source_list columns), and use the first occurrence
  let otherColumns = allSites.select("target_url", "branch", "agency", "bureau", "base_domain_pulse");
  otherColumns = otherColumns.dropDuplicates("target_url");

  // Step 3: Manually combine the two dataframes (groupedData and otherColumns)
  let combinedData: any[] = [];

  otherColumns.toArray().forEach(row => {
      const targetUrl = row[0];  // target_url is the first column in each row
      const aggregatedRow = groupedData[targetUrl];
      
      // Combine the non-source columns with the aggregated boolean columns
      // If we find a match in groupedData, combine the rows
      if (aggregatedRow) {
        const combinedRow = row.concat(sourceListColumns.map(column => aggregatedRow[column]));
        combinedData.push(combinedRow);
      } else {
        // Debugging: Log any rows that don't match in groupedData
        //console.log(`No match found for target_url: ${targetUrl}`);
      }
  });

  // Step 4: Create a new DataFrame from the combined data
  let finalDf = new DataFrame(combinedData, ["target_url", "branch", "agency", "bureau", "base_domain_pulse", ...sourceListColumns]);

  return finalDf;
}

/**
 * 
 * @param allSites The DataFrame that you would like to remove non-government and non-military sites from.
 * @param milDomains The DataFrame that contains the military domains.
 * @param govDomains The DataFrame that contains the government domains.
 * @returns The DataFrame with non-government and non-military sites removed.
 */
export function removeNonGovNonMilSites(allSites: DataFrame, milDomains: DataFrame, govDomains: DataFrame): DataFrame {
  const milBaseUrls = new Set(milDomains.select("target_url").toArray().map(row => row[0]));
  const govBaseUrls = new Set(govDomains.select("target_url").toArray().map(row => row[0]));

  //@ts-ignore
  allSites = allSites.withColumn('is_gov', (row) => {
    return govBaseUrls.has(row.get('base_domain').trim());
  });
  //@ts-ignore
  allSites = allSites.withColumn('is_mil', (row) => {
    return milBaseUrls.has(row.get('base_domain').trim());
  });

  //@ts-ignore
  allSites = allSites.filter(row => row.get('is_gov') || row.get('is_mil'));
  allSites = allSites.drop('is_gov');
  allSites = allSites.drop('is_mil');

  return allSites;
}

/**
 * 
 * This function will check if the url contains any of the strings in the containsSet that are surrounded by non-word characters.
 * @param url The URL that you would like to check for the presence of a string in.
 * @param containsSet A set of strings that you would like to check for in the URL.
 * @returns boolean indicating if the URL contains any of the strings in the containsSet.
 */
export function urlContainsCheck(url: string, containsSet: Set<any>): boolean {
  for (let pattern of containsSet) {
    const regex = new RegExp(`[^a-zA-Z0-9](?:${pattern})[^a-zA-Z0-9]`);
    if (regex.test(url)) {
      return true;
    }
  }
  return false;

}

/**
 * 
 * This function will check if the url starts with any of the strings in the startsWithSet.
 * @param url The URL that you would like to check for the presence of a string in.
 * @param startsWithSet A set of strings that you would like to check for in the URL.
 * @returns boolean indicating if the URL starts with any of the strings in the startsWithSet.
 */
export function startsWithCheck(url: string, startsWithSet: Set<any>): boolean {
  for (let prefix of startsWithSet) {
    if (url.startsWith(prefix)) {
      //filterMatches.push(`starts with, ${prefix}, ${url}`);
      return true;
    }
  }
  return false;
}

/**
 * 
 * This function will tag the sites in the allSites DataFrame based on the ignore lists.
 * @param allSites The DataFrame that you would like to remove sites from based on the ignore lists.
 * @param containsDf The DataFrame that contains the strings that the URL contains between non-word characters.
 * @param startsWithDf The DataFrame that contains the strings that the URL starts with.
 * @returns The DataFrame with the sites removed based on the ignore lists.
 */
export function tagIgnoreListSites(allSites: DataFrame, containsDf: DataFrame, startsWithDf: DataFrame): DataFrame {
  const startsWithStrings = new Set(startsWithDf.select("URL begins with:").toArray().map(row => row[0]));
  const containsStrings = new Set(containsDf.select("URL contains between non-word characters:").toArray().map(row => row[0]));
  //@ts-ignore
  allSites = allSites.withColumn('filtered', (row) => {
    const startsWithMatch = startsWithCheck(row.get('target_url'), startsWithStrings);
    const containsMatch = urlContainsCheck(row.get('target_url'), containsStrings);
    return startsWithMatch || containsMatch;
  });
  
  return allSites;
}