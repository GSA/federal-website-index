import DataFrame from "dataframe-js";
import path from 'path';

const TOP_DOMAIN_LIST_URL = 'https://analytics.usa.gov/data/live/top-100000-domains-30-days.csv';
const DAP_TOP_DOMAIN_LIST_PATH = '../../data/source-lists/dap_top_100000_domains_30_days.csv';

/**
 * The main entry point of dap data collapse
 */
async function main() {

  // Load the top domain list snapshot
  console.log('Loading snapshot data...');
  const sourceSnapshot = await DataFrame.fromCSV(TOP_DOMAIN_LIST_URL, true);

  // We need to remove all www. prefixes from the domain names
  console.log('Removing www. prefixes...');
  //@ts-ignore
  let dapTopList = sourceSnapshot.withColumn('hostname', row => row.get('hostname').replace(/^www\./, ''));

  // Group by hostname and aggregate pageviews and visits
  console.log('Grouping by hostname and aggregating...');
  let dapTopListPageViews = dapTopList.select('hostname', 'pageviews');
  //@ts-ignore
  dapTopListPageViews = dapTopListPageViews.groupBy('hostname').aggregate(group => group.stat.sum('pageviews'));
  dapTopListPageViews = dapTopListPageViews.rename('aggregation', 'pageviews');
  dapTopListPageViews.toCSV(true, path.join(__dirname, '../../data/source-lists/dapTopListPageViews.csv'));
  
  let dapTopListVisits = dapTopList.select('hostname', 'visits');
  //@ts-ignore
  dapTopListVisits = dapTopListVisits.groupBy('hostname').aggregate(group => group.stat.sum('visits'));
  dapTopListVisits = dapTopListVisits.rename('aggregation', 'visits');
  dapTopListVisits.toCSV(true, path.join(__dirname, '../../data/source-lists/dapTopListVisits.csv'));

  dapTopList = dapTopListPageViews.union(dapTopListVisits);
  
  // Save the domain list to a CSV file
  console.log('Saving domain list to CSV...');
  dapTopList.toCSV(true, path.join(__dirname, DAP_TOP_DOMAIN_LIST_PATH));

}

main();