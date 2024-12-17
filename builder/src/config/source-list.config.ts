import { SourceList, SourceListConfigMap } from "../types/config";
import path from "path";

export const sourceListConfig: SourceListConfigMap = {
  [SourceList.FEDERAL_DOMAINS]: {
    shortName: 'gov',
    sourceUrl: 'https://raw.githubusercontent.com/cisagov/dotgov-data/main/current-federal.csv',
    sourceColumnName: 'source_list_federal_domains',
  },
  [SourceList.PULSE]: {
    shortName: 'pulse',
    sourceUrl: 'https://raw.githubusercontent.com/GSA/federal-website-index/main/data/dataset/pulse.csv',
    sourceColumnName: 'source_list_pulse',
  },
}
