export type SourceListConfig = {
  shortName: string;
  sourceColumnName: string;
  sourceUrl: string;
  hasHeaders: boolean;
}

export type AnalysisValue = {
  name: string;
  value: string;
  count: number;
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
  OTHER = 'other',
  MIL1 = 'mil1',
  MIL2 = 'mil2',
  MIL_DOMAINS = 'mil_domains',
  BEGINS_IGNORE = 'beings_ignore',
  CONTAINS_IGNORE = 'contains_ignore',
  DOD_PUBLIC = 'dod_public',
  DOTMIL = 'dotmil',
  FINAL_URL_WEBSITES = 'final_url_websites',
  HOUSE_117th = 'house_117th',
  SENATE_117th = 'senate_117th',
  GPO_FDLP = 'gpo_fdlp',
  CISA = 'cisa',
  DOD_2025 = 'dod_2025',
}

export type SourceListConfigMap = Record<SourceList, SourceListConfig>;
