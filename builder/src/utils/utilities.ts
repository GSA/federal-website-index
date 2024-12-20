import DataFrame from "dataframe-js";
import { sourceListConfig } from "../config/source-list.config";
import { SourceList } from "../types/config";
import { Data } from "ws";

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
    return targetUrl;
  });
  return sourceDataFrame;
}


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
  ];
  const columnNames = allSites.listColumns().filter(column => !column.startsWith('source_list_')).map(column => `"${column}"`).join(", ");;

  interface AggregatedRow {
    target_url: string;
    [key: string]: boolean | string;  // The source_list columns will be boolean values
  }

  // Step 1: Group by 'target_url' and aggregate the source list columns using OR logic
  let groupedData: { [key: string]: AggregatedRow } = {};  // This will store the grouped data with target_url as key

  allSites.groupBy("target_url").aggregate((group: DataFrame) => {
      let aggregated: { [key: string]: boolean } = {};  // Aggregating boolean values for source list columns
      sourceListColumns.forEach(column => {
        const isTrue = group.select(column).toArray().some(row => String(row[0]).toLowerCase() === 'true');
        aggregated[column] = isTrue;
      });
      const targetUrl = group.toArray()[0][0];  // target_url is the first column in each group
      if (targetUrl) {
        groupedData[targetUrl] = { target_url: targetUrl, ...aggregated };  // Store the aggregated data with target_url as key
      }
  });

  // Step 2: Keep the other columns (non-source_list columns), and use the first occurrence
  let otherColumns = allSites.select("target_url", "branch", "agency", "bureau", "base_domain_pulse", "omb_idea_public");
  otherColumns = otherColumns.dropDuplicates("target_url");

  // Step 3: Manually combine the two dataframes (groupedData and otherColumns)
  let combinedData: any[] = [];

  otherColumns.toArray().forEach(row => {
      const targetUrl = row[0];  // target_url is the first column in each row
      const aggregatedRow = groupedData[targetUrl];  // Directly access the aggregated row by target_url
      
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
  let finalDf = new DataFrame(combinedData, ["target_url", "branch", "agency", "bureau", "base_domain_pulse", "omb_idea_public", ...sourceListColumns]);

  return finalDf;
}

export function removeNonGovNonMilSites(allSites: DataFrame, milDomains: DataFrame, govDomains: DataFrame): DataFrame {
  // Step 1: Extract base_domain columns from allSites, milDomains, and govDomains
  const allSitesBaseUrls = allSites.select("base_domain");
  const milBaseUrls = new Set(milDomains.select("target_url").toArray().map(row => row[0]));
  const govBaseUrls = new Set(govDomains.select("target_url").toArray().map(row => row[0]));

  // Step 2: Create a boolean mask for matching base_domains
  const isInMilOrGov = allSitesBaseUrls.toArray().map(row => {
    const baseUrl = row[0];  // Extract base_domain value
    return milBaseUrls.has(baseUrl) || govBaseUrls.has(baseUrl);
  });

  // Step 3: Use the boolean mask to retain rows with matching base_domains
  const filteredRows = allSites.toArray().filter((_, index) => isInMilOrGov[index]);

  // Step 4: Create a new DataFrame with the filtered rows
  return new DataFrame(filteredRows, allSites.listColumns());
}

export function urlContainsCheck(url: string, containsSet: Set<any>): boolean {
  for (let pattern of containsSet) {
    const regex = new RegExp(`[^a-zA-Z0-9](?:${pattern})[^a-zA-Z0-9]`);
    if (regex.test(url)) {
      //filterMatches.push(`contains, ${pattern}, ${url}`);
      return true;
    }
  }
  return false;

}

export function startsWithCheck(url: string, startsWithSet: Set<any>): boolean {
  for (let prefix of startsWithSet) {
    if (url.startsWith(prefix)) {
      //filterMatches.push(`starts with, ${prefix}, ${url}`);
      return true;
    }
  }
  return false;
}

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