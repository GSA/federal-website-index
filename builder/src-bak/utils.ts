import { IDataFrame, DataFrame, Series } from 'data-forge';
import { csvSnapshots, csvDataDefinitions } from './components/csvDataDefinition';

export function mergeAgencies(df: IDataFrame, agencyDf: IDataFrame): IDataFrame {
  // Merge the dataframes on 'base_domain' column using a left join
  df.join(agencyDf, left => left.base_domain, right => right.base_domain, (left, right) => {
      return {
          ...left,
          agency_x: right ? right.agency : '',
          agency_y: left.agency
          };
      }
  );

  // Fill NaN values with empty strings
  df.select(row => {
      const updatedRow: { [key: string]: any } = {};
      Object.keys(row).forEach(key => {
          updatedRow[key] = row[key] == null ? '' : row[key];
      });
      return updatedRow;
  });

  // Initialize 'agency' column
  df.select(row => {
      if (row.agency === '') {
        if (row.agency_x != '') {
          df.getSeries('agency_x').at(row.index).set(row.agency);
        } else {
          df.getSeries('agency_y').at(row.index).set(row.agency);
        }
      }
  });

  // Drop the temporary 'agency_x' and 'agency_y' columns
  df.dropSeries(['agency_x', 'agency_y']);

  return df;
}

export function mergeBureaus(df: IDataFrame, bureauDf: IDataFrame): IDataFrame {
  // Merge the dataframes on 'base_domain' column using a left join
  df.join(bureauDf, left => left.base_domain, right => right.base_domain, (left, right) => {
      return {
          ...left,
          bureau_x: right ? right.bureau : '',
          bureau_y: left.bureau
          };
      }
  );

  // Fill NaN values with empty strings
  df.select(row => {
      const updatedRow: { [key: string]: any } = {};
      Object.keys(row).forEach(key => {
          updatedRow[key] = row[key] == null ? '' : row[key];
      });
      return updatedRow;
  });

  // Initialize 'bureau' column
  df.select(row => {
      if (row.bureau === '') {
        if (row.bureau_x != '') {
          df.getSeries('bureau_x').at(row.index).set(row.bureau);
        } else {
          df.getSeries('bureau_y').at(row.index).set(row.bureau);
        }
      }
  });

  // Drop the temporary 'bureau_x' and 'bureau_y' columns
  df.dropSeries(['bureau_x', 'bureau_y']);

  return df;
}

export async function mergeDataFrames(leftDf: IDataFrame, rightDf: IDataFrame): Promise<IDataFrame> {
   // Get column names from both DataFrames
   const leftColumns = new Set(leftDf.getColumnNames());
   const rightColumns = new Set(rightDf.getColumnNames());
 
   // Add missing columns from the right DataFrame to the left DataFrame
   const missingColumns = [...rightColumns].filter(col => !leftColumns.has(col));
 
   // Add missing columns with null values to the left DataFrame
   missingColumns.forEach(column => {
     // Create a new Series with null values for all rows in the DataFrame
     const newSeries = new Series(Array(leftDf.count()).fill(null));  // Create an array of `null` values
     leftDf = leftDf.withSeries(column, newSeries);
   });
 
   // Merge the dataframes on 'target_url' column using a left join
   const mergedDf = leftDf.join(
     rightDf,
     left => left.target_url,
     right => right.target_url,
     (left, right) => ({
       ...left,
       ...right,
     })
   );
 
   // Fill NaN/Null values with empty strings for the merged DataFrame
   const finalDf = mergedDf.select(row => {
     const updatedRow: { [key: string]: any } = {};
     Object.keys(row).forEach(key => {
       updatedRow[key] = row[key] == null ? '' : row[key]; // Replace NaN/Null values with empty string
     });
     return updatedRow;
   });
 
   return finalDf;
}

export function convertUrlArrayToDataFrame(data: string[]): IDataFrame {
  const df = new DataFrame({ columnNames: ['target_url'], rows: data.map(row => [row]) });
  return df
}

export function getSnapshotPath(name: string): string | undefined {
  const snapshot = csvSnapshots.find(item => item.name === name);
  return snapshot ? snapshot.snapshotPath : '';
}

export function getDataFrameByName(name: string, origDf = false): IDataFrame | undefined {
  const csvDataDefinition = csvDataDefinitions.find(item => item.name === name);
  if (origDf) {
    return csvDataDefinition ? csvDataDefinition.origDf : undefined;
  }
  return csvDataDefinition ? csvDataDefinition.df : undefined;
}