export type SourceListConfig = {
  shortName: string;
  sourceColumnName: string;
  sourceUrl: string;
  hasHeaders: boolean;
}

export enum SourceList {
  FEDERAL_DOMAINS = 'gov',
  PULSE = 'pulse',
  DAP = 'dap',
  OMB_IDEA = 'omb_idea',
  EOTW = 'eotw',
  USA_GOV = 'usa_gov_directory',
  GOV_MAN = 'gov_man',
  US_COURTS = 'us_courts',
  OIRA = 'oira',
  MIL1 = 'mil1',
  MIL2 = 'mil2',
  // ... etc ..
}

export type SourceListConfigMap = Record<SourceList, SourceListConfig>;
