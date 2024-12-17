import path from 'path';
import { IDataFrame } from 'data-forge';

export type CsvDataDefinition = {
  name: string;
  source: string;
  df?: IDataFrame;
  origDf?: IDataFrame;
  snapshotPath?: string;
  sourceColumns?: string[];
  droppedColumns?: string[];
  renamedColumns?: { [key: string]: string };
  sourceListName?: string;
  lowerStringCheck?: boolean;
  analysis?: string;
};

export type CsvSnapshot = {
  name: string;
  df?: IDataFrame;
  snapshotPath: string;
};

export const csvDataDefinitions: CsvDataDefinition[] = [
  {
    name: 'gov',
    source: 'https://raw.githubusercontent.com/cisagov/dotgov-data/main/current-federal.csv',
    snapshotPath: path.join(__dirname, '../../data/snapshots/gov.csv'),
    droppedColumns: ['City', 'State', 'Security contact email'],
    renamedColumns: {'Domain name': 'target_url', 'Domain type': 'branch', 'Agency': 'agency', 'Organization name': 'bureau'},
    sourceListName: 'source_list_federal_domains',
    analysis: 'gov url list length',
  },
  {
    name: 'pulse',
    source: 'https://raw.githubusercontent.com/GSA/federal-website-index/main/data/dataset/pulse.csv',
    snapshotPath: path.join(__dirname, '../../data/snapshots/pulse.csv'),
    droppedColumns: ['URL', 'Agency', 'Sources', 'Compliant with M-15-13 and BOD 18-01', 'Enforces HTTPS', 'Strict Transport Security (HSTS)', 'Free of RC4/3DES and SSLv2/SSLv3', '3DES', 'RC4', 'SSLv2', 'SSLv3', 'Preloaded'],
    renamedColumns: {'Domain': 'target_url', 'Base Domain': 'base_domain_pulse'},
    sourceListName: 'source_list_pulse',
    analysis: 'pulse url list length',
  },
  {
    name: 'dap',
    source: 'https://analytics.usa.gov/data/live/sites-extended.csv',
    snapshotPath: path.join(__dirname, '../../data/snapshots/dap.csv'),
    droppedColumns: ['visits'],
    renamedColumns: {'domain': 'target_url'},
    sourceListName: 'source_list_dap',
    analysis: 'dap url list length',
  },
  {
    name: 'ombIdea',
    source: 'https://raw.githubusercontent.com/GSA/federal-website-index/main/data/dataset/omb_idea.csv',
    snapshotPath: path.join(__dirname, '../../data/snapshots/omb_idea.csv'),
    renamedColumns: {'Website': 'target_url', 'Public-Facing': 'omb_idea_public'},
    sourceListName: 'source_list_omb_idea',
    analysis: 'omb idea url list length',
  },
  {
    name: 'eotw',
    source: 'https://raw.githubusercontent.com/GSA/federal-website-index/main/data/dataset/2020_eot.csv',
    snapshotPath: path.join(__dirname, '../../data/snapshots/2020_eot.csv'),
    renamedColumns: {'URL': 'target_url'},
    sourceListName: 'source_list_eotw',
    analysis: 'eotw url list length',
  },
  {
    name: 'usagovDirectory',
    source: 'https://raw.githubusercontent.com/GSA/federal-website-index/main/data/dataset/usagov_directory.csv',
    snapshotPath: path.join(__dirname, '../../data/snapshots/usagov_directory.csv'),
    sourceColumns: ['URL'],
    renamedColumns: {'URL': 'target_url'},
    sourceListName: 'source_list_usagov',
    analysis: 'usagov url list length',
  },
  {
    name: 'govMan',
    source: 'https://raw.githubusercontent.com/GSA/federal-website-index/main/data/dataset/gov_man-22.csv',
    snapshotPath: path.join(__dirname, '../../data/snapshots/gov_man_22.csv'),
    sourceColumns: ['URL'],
    renamedColumns: {'URL': 'target_url'},
    sourceListName: 'source_list_gov_man',
    analysis: 'gov_man url list length',
  },
  {
    name: 'uscourts',
    source: 'https://raw.githubusercontent.com/GSA/federal-website-index/main/data/dataset/uscourts.csv',
    snapshotPath: path.join(__dirname, '../../data/snapshots/uscourts.csv'),
    sourceColumns: ['URL'],
    renamedColumns: {'URL': 'target_url'},
    sourceListName: 'source_list_uscourts',
    analysis: 'uscourts url list length',
  },
  {
    name: 'oira',
    source: 'https://raw.githubusercontent.com/GSA/federal-website-index/main/data/dataset/oira.csv',
    snapshotPath: path.join(__dirname, '../../data/snapshots/oira.csv'),
    renamedColumns: {'URL': 'target_url'},
    sourceListName: 'source_list_oira',
    analysis: 'oira url list length',
  },
  {
    name: 'mil1',
    source: 'https://raw.githubusercontent.com/GSA/federal-website-index/main/data/dataset/dotmil_websites.csv',
    lowerStringCheck: true,
    renamedColumns: {'Website': 'target_url'},
    sourceListName: 'source_list_mil_1',
    analysis: '.mil first url list length',
  },
  {
    name: 'mil2',
    source: 'https://raw.githubusercontent.com/GSA/federal-website-index/main/data/dataset/dotmil_websites-2.csv',
    sourceColumns: ['URL'],
    lowerStringCheck: true,
    renamedColumns: {'URL': 'target_url'},
    sourceListName: 'source_list_mil_2',
    analysis: '.mil second url list length',
  },
  {
    name: 'milDomains',
    source: 'https://raw.githubusercontent.com/GSA/federal-website-index/main/data/dataset/dotmil_domains.csv',
  },
  {
    name: 'branchList',
    source: 'https://raw.githubusercontent.com/cisagov/dotgov-data/main/current-federal.csv',
  },
  {
    name: 'otherWebsites',
    source: path.join(__dirname, '../../../data/dataset/other-websites.csv'),
    snapshotPath: path.join(__dirname, '../../data/snapshots/other.csv'),
    sourceListName: 'source_list_other',
    analysis: 'other website url list length',
  },
  {
    name: 'ignoreListBegins',
    droppedColumns: ['Rational'],
    renamedColumns: {'URL begins with:': 'value'},
    source: path.join(__dirname, '../../../criteria/ignore-list-begins.csv'),
  },
  {
    name: 'ignoreListContains',
    droppedColumns: ['Rational'],
    renamedColumns: {'URL contains between non-word characters:': 'value'},
    source: path.join(__dirname, '../../../criteria/ignore-list-contains.csv'),
  },
  {
    name: 'ignoreListExcept',
    renamedColumns: {'URL': 'target_url'},
    source: path.join(__dirname, '../../../criteria/ignore-except.csv'),
  },
];

export const csvSnapshots: CsvSnapshot[] = [
  {
    name: 'targetUrlList',
    snapshotPath: path.join(__dirname, '../../data/site-scanning-target-url-list.csv'),
  },
  {
    name: 'combinedSnapshot',
    snapshotPath: path.join(__dirname, '../../data/snapshots/combined.csv'),
  },
  {
    name: 'removeIgnoreBegins',
    snapshotPath: path.join(__dirname, '../../data/snapshots/remove-ignore-begins.csv'),
  },
  {
    name: 'removeIgnoreContains',
    snapshotPath: path.join(__dirname, '../../data/snapshots/remove-ignore-contains.csv'),
  },
  {
    name: 'dedupedSnapshot',
    snapshotPath: path.join(__dirname, '../../data/snapshots/combined-dedup.csv'),
  },
  {
    name: 'dedupedRemovedSnapshot',
    snapshotPath: path.join(__dirname, '../../data/snapshots/dedup-removed.csv'),
  },
  {
    name: 'ignoredRemovedBegins',
    snapshotPath: path.join(__dirname, '../../data/snapshots/ignored-removed-begins.csv'),
  },
  {
    name: 'ignoreRemovedContains',
    snapshotPath: path.join(__dirname, '../../data/snapshots/ignored-removed-contains.csv'),
  },
  {
    name: 'nonFederalRemoved',
    snapshotPath: path.join(__dirname, '../../data/snapshots/nonfederal-removed.csv'),
  },
  {
    name: 'analysis',
    snapshotPath: path.join(__dirname, '../../data/site-scanning-target-url-list-analysis.csv'),
  },
];