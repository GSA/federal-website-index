import fetch from 'node-fetch';
import { readFileSync, writeFileSync } from 'fs';
import { type IDataFrame, DataFrame, fromCSV } from 'data-forge';
import { CsvDataDefinition } from './components/csvDataDefinition';
import { getSnapshotPath } from './utils';



export function checkForUrl(path: string): boolean {
  return path.startsWith('http');
}

export async function readCsvFromLocalPath(path: string): Promise<string> {
  try {
    // Fetch the CSV file from the path
    return readFileSync(path, 'utf8');

  } catch (error) {
      console.error('Error fetching CSV:', error);
      throw error;  // Re-throw the error after logging
  }
}

export async function readCsvFromUrl(url: string): Promise<string> {
  try {
    // Fetch the CSV file from the URL
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }
    
    return await response.text();

  } catch (error) {
      console.error('Error fetching CSV:', error);
      throw error;  // Re-throw the error after logging
  }
}

export async function loadCsvIntoDataFrame(csvPath: string, sourceColumns? : string[]): Promise<IDataFrame> {
  const isUrl = checkForUrl(csvPath);
  const csvString = isUrl ? await readCsvFromUrl(csvPath) : await readCsvFromLocalPath(csvPath);

  const df = sourceColumns ? fromCSV(csvString, { columnNames: sourceColumns }) : fromCSV(csvString);
  return df;
}

export async function generateSnapshotFromDataFrame(df: IDataFrame, snapshotPath: string): Promise<void> {
  try {
    // Write the data frame to a CSV file
    console.log('Writing snapshot to:', snapshotPath);
    writeFileSync(snapshotPath, df.toCSV());

  } catch (error) {
      console.error('Error writing snapshot:', error);
      throw error;  // Re-throw the error after logging
  }
}

export async function createSnapshot(snapshotPath: string, dataFrame: IDataFrame): Promise<void> {
  try {
    const combinedSnapshotPath = getSnapshotPath(snapshotPath);
    if (!combinedSnapshotPath) {
      throw new Error(`${snapshotPath} snapshot path not found`);
    }
    await generateSnapshotFromDataFrame(dataFrame, combinedSnapshotPath);

  } catch (error) {
      console.error('Error writing snapshot:', error);
      throw error;  // Re-throw the error after logging
  }
}

export async function formatOriginalDataFrame(dataDefinition: CsvDataDefinition): Promise<IDataFrame> {
  const { df, renamedColumns } = dataDefinition;
  if (df) {
    if (renamedColumns) {
      df.renameSeries(renamedColumns);
    }
    return df;
  } else {
    throw new Error('Dataframe not loaded');
  }
}

export async function processDataDefinition(dataDefinition: CsvDataDefinition): Promise<IDataFrame> {
  if (dataDefinition.df) {
    let {
      name,
      df,
      snapshotPath,
      sourceColumns,
      droppedColumns,
      renamedColumns,
      sourceListName
    } = dataDefinition;

    if (snapshotPath) {
      await generateSnapshotFromDataFrame(df, snapshotPath);
    }  

    if (droppedColumns) {
      df = df.dropSeries(droppedColumns);
    }
    if (renamedColumns) {
      df = df.renameSeries(renamedColumns);
    }
    if (sourceListName) {
      df = df.generateSeries({ sourceListName: () => 'TRUE' });
    }

    const hasTargetUrl = df.hasSeries('target_url');

    if (hasTargetUrl) {
      df = df.select(row => ({
        ...row,
        target_url: row.target_url && typeof row.target_url === 'string' ? row.target_url.toLowerCase() : row.target_url
      }));
    }

    // Do additional steps for the 'gov' data definition
    if (name === 'gov') {
      // Generate a series for the base_domain_gov column
      df = df.generateSeries({ base_domain_gov: row => row.target_url });

      // Strip out 'Federal - ' from the branch names
      df = df.select(row => ({
        ...row,
        branch: row.branch.replace(/^Federal - /, '')
      }));

      // This is a step I believe we want to remove.
      // Create a copy of the data frame and add www. to the beginning of the target_url and then merge the two data frames
      const df2 = df.select(row => ({
        ...row,
        target_url: `www.${row.target_url}`
      }));
      df = df.concat(df2);
    }

      // Do additional steps for the 'ombIdea' data definition
    if (name === 'ombIdea') {
      // Remap all omb_idea_public values Yes to True and No to False
      df = df.select(row => ({
        ...row,
        omb_idea_public: row.omb_idea_public === 'Yes'
      }));
    }

    if (hasTargetUrl) {
      df = df.distinct(row => row.target_url);
    }

    return df;
  } else {
    throw new Error('Dataframe not loaded');
  }
}