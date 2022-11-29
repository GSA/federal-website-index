from datetime import datetime
import os


dirname = os.path.dirname(__file__)

config = {
    'gov_source_url': 'https://raw.githubusercontent.com/cisagov/dotgov-data/main/current-federal.csv',
    'pulse_source_url': 'https://raw.githubusercontent.com/GSA/data/master/dotgov-websites/pulse-subdomains-snapshot-06-08-2020-https.csv',
    'dap_source_url': 'https://analytics.usa.gov/data/live/sites-extended.csv',
    'omb_source_url': 'https://resources.data.gov/schemas/dcat-us/v1.1/omb_bureau_codes.csv',
    'additional_data_path': os.path.join(dirname, '../data/dataset/other-websites.csv'),
    'ignore_list_path': os.path.join(dirname, '../criteria/ignore-list.csv'),
    'target_url_list_path': os.path.join(dirname, '../data/site-scanning-target-url-list.csv'),
    'gov_snapshot_path': os.path.join(dirname, '../data/snapshots/gov.csv'),
    'pulse_snapshot_path': os.path.join(dirname, '../data/snapshots/pulse.csv'),
    'dap_snapshot_path': os.path.join(dirname, '../data/snapshots/dap.csv'),
    'combined_snapshot_path': os.path.join(dirname, '../data/snapshots/combined.csv'),
    'remove_ignore_path': os.path.join(dirname, '../data/snapshots/remove-ignore.csv'),
    'deduped_snapshot_path': os.path.join(dirname, '../data/snapshots/combined-dedup.csv'),
    'dedup_removed': os.path.join(dirname, '../data/snapshots/dedup-removed.csv'),
    'ignored_removed': os.path.join(dirname, '../data/snapshots/ignored-removed.csv'),
    'nonfederal_removed': os.path.join(dirname, '../data/snapshots/nonfederal-removed.csv'),
    'analysis_csv_path': os.path.join(dirname, '../data/site-scanning-target-url-list-analysis.csv'),
}
