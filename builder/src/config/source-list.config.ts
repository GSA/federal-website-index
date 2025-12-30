import { SourceList, SourceListConfigMap } from "../types/config";
import path from "path";

export const sourceListConfig: SourceListConfigMap = {
  [SourceList.FEDERAL_DOMAINS]: {
    shortName: 'gov',
    sourceUrl: 'https://raw.githubusercontent.com/cisagov/dotgov-data/main/current-federal.csv',
    sourceColumnName: 'source_list_federal_domains',
    hasHeaders: true,
  },
  [SourceList.PULSE]: {
    shortName: 'pulse',
    sourceUrl: 'https://raw.githubusercontent.com/GSA/federal-website-index/main/data/source-lists/pulse.csv',
    sourceColumnName: 'source_list_pulse',
    hasHeaders: true,
  },
  [SourceList.DAP]: {
    shortName: 'dap',
    sourceUrl: 'https://analytics.usa.gov/data/live/sites-extended.csv',
    sourceColumnName: 'source_list_dap',
    hasHeaders: true,
  },
  [SourceList.OMB_IDEA]: {
    shortName: 'omb_idea',
    // sourceUrl: 'https://raw.githubusercontent.com/GSA/federal-website-index/main/data/source-lists/omb_idea.csv',
    // sourceUrl: 'https://raw.githubusercontent.com/GSA/federal-website-directory/refs/heads/main/us-government-website-directory.csv',
    sourceUrl: 'https://raw.githubusercontent.com/GSA/public-website-inventory/refs/heads/main/us-gov-public-website-inventory.csv',
    sourceColumnName: 'source_list_omb_idea',
    hasHeaders: true,
  },
  [SourceList.EOTW]: {
    shortName: 'eotw',
    sourceUrl: 'https://raw.githubusercontent.com/GSA/federal-website-index/main/data/source-lists/2020_eot.csv',
    sourceColumnName: 'source_list_eotw',
    hasHeaders: true,
  },
  [SourceList.USA_GOV]: {
    shortName: 'usa_gov',
    sourceUrl: 'https://raw.githubusercontent.com/GSA/federal-website-index/main/data/source-lists/usagov_directory.csv',
    sourceColumnName: 'source_list_usagov',
    hasHeaders: false,
  },
  [SourceList.GOV_MAN]: {
    shortName: 'gov_man',
    sourceUrl: 'https://raw.githubusercontent.com/GSA/federal-website-index/main/data/source-lists/gov_man-22.csv',
    sourceColumnName: 'source_list_gov_man',
    hasHeaders: false,
  },
  [SourceList.US_COURTS]: {
    shortName: 'us_courts',
    sourceUrl: 'https://raw.githubusercontent.com/GSA/federal-website-index/main/data/source-lists/uscourts.csv',
    sourceColumnName: 'source_list_uscourts',
    hasHeaders: false,
  },
  [SourceList.OIRA]: {
    shortName: 'oira',
    sourceUrl: 'https://raw.githubusercontent.com/GSA/federal-website-index/main/data/source-lists/oira.csv',
    sourceColumnName: 'source_list_oira',
    hasHeaders: true,
  },
  [SourceList.OTHER]: {
    shortName: 'other',
    sourceUrl: path.join(__dirname, '../../../data/source-lists/other-websites.csv'),
    sourceColumnName: 'source_list_other',
    hasHeaders: true,
  },
  [SourceList.MIL1]: {
    shortName: 'mil1',
    sourceUrl: 'https://raw.githubusercontent.com/GSA/federal-website-index/main/data/source-lists/dotmil_websites.csv',
    sourceColumnName: 'source_list_mil_1',
    hasHeaders: true,
  },
  [SourceList.MIL2]: {
    shortName: 'mil2',
    sourceUrl: 'https://raw.githubusercontent.com/GSA/federal-website-index/main/data/source-lists/dotmil_websites-2.csv',
    sourceColumnName: 'source_list_mil_2',
    hasHeaders: false,
  },
  [SourceList.MIL_DOMAINS]: {
    shortName: 'mil_domains',
    sourceUrl: 'https://raw.githubusercontent.com/GSA/federal-website-index/main/data/source-lists/dotmil_domains.csv',
    sourceColumnName: '',
    hasHeaders: true,
  },
  [SourceList.BEGINS_IGNORE]: {
    shortName: 'begins_ignore',
    sourceUrl: path.join(__dirname, '../../criteria/ignore-list-begins.csv'),
    sourceColumnName: '',
    hasHeaders: true,
  },
  [SourceList.CONTAINS_IGNORE]: {
    shortName: 'contains_ignore',
    sourceUrl: path.join(__dirname, '../../criteria/ignore-list-contains.csv'),
    sourceColumnName: '',
    hasHeaders: true,
  },
  [SourceList.DOD_PUBLIC]: {
    shortName: 'dod_public',
    sourceUrl: 'https://raw.githubusercontent.com/GSA/federal-website-index/refs/heads/main/data/source-lists/dod_public.csv',
    sourceColumnName: 'source_list_dod_public',
    hasHeaders: true,
  },
  [SourceList.DOTMIL]: {
    shortName: 'dotmil',
    sourceUrl: 'https://raw.githubusercontent.com/GSA/federal-website-index/main/data/source-lists/dotmil_domains.csv',
    sourceColumnName: 'source_list_dotmil',
    hasHeaders: true,
  },
  [SourceList.FINAL_URL_WEBSITES]: {
    shortName: 'final_url_websites',
    sourceUrl: 'https://raw.githubusercontent.com/GSA/federal-website-index/refs/heads/main/data/source-lists/final_url_websites.csv',
    sourceColumnName: 'source_list_final_url_websites',
    hasHeaders: true,
  },
  [SourceList.HOUSE_117th]: {
    shortName: 'house_117th',
    sourceUrl: 'https://raw.githubusercontent.com/GSA/federal-website-index/refs/heads/main/data/source-lists/117th-house.csv',
    sourceColumnName: 'source_list_house_117th',
    hasHeaders: true,
  },
  [SourceList.SENATE_117th]: {
    shortName: 'senate_117th',
    sourceUrl: 'https://raw.githubusercontent.com/GSA/federal-website-index/refs/heads/main/data/source-lists/117th-senate.csv',
    sourceColumnName: 'source_list_senate_117th',
    hasHeaders: true,
  },
  [SourceList.GPO_FDLP]: {
    shortName: 'gpo_fdlp',
    sourceUrl: 'https://raw.githubusercontent.com/GSA/federal-website-index/refs/heads/main/data/source-lists/gpo-fdlp.csv',
    sourceColumnName: 'source_list_gpo_fdlp',
    hasHeaders: true,
  },
  [SourceList.CISA]: {
    shortName: 'cisa',
    sourceUrl: 'https://raw.githubusercontent.com/GSA/federal-website-index/refs/heads/main/data/source-lists/cisa_https.csv',
    sourceColumnName: 'source_list_cisa',
    hasHeaders: true,
  },
  [SourceList.DOD_2025]: {
    shortName: 'dod_2025',
    sourceUrl: 'https://raw.githubusercontent.com/GSA/federal-website-index/refs/heads/main/data/source-lists/dod_2025.csv',
    sourceColumnName: 'source_list_dod_2025',
    hasHeaders: true,
  },
  [SourceList.DAP2]: {
    shortName: 'dap_2',
    sourceUrl: 'https://analytics.usa.gov/data/live/top-100000-domains-30-days.csv',
    sourceColumnName: 'source_list_dap_2',
    hasHeaders: true,
  },
  [SourceList.USAGOV_CLICKS]: {
    shortName: 'usagov_clicks',
    sourceUrl: 'https://raw.githubusercontent.com/GSA/federal-website-index/refs/heads/main/data/source-lists/usagov-search-clicks.csv',
    sourceColumnName: 'source_list_usagov_clicks',
    hasHeaders: true,
  },
  [SourceList.USAGOV_CLICKS_MIL]: {
    shortName: 'usagov_clicks_mil',
    sourceUrl: 'https://raw.githubusercontent.com/GSA/federal-website-index/refs/heads/main/data/source-lists/usagov-search-clicks-mil.csv',
    sourceColumnName: 'source_list_usagov_clicks_mil',
    hasHeaders: true,
  },
  [SourceList.SEARCH_GOV]: {
    shortName: 'search_gov',
    sourceUrl: 'https://raw.githubusercontent.com/GSA/federal-website-index/refs/heads/main/data/source-lists/searchgov_domains.csv',
    sourceColumnName: 'source_list_search_gov',
    hasHeaders: true,
  },
  [SourceList.SEARCH_GOV_MIL]: {
    shortName: 'search_gov_mil',
    sourceUrl: 'https://raw.githubusercontent.com/GSA/federal-website-index/refs/heads/main/data/source-lists/searchgov_domains-mil.csv',
    sourceColumnName: 'source_list_search_gov_mil',
    hasHeaders: true,
  },
  [SourceList.PUBLIC_INVENTORY]: {
    shortName: 'public_inventory',
    sourceUrl: 'https://raw.githubusercontent.com/GSA/public-website-inventory/refs/heads/main/us-gov-public-website-inventory.csv',
    sourceColumnName: 'source_list_public_inventory',
    hasHeaders: true,
  },
  // [SOURCE-ADD-POINT]
  // Add new source list configuration here
  // [SourceList.SOURCE_NAME]: {
  //   shortName: 'source_name',
  //   sourceUrl: 'https://example.com/source-list.csv',
  //   sourceColumnName: 'source_list_source_name',
  //   hasHeaders: true,
  // },
}
