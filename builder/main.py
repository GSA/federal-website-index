from config import config
from helpers import csv_to_df, round_float, dict_to_csv
import pandas as pd


def fetch_data(analysis):
    # import data
    gov_df = csv_to_df(config['gov_source_url'])
    pulse_df = csv_to_df(config['pulse_source_url'])
    dap_df = csv_to_df(config['dap_source_url'])
    other_df = pd.read_csv(config['other_websites_path'])
    other_df['source_list_other'] = 'TRUE'

    # track length of source datasets
    analysis['gov url list length'] = len(gov_df.index)
    analysis['pulse url list length'] = len(pulse_df.index)
    analysis['dap url list length'] = len(dap_df.index)
    analysis['other website url list length'] = len(other_df.index)

    # create new snapshots of source files
    gov_df.to_csv(config['gov_snapshot_path'], index=False)
    pulse_df.to_csv(config['pulse_snapshot_path'], index=False)
    dap_df.to_csv(config['dap_snapshot_path'], index=False)
    other_df.to_csv(config['other_snapshot_path'], index=False)
    return gov_df, pulse_df, dap_df, other_df, analysis

def format_gov_df(df):
    # drop unnecessary columns
    df = df.drop(columns=['City', 'State', 'Security Contact Email'])
    # rename columns
    df = df.rename(columns={'Domain Name': 'target_url', 'Domain Type': 'branch', 'Agency': 'agency', 'Organization': 'bureau'})
    # convert to lowercase
    df['target_url'] = df['target_url'].str.lower()
    df['base_domain'] = df['target_url']
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
    df = df.rename(columns={'Domain': 'target_url', 'Base Domain': 'base_domain'})
    df = df[['target_url', 'base_domain']]
    df['source_list_pulse'] = 'TRUE'
    return df

def format_dap_df(df):
    df = df.rename(columns={'domain': 'target_url'})
    df['base_domain'] = df['target_url'].map(lambda x: '.'.join(x.split('.')[-2:]))
    df['source_list_dap'] = 'TRUE'
    return df

def format_other_df(df):
    df['base_domain_other'] = df['target_url'].map(lambda x: '.'.join(x.split('.')[-2:]))
    df['source_list_other'] = 'TRUE'
    return df

def format_source_columns(df):
    df['source_list_federal_domains'] = df['source_list_federal_domains'].map(lambda x: 'FALSE' if x == '' else x)
    df['source_list_pulse'] = df['source_list_pulse'].map(lambda x: 'FALSE' if x == '' else x)
    df['source_list_dap'] = df['source_list_dap'].map(lambda x: 'FALSE' if x == '' else x)
    df['source_list_other'] = df['source_list_other'].map(lambda x: 'FALSE' if x == '' else x)
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

def format_agency_and_bureau_codes(df):
    df['agency_code'] = df['agency_code'].map(lambda x: round_float(x))
    df['bureau_code'] = df['bureau_code'].map(lambda x: round_float(x))
    return df

if __name__ == "__main__":
    # initialize analysis dict
    analysis = {}

    # import data
    gov_df_raw, pulse_df_raw, dap_df_raw, other_df_raw, analysis = fetch_data(analysis)

    gov_df = format_gov_df(gov_df_raw)
    pulse_df = format_pulse_df(pulse_df_raw)
    dap_df = format_dap_df(dap_df_raw)
    other_df = format_other_df(other_df_raw)

    # combine all URLs into one column
    url_series = pd.concat([gov_df['target_url'], pulse_df['target_url'], dap_df['target_url'], other_df['target_url']])
    url_df = pd.DataFrame(url_series)
    analysis['combined url list length'] = len(url_df.index)
    url_df.to_csv(config['combined_snapshot_path'], index=False)

    # remove duplicates
    url_series = url_df['target_url']
    duplicated_df = url_df[url_series.isin(url_series[url_series.duplicated()])].sort_values("target_url")
    duplicated_df = duplicated_df.drop_duplicates()
    duplicated_df.to_csv(config['dedup_removed'], index=False)
    url_df = url_df.drop_duplicates('target_url')
    analysis['deduped url list length'] = len(url_df.index)
    url_df.to_csv(config['deduped_snapshot_path'], index=False)

    # remove URLs with ignore-listed strings and the beginning of urls
    ignore_df = pd.read_csv(config['ignore_list_begins_path'])
    ignore_series = ignore_df['URL begins with:']
    ignored_df = url_df[url_df['target_url'].str.startswith(tuple(ignore_series))]
    ignored_df.to_csv(config['ignored_removed_begins'], index=False)
    url_df = url_df[~url_df['target_url'].str.startswith(tuple(ignore_series))]
    analysis['url list length after ignore list checking beginnning of urls processed'] = len(url_df.index)
    url_df.to_csv(config['remove_ignore_begins_path'], index=False)

    # remove URLs with ignore-listed strings contained anywhere in urls
    ignore_df = pd.read_csv(config['ignore_list_contains_path'])
    ignore_series = ignore_df['URL contains between non-word characters:']
    pattern = r'[^a-zA-Z0-9](?:{})[^a-zA-Z0-9]'.format('|'.join(ignore_series.array))
    ignored_df = url_df[url_df['target_url'].str.contains(pattern)]
    ignored_df.to_csv(config['ignored_removed_contains'], index=False)
    url_df = url_df[~url_df['target_url'].str.contains(pattern)]
    analysis['url list length after ignore list checking entire url'] = len(url_df.index)
    url_df.to_csv(config['remove_ignore_contains_path'], index=False)

    # merge data back in
    url_df = url_df.merge(gov_df, on='target_url', how='left')
    url_df = url_df.merge(pulse_df, on='target_url', how='left')
    url_df = url_df.merge(dap_df, on='target_url', how='left')
    url_df = url_df.merge(other_df, on='target_url', how='left')
    url_df = url_df.fillna('')
    url_df.to_csv(config['url_df_pre_base_domains_merged'], index=False)

    # populate base domain column
    for idx, row in url_df.iterrows():
        if row['base_domain'] == '':
            if row['base_domain_x'] != '':
                url_df.at[idx, 'base_domain'] = row['base_domain_x']
            else:
                url_df.at[idx, 'base_domain'] = row['base_domain_y']

    url_df.to_csv(config['url_df_post_base_domains_merged'], index=False)

    # get relevant subset
    url_df = url_df[['target_url', 'base_domain', 'branch', 'agency', 'bureau', 'source_list_federal_domains', 'source_list_pulse', 'source_list_dap', 'source_list_other']]

    # format source columns
    url_df = format_source_columns(url_df)

    # set branch column's value to 'Executive' if empty
    url_df[['branch']] = url_df[['branch']].replace('', 'Executive')

    # get lookup table of agencies mapped to base domain
    agency_df = gov_df[['base_domain', 'agency']]
    agency_df = agency_df.drop_duplicates()

    # merge in agencies
    url_df = merge_agencies(url_df, agency_df)

    # get lookup table of bureaus mapped to base domain
    bureau_df = gov_df[['base_domain', 'bureau']]
    bureau_df = bureau_df.drop_duplicates()

    # merge in bureaus
    url_df = merge_bureaus(url_df, bureau_df)

    # load agency and bureau reference data
    omb_df = csv_to_df(config['omb_source_url'])
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
    url_df = format_agency_and_bureau_codes(url_df)

    # reorder columns, sort, remove duplicates
    url_df = url_df[['target_url', 'base_domain', 'branch', 'agency', 'agency_code', 'bureau', 'bureau_code', 'source_list_federal_domains', 'source_list_dap', 'source_list_pulse', 'source_list_other']]
    url_df = url_df.sort_values(by=['base_domain', 'target_url'])
    url_df = url_df.drop_duplicates('target_url')

    # remove all non-.gov urls
    gov_base_domains = set(gov_df.base_domain)
    analysis['number of .gov base domains'] = len(gov_base_domains)
    url_df['is_gov'] = url_df['base_domain'].apply(lambda x: x in gov_base_domains)
    non_gov_df = url_df[url_df['is_gov'] == False]
    non_gov_df = non_gov_df.drop(columns=['is_gov'])
    non_gov_df.to_csv(config['nonfederal_removed'], index=False)
    analysis['number of urls with non-.gov base domains removed'] = len(non_gov_df.index)

    url_df = url_df[url_df['is_gov'] == True]
    url_df = url_df.drop(columns=['is_gov'])
    analysis['url list length after non-federal urls removed'] = len(url_df.index)

    # write list to csv
    url_df.to_csv(config['target_url_list_path'], index=False)

    # write analysis tocsv
    dict_to_csv(config['analysis_csv_path'], analysis)
