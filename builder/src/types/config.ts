export type SourceListConfig = {
  shortName: string;
  sourceColumnName: string;
  sourceUrl: string;
}

export enum SourceList {
  FEDERAL_DOMAINS = 'gov',
  PULSE = 'pulse',
  // DAP = 'dap',
  // OMB_IDEA = 'omb_idea',
  // ... etc ..
}

export type SourceListConfigMap = Record<SourceList, SourceListConfig>;
