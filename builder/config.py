from datetime import datetime
import os


dirname = os.path.dirname(__file__)

config = {
    'gov_source_url': 'https://raw.githubusercontent.com/cisagov/dotgov-data/main/current-federal.csv',
    'pulse_source_url': 'https://raw.githubusercontent.com/GSA/data/master/dotgov-websites/pulse-subdomains-snapshot-06-08-2020-https.csv',
    'dap_source_url': 'https://analytics.usa.gov/data/live/sites-extended.csv',
    'omb_source_url': 'https://resources.data.gov/schemas/dcat-us/v1.1/omb_bureau_codes.csv',
    'other_websites_path': os.path.join(dirname, '../data/dataset/other-websites.csv'),
    'ignore_list_begins_path': os.path.join(dirname, '../criteria/ignore-list-begins.csv'),
    'ignore_list_contains_path': os.path.join(dirname, '../criteria/ignore-list-contains.csv'),
    'target_url_list_path': os.path.join(dirname, '../data/site-scanning-target-url-list.csv'),
    'gov_snapshot_path': os.path.join(dirname, '../data/snapshots/gov.csv'),
    'pulse_snapshot_path': os.path.join(dirname, '../data/snapshots/pulse.csv'),
    'dap_snapshot_path': os.path.join(dirname, '../data/snapshots/dap.csv'),
    'other_snapshot_path': os.path.join(dirname, '../data/snapshots/other.csv'),
    'combined_snapshot_path': os.path.join(dirname, '../data/snapshots/combined.csv'),
    'remove_ignore_begins_path': os.path.join(dirname, '../data/snapshots/remove-ignore-begins.csv'),
    'remove_ignore_contains_path': os.path.join(dirname, '../data/snapshots/remove-ignore-contains.csv'),
    'deduped_snapshot_path': os.path.join(dirname, '../data/snapshots/combined-dedup.csv'),
    'dedup_removed': os.path.join(dirname, '../data/snapshots/dedup-removed.csv'),
    'ignored_removed_begins': os.path.join(dirname, '../data/snapshots/ignored-removed-begins.csv'),
    'ignored_removed_contains': os.path.join(dirname, '../data/snapshots/ignored-removed-contains.csv'),
    'nonfederal_removed': os.path.join(dirname, '../data/snapshots/nonfederal-removed.csv'),
    'analysis_csv_path': os.path.join(dirname, '../data/site-scanning-target-url-list-analysis.csv'),
    'url_df_pre_base_domains_merged': os.path.join(dirname, '../data/test/url_df_pre_base_domains_merged.csv'),
    'url_df_post_base_domains_merged': os.path.join(dirname, '../data/test/url_df_post_base_domains_merged.csv'),
}
