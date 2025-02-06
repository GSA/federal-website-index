import DataFrame from "dataframe-js";
import path from 'path';

const SNAPSHOT_ALL_URL = 'https://api.gsa.gov/technology/site-scanning/data/weekly-snapshot-all.csv';
const FINAL_URL_WEBSITE_PATH = '../../data/dataset/final_url_website.csv';

/**
 * The main entry point of the Final URL Builder.
 */
async function main() {

  // Load the snapshot data
  console.log('Loading snapshot data...');
  const sourceSnapshot = await DataFrame.fromCSV(SNAPSHOT_ALL_URL, true);

  // We only want to keep the 'domain' column from the snapshot
  console.log('Extracting domain column...');
  let domainList = sourceSnapshot.select("domain");

  // Remove empty rows
  console.log('Removing empty rows...');
  //@ts-ignore
  domainList = domainList.filter(row => row.get('domain') != '');

  // Save the domain list to a CSV file
  console.log('Saving domain list to CSV...');
  domainList.toCSV(true, path.join(__dirname, FINAL_URL_WEBSITE_PATH));

}

main();