import { csvDataDefinitions, csvSnapshots } from './components/csvDataDefinition';
import { processDataDefinition, generateSnapshotFromDataFrame, loadCsvIntoDataFrame, createSnapshot, formatOriginalDataFrame } from 'csvHandler';
import { convertUrlArrayToDataFrame, getSnapshotPath, getDataFrameByName, mergeDataFrames } from './utils';
import path from 'path';

export async function buildUrlList() : Promise<void> {
  const analysis: { [key: string]: number } = {};
  const urlList: string[] = [];

  for (const dataDefinition of csvDataDefinitions) {
    dataDefinition.df = await loadCsvIntoDataFrame(dataDefinition.source, dataDefinition.sourceColumns);
    dataDefinition.origDf = await formatOriginalDataFrame(dataDefinition);
    if (dataDefinition.analysis) {
      analysis[dataDefinition.analysis] = dataDefinition.df.count();
    }

    // Remove this when done testing
    await generateSnapshotFromDataFrame(dataDefinition.df, path.join(__dirname, '../data/testing/', `${dataDefinition.name}.csv`));

    dataDefinition.df = await processDataDefinition(dataDefinition);
    dataDefinition.df.forEach(row => {
      if (row.target_url){
        urlList.push(row.target_url);
      }
    });
  }

  // Generate a snapshot from the combined URL list
  analysis['combined url list length'] = urlList.length;
  let combinedUrlListDf = convertUrlArrayToDataFrame(urlList);
  await createSnapshot('combinedSnapshot', combinedUrlListDf);

  // remove duplicates
  let duplicateUrls = combinedUrlListDf
    .getSeries('target_url')
    .groupBy(x => x)
    .where(group => group.count() > 1) 
    .select(group => group.first())
    .toArray();
  const dedupedUrlListDf = convertUrlArrayToDataFrame(duplicateUrls);
  await createSnapshot('dedupedRemovedSnapshot', dedupedUrlListDf);

  combinedUrlListDf = combinedUrlListDf.distinct(row => row.target_url);
  analysis['deduped url list length'] = combinedUrlListDf.count();
  await createSnapshot('dedupedSnapshot', combinedUrlListDf);

  // Remove urls with the ignore-listed strings at the beginning of the urls
  const ignoreListBegins = getDataFrameByName('ignoreListBegins');
  if (!ignoreListBegins) {
    throw new Error('Ignore list begins not found');
  }
  let ignoreBeginsValues = ignoreListBegins.getSeries('value').toArray();
  let ignoredBeginsDf = combinedUrlListDf.where(row => {
    return ignoreBeginsValues.some(value => row.target_url.startsWith(value));
  });
  await createSnapshot('ignoredRemovedBegins', ignoredBeginsDf);

  combinedUrlListDf = combinedUrlListDf.where(row => {
    return !ignoreBeginsValues.some(value => row.target_url.startsWith(value));
  });
  await createSnapshot('removeIgnoreBegins', combinedUrlListDf);
  analysis['url list length after ignore list checking beginning of urls processed'] = combinedUrlListDf.count();


  // remove URLs with ignore-listed strings contained anywhere in urls
  const ignoreListContains = getDataFrameByName('ignoreListContains');
  if (!ignoreListContains) {
    throw new Error('ignoreListContains not found');
  }
  let ignoreContainsValues = ignoreListBegins.getSeries('value').toArray();
  let ignoredContainsDf = combinedUrlListDf.where(row => {
    return ignoreContainsValues.some(value => row.target_url.includes(value));
  });
  await createSnapshot('ignoreRemovedContains', ignoredContainsDf);

  combinedUrlListDf = combinedUrlListDf.where(row => {
    return !ignoreContainsValues.some(value => row.target_url.includes(value));
  });
  await createSnapshot('removeIgnoreContains', combinedUrlListDf);
  analysis['url list length after ignore list checking entire url'] = combinedUrlListDf.count();

  // Re-add urls we do not want to ignore
  const ignoreListExcept = getDataFrameByName('ignoreListExcept');
  if (!ignoreListExcept) {
    throw new Error('ignoreListExcept not found');
  }
  combinedUrlListDf = combinedUrlListDf.concat(ignoreListExcept);
  console.log('Combined URL Count', combinedUrlListDf.count());

  // Merge data back in
  const govOrigDf = getDataFrameByName('gov', true);
  if (!govOrigDf) {
    throw new Error('govOrigDf not found');
  }
  combinedUrlListDf = await mergeDataFrames(combinedUrlListDf, govOrigDf);
  console.log(combinedUrlListDf.toString());
  console.log('Combined URL Count', combinedUrlListDf.count());

  console.log('Analysis', analysis);

}


buildUrlList();