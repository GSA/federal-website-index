import os
import pandas as pd
from helpers import csv_to_df, round_float, dict_to_csv


dirname = os.path.dirname(__file__)

GOV_SOURCE_URL = 'https://raw.githubusercontent.com/cisagov/dotgov-data/main/current-federal.csv'
PULSE_SOURCE_URL = 'https://raw.githubusercontent.com/GSA/data/master/dotgov-websites/pulse-subdomains-snapshot-06-08-2020-https.csv'
DAP_SOURCE_URL = 'https://analytics.usa.gov/data/live/sites-extended.csv'
OMB_SOURCE_URL = 'https://resources.data.gov/schemas/dcat-us/v1.1/omb_bureau_codes.csv'
OMB_IDEA_SOURCE_URL = 'https://raw.githubusercontent.com/GSA/federal-website-index/main/data/dataset/omb_idea.csv'
EOTW_2020_SOURCE_URL = 'https://raw.githubusercontent.com/GSA/federal-website-index/main/data/dataset/2020_eot.csv'
USAGOV_DIRECTORY_SOURCE_URL = 'https://raw.githubusercontent.com/GSA/federal-website-index/main/data/dataset/usagov_directory.csv'
GOV_MAN_22_SOURCE_URL = 'https://raw.githubusercontent.com/GSA/federal-website-index/main/data/dataset/gov_man-22.csv'
USCOURTS_SOURCE_URL = 'https://raw.githubusercontent.com/GSA/federal-website-index/main/data/dataset/uscourts.csv'
OIRA_SOURCE_URL = 'https://raw.githubusercontent.com/GSA/federal-website-index/main/data/dataset/oira.csv'
MIL_SOURCE_URL_1 = 'https://raw.githubusercontent.com/GSA/federal-website-index/main/data/dataset/dotmil_websites.csv'
MIL_SOURCE_URL_2 = 'https://raw.githubusercontent.com/GSA/federal-website-index/main/data/dataset/dotmil_websites-2.csv'
MIL_DOMAINS_URL = 'https://raw.githubusercontent.com/GSA/federal-website-index/main/data/dataset/dotmil_domains.csv'
BRANCH_SOURCE_LIST_URL = 'https://raw.githubusercontent.com/cisagov/dotgov-data/main/current-federal.csv'

OTHER_WEBSITES_PATH = os.path.join(dirname, '../data/dataset/other-websites.csv')
INGORE_LIST_BEGINS_PATH= os.path.join(dirname, '../criteria/ignore-list-begins.csv')
IGNORE_LIST_CONTAINS_PATH= os.path.join(dirname, '../criteria/ignore-list-contains.csv')
IGNORE_LIST_EXCEPT_PATH = os.path.join(dirname, '../criteria/ignore-except.csv')
TARGET_URL_LIST_PATH = os.path.join(dirname, '../data/site-scanning-target-url-list.csv')

GOV_SNAPSHOT_PATH = os.path.join(dirname, '../data/snapshots/gov.csv')
PULSE_SNAPSHOT_PATH = os.path.join(dirname, '../data/snapshots/pulse.csv')
DAP_SNAPSHOT_PATH = os.path.join(dirname, '../data/snapshots/dap.csv')
OMB_IDEA_SNAPSHOT_PATH = os.path.join(dirname, '../data/snapshots/omb_idea.csv')
EOTW_2020_SNAPSHOT_PATH = os.path.join(dirname, '../data/snapshots/2020_eot.csv')
USAGOV_DIRECTORY_SNAPSHOT_PATH = os.path.join(dirname, '../data/snapshots/usagov_directory.csv')
GOV_MAN_22_SNAPSHOT_PATH = os.path.join(dirname, '../data/snapshots/gov_man_22.csv')
USCOURTS_SNAPSHOT_PATH = os.path.join(dirname, '../data/snapshots/uscourts.csv')
OIRA_SNAPSHOT_PATH = os.path.join(dirname, '../data/snapshots/oira.csv')
OTHER_SNAPSHOT_PATH = os.path.join(dirname, '../data/snapshots/other.csv')
COMBINED_SNAPSHOT_PATH = os.path.join(dirname, '../data/snapshots/combined.csv')
REMOVE_IGNORE_BEGINS_PATH = os.path.join(dirname, '../data/snapshots/remove-ignore-begins.csv')
REMOVE_IGNORE_CONTAINS_PATH = os.path.join(dirname, '../data/snapshots/remove-ignore-contains.csv')
DEDUPED_SNAPSHOT_PATH = os.path.join(dirname, '../data/snapshots/combined-dedup.csv')
DEDUP_REMOVED_SNAPSHOT_PATH = os.path.join(dirname, '../data/snapshots/dedup-removed.csv')
INGORED_REMOVED_BEGINS_PATH = os.path.join(dirname, '../data/snapshots/ignored-removed-begins.csv')
IGNORED_REMOVED_CONTAINS_PATH = os.path.join(dirname, '../data/snapshots/ignored-removed-contains.csv')
NONFEDERAL_REMOVED_PATH = os.path.join(dirname, '../data/snapshots/nonfederal-removed.csv')
ANALYSIS_CSV_PATH = os.path.join(dirname, '../data/site-scanning-target-url-list-analysis.csv')
URL_DF_PRE_BASE_DOMAINS_MERGED = os.path.join(dirname, '../data/test/url_df_pre_base_domains_merged.csv')
URL_DF_POST_BASE_DOMAINS_MERGED = os.path.join(dirname, '../data/test/url_df_post_base_domains_merged.csv')

def fetch_data(analysis):
    # import data
    gov_df = csv_to_df(GOV_SOURCE_URL)
    pulse_df = csv_to_df(PULSE_SOURCE_URL)
    dap_df = csv_to_df(DAP_SOURCE_URL)
    # datasets added in February, 2024
    omb_idea_df = csv_to_df(OMB_IDEA_SOURCE_URL)
    eotw_df = csv_to_df(EOTW_2020_SOURCE_URL)
    usagov_df = csv_to_df(USAGOV_DIRECTORY_SOURCE_URL, has_headers=False)
    gov_man_df = csv_to_df(GOV_MAN_22_SOURCE_URL, has_headers=False)
    uscourts_df = csv_to_df(USCOURTS_SOURCE_URL, has_headers=False)
    oira_df = csv_to_df(OIRA_SOURCE_URL)
    # other websites
    other_df = pd.read_csv(OTHER_WEBSITES_PATH)
    # military
    first_mil_df= csv_to_df(MIL_SOURCE_URL_1)
    second_mil_df = csv_to_df(MIL_SOURCE_URL_2, has_headers=False)

    # track length of source datasets
    analysis['gov url list length'] = len(gov_df.index)
    analysis['pulse url list length'] = len(pulse_df.index)
    analysis['dap url list length'] = len(dap_df.index)
    analysis['omb idea url list length'] = len(omb_idea_df.index)
    analysis['eotw url list length'] = len(eotw_df.index)
    analysis['usagov url list length'] = len(usagov_df.index)
    analysis['gov_man url list length'] = len(gov_man_df.index)
    analysis['uscourts url list length'] = len(uscourts_df.index)
    analysis['oira url list length'] = len(oira_df.index)
    analysis['.mil first url list length'] = len(first_mil_df.index)
    analysis['.mil second url list length'] = len(second_mil_df.index)
    analysis['other website url list length'] = len(other_df.index)

    # create new snapshots of source files
    gov_df.to_csv(GOV_SNAPSHOT_PATH, index=False)
    pulse_df.to_csv(PULSE_SNAPSHOT_PATH, index=False)
    dap_df.to_csv(DAP_SNAPSHOT_PATH, index=False)
    omb_idea_df.to_csv(OMB_IDEA_SNAPSHOT_PATH, index=False)
    eotw_df.to_csv(EOTW_2020_SNAPSHOT_PATH, index=False)
    usagov_df.to_csv(USAGOV_DIRECTORY_SNAPSHOT_PATH, index=False)
    gov_man_df.to_csv(GOV_MAN_22_SNAPSHOT_PATH, index=False)
    uscourts_df.to_csv(USCOURTS_SNAPSHOT_PATH, index=False)
    oira_df.to_csv(OIRA_SNAPSHOT_PATH, index=False)
    other_df.to_csv(OTHER_SNAPSHOT_PATH, index=False)
    return gov_df, pulse_df, dap_df, omb_idea_df, eotw_df, usagov_df, gov_man_df, \
        uscourts_df, oira_df, other_df, first_mil_df, second_mil_df, analysis

def format_gov_df(df):
    # drop unnecessary columns
    df = df.drop(columns=['City', 'State', 'Security contact email'])
    # rename columns
    df = df.rename(columns={'Domain name': 'target_url', 'Domain type': 'branch', 'Agency': 'agency', 'Organization name': 'bureau'})
    # convert to lowercase
    df['target_url'] = df['target_url'].str.lower()
    # remove duplicates
    df = df.drop_duplicates(subset='target_url')
    # set base domain
    df['base_domain_gov'] = df['target_url']
    # set source column
    df['source_list_federal_domains'] = 'TRUE'
    # strip out 'Federal - ' leading string from domain type column for .gov data
    df['branch'] = df['branch'].map(lambda x: x.lstrip('Federal - '))

    # add www. to .gov URLs
    www_gov_df = df.copy()
    www_gov_df['target_url'] = 'www.' + www_gov_df['target_url'].astype(str)
    df = pd.concat([df, www_gov_df])
    return df

def format_pulse_df(df):
    # drop unnecessary columns
    df = df.drop(columns=['URL', 'Agency', 'Sources', 'Compliant with M-15-13 and BOD 18-01', 'Enforces HTTPS',
        'Strict Transport Security (HSTS)', 'Free of RC4/3DES and SSLv2/SSLv3', '3DES', 'RC4', 'SSLv2', 'SSLv3',
        'Preloaded'])
    # rename columns
    df = df.rename(columns={'Domain': 'target_url', 'Base Domain': 'base_domain_pulse'})
    # get subset
    df = df[['target_url', 'base_domain_pulse']]
    # convert to lowercase
    df['target_url'] = df['target_url'].str.lower()
    # remove duplicates
    df = df.drop_duplicates(subset='target_url')
    # set source column
    df['source_list_pulse'] = 'TRUE'
    return df

def format_dap_df(df):
    df = df.drop(columns=['visits'])
    df = df.rename(columns={'domain': 'target_url'})
    df['target_url'] = df['target_url'].str.lower()
    df = df.drop_duplicates(subset='target_url')
    df['source_list_dap'] = 'TRUE'
    return df

def format_omb_idea_df(df):
    df = df.rename(columns={'Website': 'target_url', 'Public-Facing': 'omb_idea_public'})
    df['target_url'] = df['target_url'].str.lower()
    df = df.drop_duplicates(subset='target_url')
    df['source_list_omb_idea'] = 'TRUE'
    df['omb_idea_public'] = df['omb_idea_public'].map({'Yes': 'TRUE', 'No': 'FALSE'})
    df = df.drop_duplicates()
    return df

def format_eotw_df(df):
    df = df.rename(columns={'URL': 'target_url'})
    df['target_url'] = df['target_url'].str.lower()
    df = df.drop_duplicates(subset='target_url')
    df['source_list_eotw'] = 'TRUE'
    return df

def format_usagov_df(df):
    df = df.rename(columns={0: 'target_url'})
    df['target_url'] = df['target_url'].str.lower()
    df = df.drop_duplicates(subset='target_url')
    df['source_list_usagov'] = 'TRUE'
    return df

def format_gov_man_df(df):
    df = df.rename(columns={0: 'target_url'})
    df['target_url'] = df['target_url'].str.lower()
    df = df.drop_duplicates(subset='target_url')
    df['source_list_gov_man'] = 'TRUE'
    return df

def format_uscourts_df(df):
    df = df.rename(columns={0: 'target_url'})
    df['target_url'] = df['target_url'].str.lower()
    df = df.drop_duplicates(subset='target_url')
    df['source_list_uscourts'] = 'TRUE'
    return df

def format_oira_df(df):
    df = df.rename(columns={'URL': 'target_url'})
    df['target_url'] = df['target_url'].str.lower()
    df = df.drop_duplicates(subset='target_url')
    df['source_list_oira'] = 'TRUE'
    return df

def format_other_df(df):
    df['source_list_other'] = 'TRUE'
    return df

def format_first_mil_df(df):
    df = df.rename(columns={'Website': 'target_url'})
    df = df.apply(lambda col: col.map(lambda x: x.lower() if isinstance(x, str) else x))
    df = df.drop_duplicates(subset='target_url')
    df['source_list_mil_1'] = 'TRUE'
    return df

def format_second_mil_df(df):
    df = df.rename(columns={0: 'target_url'})
    df = df.apply(lambda col: col.map(lambda x: x.lower() if isinstance(x, str) else x))
    df = df.drop_duplicates(subset='target_url')
    df['source_list_mil_2'] = 'TRUE'
    return df

def merge_agencies(df, agency_df):
    df = df.merge(agency_df, on='base_domain', how='left')
    df = df.fillna('')
    df['agency'] = ''

    for idx, row in df.iterrows():
        if row['agency'] == '':
            if row['agency_x'] != '':
                df.at[idx, 'agency'] = row['agency_x']
            else:
                df.at[idx, 'agency'] = row['agency_y']

    # drop temp agency columns
    df = df.drop(columns=['agency_x', 'agency_y'])
    return df

def merge_bureaus(df, bureau_df):
    df = df.merge(bureau_df, on='base_domain', how='left')
    df = df.fillna('')
    df['bureau'] = ''

    for idx, row in df.iterrows():
        if row['bureau'] == '':
            if row['bureau_x'] != '':
                df.at[idx, 'bureau'] = row['bureau_x']
            else:
                df.at[idx, 'bureau'] = row['bureau_y']

    # drop temp bureau columns
    df = df.drop(columns=['bureau_x', 'bureau_y'])
    return df

def main():
    # initialize analysis dict
    analysis = {}

    # import data
    gov_df_raw, pulse_df_raw, dap_df_raw, omb_idea_df_raw, eotw_df_raw, usagov_df_raw, gov_man_df_raw, \
        uscourts_df_raw, oira_df_raw, other_df_raw, first_mil_df_raw, second_mil_df_raw, analysis = fetch_data(analysis)

    # format and clean data
    gov_df = format_gov_df(gov_df_raw)
    pulse_df = format_pulse_df(pulse_df_raw)
    dap_df = format_dap_df(dap_df_raw)
    other_df = format_other_df(other_df_raw)
    omb_idea_df = format_omb_idea_df(omb_idea_df_raw)
    eotw_df = format_eotw_df(eotw_df_raw)
    usagov_df = format_usagov_df(usagov_df_raw)
    gov_man_df = format_gov_man_df(gov_man_df_raw)
    uscourts_df = format_uscourts_df(uscourts_df_raw)
    oira_df = format_oira_df(oira_df_raw)
    first_mil_df = format_first_mil_df(first_mil_df_raw)
    second_mil_df = format_second_mil_df(second_mil_df_raw)

    # combine all URLs into one column
    print("Combining all URLs into one column")
    url_series = pd.concat([gov_df['target_url'], pulse_df['target_url'],
                            dap_df['target_url'], other_df['target_url'],
                            omb_idea_df['target_url'], eotw_df['target_url'],
                            usagov_df['target_url'], gov_man_df['target_url'],
                            uscourts_df['target_url'], oira_df['target_url'],
                            first_mil_df['target_url'], second_mil_df['target_url']])
    url_df = pd.DataFrame(url_series)
    analysis['combined url list length'] = len(url_df.index)
    url_df.to_csv(COMBINED_SNAPSHOT_PATH, index=False)

    # remove duplicates
    url_series = url_df['target_url']
    duplicated_df = url_df[url_series.isin(url_series[url_series.duplicated()])].sort_values("target_url")
    duplicated_df = duplicated_df.drop_duplicates()
    duplicated_df.to_csv(DEDUP_REMOVED_SNAPSHOT_PATH, index=False)
    url_df = url_df.drop_duplicates('target_url')
    url_df = url_df.dropna()
    analysis['deduped url list length'] = len(url_df.index)
    url_df.to_csv(DEDUPED_SNAPSHOT_PATH, index=False)

    # remove URLs with ignore-listed strings at the beginning of urls
    ignore_df = pd.read_csv(INGORE_LIST_BEGINS_PATH)
    ignore_series = ignore_df['URL begins with:']
    ignored_df = url_df[url_df['target_url'].str.startswith(tuple(ignore_series))]
    ignored_df.to_csv(INGORED_REMOVED_BEGINS_PATH, index=False)
    url_df = url_df[~url_df['target_url'].str.startswith(tuple(ignore_series))]
    analysis['url list length after ignore list checking beginnning of urls processed'] = len(url_df.index)
    url_df.to_csv(REMOVE_IGNORE_BEGINS_PATH, index=False)

    # remove URLs with ignore-listed strings contained anywhere in urls
    ignore_df = pd.read_csv(IGNORE_LIST_CONTAINS_PATH)
    ignore_series = ignore_df['URL contains between non-word characters:']
    pattern = r'[^a-zA-Z0-9](?:{})[^a-zA-Z0-9]'.format('|'.join(ignore_series.array))
    ignored_df = url_df[url_df['target_url'].str.contains(pattern)]
    ignored_df.to_csv(IGNORED_REMOVED_CONTAINS_PATH, index=False)
    url_df = url_df[~url_df['target_url'].str.contains(pattern)]
    analysis['url list length after ignore list checking entire url'] = len(url_df.index)
    url_df.to_csv(REMOVE_IGNORE_CONTAINS_PATH, index=False)
    # ...and then reinstate URLs that we should not ignore
    ignore_except_df = pd.read_csv(IGNORE_LIST_EXCEPT_PATH)
    ignore_except_df = ignore_except_df.rename(columns={'URL': 'target_url'})
    url_df = pd.concat([url_df, ignore_except_df])

    # merge data back in
    url_df = url_df.merge(gov_df, on='target_url', how='left')
    url_df = url_df.merge(pulse_df, on='target_url', how='left')
    url_df = url_df.merge(dap_df, on='target_url', how='left')
    url_df = url_df.merge(omb_idea_df, on='target_url', how='left')
    url_df = url_df.merge(eotw_df, on='target_url', how='left',)
    url_df = url_df.merge(usagov_df, on='target_url', how='left')
    url_df = url_df.merge(gov_man_df, on='target_url', how='left')
    url_df = url_df.merge(uscourts_df, on='target_url', how='left')
    url_df = url_df.merge(oira_df, on='target_url', how='left')
    url_df = url_df.merge(other_df, on='target_url', how='left')
    url_df = url_df.merge(first_mil_df, on='target_url', how='left')
    url_df = url_df.merge(second_mil_df, on='target_url', how='left')
    url_df = url_df.fillna('')
    url_df.to_csv(URL_DF_PRE_BASE_DOMAINS_MERGED, index=False)

    # populate base domain column
    url_df['base_domain'] = ''
    for idx, row in url_df.iterrows():
        if row['base_domain_gov'] != '':
            url_df.at[idx, 'base_domain'] = row['base_domain_gov']
        elif row['base_domain_pulse'] != '':
            url_df.at[idx, 'base_domain'] = row['base_domain_pulse']
        else:
            url_df.at[idx, 'base_domain'] = '.'.join(row['target_url'].split('.')[-2:])
    url_df.to_csv(URL_DF_POST_BASE_DOMAINS_MERGED, index=False)

    # get relevant subset
    url_df = url_df[['target_url', 'base_domain', 'branch', 'agency', 'bureau',
                     'source_list_federal_domains', 'source_list_pulse',
                     'source_list_dap', 'source_list_omb_idea', 'source_list_eotw',
                     'source_list_usagov', 'source_list_gov_man', 'source_list_uscourts',
                     'source_list_oira','source_list_other', 'source_list_mil_1',
                     'source_list_mil_2', 'omb_idea_public']]

    # format source columns
    url_df['source_list_federal_domains'] = url_df['source_list_federal_domains'].map(lambda x: 'FALSE' if x == '' else x)
    url_df['source_list_pulse'] = url_df['source_list_pulse'].map(lambda x: 'FALSE' if x == '' else x)
    url_df['source_list_dap'] = url_df['source_list_dap'].map(lambda x: 'FALSE' if x == '' else x)
    url_df['source_list_omb_idea'] = url_df['source_list_omb_idea'].map(lambda x: 'FALSE' if x == '' else x)
    url_df['source_list_eotw'] = url_df['source_list_eotw'].map(lambda x: 'FALSE' if x == '' else x)
    url_df['source_list_usagov'] = url_df['source_list_usagov'].map(lambda x: 'FALSE' if x == '' else x)
    url_df['source_list_gov_man'] = url_df['source_list_gov_man'].map(lambda x: 'FALSE' if x == '' else x)
    url_df['source_list_uscourts'] = url_df['source_list_uscourts'].map(lambda x: 'FALSE' if x == '' else x)
    url_df['source_list_oira'] = url_df['source_list_oira'].map(lambda x: 'FALSE' if x == '' else x)
    url_df['source_list_other'] = url_df['source_list_other'].map(lambda x: 'FALSE' if x == '' else x)
    url_df['source_list_mil_1'] = url_df['source_list_mil_1'].map(lambda x: 'FALSE' if x == '' else x)
    url_df['source_list_mil_2'] = url_df['source_list_mil_2'].map(lambda x: 'FALSE' if x == '' else x)

    # populate branch field
    branch_df = csv_to_df(BRANCH_SOURCE_LIST_URL)
    merged_df = pd.merge(url_df, branch_df, left_on='base_domain', right_on='Domain name', how='left')
    url_df['branch'] = url_df['branch'].combine_first(merged_df['Domain type'])
    url_df.loc[url_df['branch'] == '', 'branch'] = merged_df['Domain type']
    url_df['branch'] = url_df['branch'].str.replace('^Federal - ', '', regex=True)

    # get lookup table of agencies mapped to base domain for .gov urls
    agency_df = gov_df[['base_domain_gov', 'agency']]
    agency_df = agency_df.rename(columns={'base_domain_gov': 'base_domain'})
    agency_df = agency_df.drop_duplicates()

    # get lookup table of bureaus mapped to base domain for .gov urls
    bureau_df = gov_df[['base_domain_gov', 'bureau']]
    bureau_df = bureau_df.rename(columns={'base_domain_gov': 'base_domain'})
    bureau_df = bureau_df.drop_duplicates()

    # merge in agencies for .gov urls
    url_df = merge_agencies(url_df, agency_df)

    # merge in bureaus for .gov urls
    url_df = merge_bureaus(url_df, bureau_df)

    # populate agencies and bureaus for .mil
    mil_domains_df = csv_to_df(MIL_DOMAINS_URL)
    mil_domains_df = mil_domains_df.rename(columns={'Domain name': 'base_domain',  'Agency': 'agency', 'Organization name': 'bureau', 'Domain type': 'branch'})
    mil_domains_df['branch'] = mil_domains_df['branch'].map(lambda x: x.lstrip('Federal - '))

    url_df = url_df.merge(mil_domains_df, on='base_domain', how='left')

    # merge in agencies for .mil urls
    url_df = merge_agencies(url_df, agency_df)

    # merge in bureaus for .mil urls
    url_df = merge_bureaus(url_df, bureau_df)

    # merge branch column
    url_df['branch'] = ''
    for idx, row in url_df.iterrows():
        if row['branch_x'] != '':
            url_df.at[idx, 'branch'] = row['branch_x']
        elif row['branch_y'] != '':
            url_df.at[idx, 'branch'] = row['branch_y']
    url_df = url_df.drop(columns=['branch_x'])
    url_df = url_df.drop(columns=['branch_y'])

    # load agency and bureau code reference data
    omb_df = csv_to_df(OMB_SOURCE_URL)
    agency_codes = omb_df[['Agency Name', 'Agency Code']]
    agency_codes = agency_codes.rename(columns={'Agency Name': 'agency', 'Agency Code': 'agency_code'}).drop_duplicates()
    bureau_codes = omb_df[['Bureau Name', 'Bureau Code']]
    bureau_codes = bureau_codes.rename(columns={'Bureau Name': 'bureau', 'Bureau Code': 'bureau_code'}).drop_duplicates()

    # add agency and bureau codes
    url_df = url_df.merge(agency_codes, on='agency', how='left')
    url_df = url_df.merge(bureau_codes, on='bureau', how='left')
    url_df = url_df.drop_duplicates()
    url_df = url_df.fillna('')

    # format agency and bureau codes
    url_df['agency_code'] = url_df['agency_code'].map(lambda x: round_float(x))
    url_df['bureau_code'] = url_df['bureau_code'].map(lambda x: round_float(x))

    # reorder columns, sort
    url_df = url_df[['target_url', 'base_domain', 'branch', 'agency', 'agency_code',
                     'bureau', 'bureau_code', 'source_list_federal_domains',
                     'source_list_dap', 'source_list_pulse', 'source_list_omb_idea',
                     'source_list_eotw', 'source_list_usagov', 'source_list_gov_man',
                     'source_list_uscourts', 'source_list_oira', 'source_list_other',
                     'source_list_mil_1', 'source_list_mil_2', 'omb_idea_public']]
    url_df = url_df.sort_values(by=['base_domain', 'target_url'])

    # remove all non-.gov and non-.mil urls
    gov_base_domains = set(gov_df.base_domain_gov)
    analysis['number of .gov base domains'] = len(gov_base_domains)
    mil_domains_df = csv_to_df(MIL_DOMAINS_URL)
    mil_domains_set = set(mil_domains_df['Domain name'])
    analysis['number of .mil base domains'] = len(mil_domains_set)

    url_df['is_gov'] = url_df['base_domain'].apply(lambda x: x in gov_base_domains)
    url_df['is_mil'] = url_df['base_domain'].apply(lambda x: x in mil_domains_set)

    # populate top_level_domain column
    url_df['top_level_domain'] = url_df.apply(lambda row: '.gov' if row['is_gov'] else ('.mil' if row['is_mil'] else None), axis=1)

    non_gov_df = url_df[(url_df['is_gov'] == False) & (url_df['is_mil'] == False)]
    non_gov_df = non_gov_df.drop(columns=['is_gov'])
    non_gov_df = non_gov_df.drop(columns=['is_mil'])
    non_gov_df.to_csv(NONFEDERAL_REMOVED_PATH, index=False)
    analysis['number of urls with non-.gov or non-.mil base domains removed'] = len(non_gov_df.index)

    url_df = url_df[(url_df['is_gov'] == True) | (url_df['is_mil'] == True)]
    url_df = url_df.drop(columns=['is_gov'])
    url_df = url_df.drop(columns=['is_mil'])
    analysis['url list length after non-federal urls removed'] = len(url_df.index)

    # reorder columns
    final_df = url_df[['target_url', 'base_domain', 'top_level_domain', 'branch', 'agency', 'agency_code',
                    'bureau', 'bureau_code', 'source_list_federal_domains',
                    'source_list_dap', 'source_list_pulse', 'source_list_omb_idea',
                    'source_list_eotw', 'source_list_usagov', 'source_list_gov_man',
                    'source_list_uscourts', 'source_list_oira', 'source_list_other',
                    'source_list_mil_1', 'source_list_mil_2', 'omb_idea_public']]

    # write list to csv
    final_df.to_csv(TARGET_URL_LIST_PATH, index=False)

    # write analysis tocsv
    dict_to_csv(ANALYSIS_CSV_PATH, analysis)

if __name__ == '__main__':
    main()
