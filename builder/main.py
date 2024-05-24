from config import config
from helpers import csv_to_df, round_float, dict_to_csv
import pandas as pd


def fetch_data(analysis):
    # import data
    gov_df = csv_to_df(config['gov_source_url'])
    pulse_df = csv_to_df(config['pulse_source_url'])
    dap_df = csv_to_df(config['dap_source_url'])
    # datasets added in February, 2024
    omb_idea_df = csv_to_df(config['omb_idea_source_url'])
    eotw_df = csv_to_df(config['2020_eotw_source_url'])
    usagov_df = csv_to_df(config['usagov_directory_source_url'], has_headers=False)
    gov_man_df = csv_to_df(config['gov_man_22_source_url'], has_headers=False)
    uscourts_df = csv_to_df(config['uscourts_source_url'], has_headers=False)
    oira_df = csv_to_df(config['oira_source_url'])

    other_df = pd.read_csv(config['other_websites_path'])
    other_df['source_list_other'] = 'TRUE'

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
    analysis['other website url list length'] = len(other_df.index)

    # create new snapshots of source files
    gov_df.to_csv(config['gov_snapshot_path'], index=False)
    pulse_df.to_csv(config['pulse_snapshot_path'], index=False)
    dap_df.to_csv(config['dap_snapshot_path'], index=False)
    omb_idea_df.to_csv(config['omb_idea_snapshot_path'], index=False)
    eotw_df.to_csv(config['2020_eotw_snapshot_path'], index=False)
    usagov_df.to_csv(config['usagov_directory_snapshot_path'], index=False)
    gov_man_df.to_csv(config['gov_man_22_snapshot_path'], index=False)
    uscourts_df.to_csv(config['uscourts_snapshot_path'], index=False)
    oira_df.to_csv(config['oira_snapshot_path'], index=False)
    other_df.to_csv(config['other_snapshot_path'], index=False)
    return gov_df, pulse_df, dap_df, omb_idea_df, eotw_df, usagov_df, gov_man_df, \
        uscourts_df, oira_df, other_df, analysis

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

def format_source_columns(df):
    df['source_list_federal_domains'] = df['source_list_federal_domains'].map(lambda x: 'FALSE' if x == '' else x)
    df['source_list_pulse'] = df['source_list_pulse'].map(lambda x: 'FALSE' if x == '' else x)
    df['source_list_dap'] = df['source_list_dap'].map(lambda x: 'FALSE' if x == '' else x)
    df['source_list_omb_idea'] = df['source_list_omb_idea'].map(lambda x: 'FALSE' if x == '' else x)
    df['source_list_eotw'] = df['source_list_eotw'].map(lambda x: 'FALSE' if x == '' else x)
    df['source_list_usagov'] = df['source_list_usagov'].map(lambda x: 'FALSE' if x == '' else x)
    df['source_list_gov_man'] = df['source_list_gov_man'].map(lambda x: 'FALSE' if x == '' else x)
    df['source_list_uscourts'] = df['source_list_uscourts'].map(lambda x: 'FALSE' if x == '' else x)
    df['source_list_oira'] = df['source_list_oira'].map(lambda x: 'FALSE' if x == '' else x)
    df['source_list_other'] = df['source_list_other'].map(lambda x: 'FALSE' if x == '' else x)
    return df

def populate_branch_field(df):
    branch_df = csv_to_df(config['branch_source_list_url'])
    merged_df = pd.merge(df, branch_df, left_on='base_domain', right_on='Domain name', how='left')

    df['branch'] = df['branch'].combine_first(merged_df['Domain type'])
    df.loc[df['branch'] == '', 'branch'] = merged_df['Domain type']
    df['branch'] = df['branch'].str.replace('^Federal - ', '', regex=True)

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

def get_mil_subset():
    # import first dotmil dataset
    first_mil_df = csv_to_df(config['mil_source_url'])
    # make all strings lowercase
    first_mil_df = first_mil_df.apply(lambda col: col.map(lambda x: x.lower() if isinstance(x, str) else x))
    # set source column
    first_mil_df['source_list_mil_1'] = 'TRUE'

    # import second dotmil dataset
    second_mil_df = csv_to_df(config['mil_source_url_2'], has_headers=False)
    # make all strings lowercase
    second_mil_df = second_mil_df.apply(lambda col: col.map(lambda x: x.lower() if isinstance(x, str) else x))
    # rename column with URLs to match the first dataset
    second_mil_df = second_mil_df.rename(columns={0: 'Website'})
    # set source column
    second_mil_df['source_list_mil_2'] = 'TRUE'

    # combine both dotmil datasets
    df = pd.concat([first_mil_df, second_mil_df], ignore_index=True)

    # remove duplicates
    df = df.drop_duplicates(subset='Website')

    # rename columns
    df = df.rename(columns={'Website': 'target_url', 'Agency': 'agency', 'Bureau': 'bureau', 'Branch': 'branch'})
    # set other fields
    df['branch'] = 'Executive'
    df['agency_code'] = 0
    df['bureau_code'] = 0
    df['source_list_federal_domains'] = 'FALSE'
    df['source_list_dap'] = 'FALSE'
    df['source_list_pulse'] = 'FALSE'
    df['source_list_omb_idea'] = 'FALSE'
    df['source_list_eotw'] = 'FALSE'
    df['source_list_usagov'] = 'FALSE'
    df['source_list_gov_man'] = 'FALSE'
    df['source_list_uscourts'] = 'FALSE'
    df['source_list_oira'] = 'FALSE'
    df['source_list_other'] = 'FALSE'
    df['omb_idea_public'] = 'FALSE'
    df['base_domain'] = df['target_url'].map(lambda x: '.'.join(x.split('.')[-2:]))

    # only include URLs with a domain listed in the 'mil_domains_url' CSV file
    mil_domains_df = csv_to_df(config['mil_domains_url'])
    mil_domains_set = set(mil_domains_df['Domain name'])
    df['is_mil'] = df['base_domain'].apply(lambda x: x in mil_domains_set)
    df = df[df['is_mil'] == True]
    df = df.drop(columns=['is_mil'])
    df['top_level_domain'] = 'mil'

    # populate agency and bureau columns
    mil_domains_df = mil_domains_df.rename(columns={'Domain name': 'base_domain',  'Agency': 'agency', 'Organization name': 'bureau'})

    df = df.merge(mil_domains_df, on='base_domain', how='left')
    df = df.fillna('')
    df['agency'] = ''
    df['bureau'] = ''

    for idx, row in df.iterrows():
        if row['agency_x'] != '':
            df.at[idx, 'agency'] = row['agency_x']
        else:
            df.at[idx, 'agency'] = row['agency_y']

        if row['bureau_x'] != '':
            df.at[idx, 'bureau'] = row['bureau_x']
        else:
            df.at[idx, 'bureau'] = row['bureau_y']

    # drop temp bureau columns
    df = df.drop(columns=['agency_x', 'agency_y', 'bureau_x', 'bureau_y'])

    # reorder columns
    df = df[['target_url', 'base_domain', 'top_level_domain', 'branch', 'agency', 'agency_code',
             'bureau', 'bureau_code', 'source_list_federal_domains', 'source_list_dap',
             'source_list_pulse', 'source_list_omb_idea', 'source_list_eotw',
             'source_list_usagov', 'source_list_gov_man', 'source_list_uscourts',
             'source_list_oira', 'source_list_other', 'source_list_mil_1', 'source_list_mil_2', 'omb_idea_public']]

    return df

if __name__ == "__main__":
    # initialize analysis dict
    analysis = {}

    # import data
    gov_df_raw, pulse_df_raw, dap_df_raw, omb_idea_df_raw, eotw_df_raw, usagov_df_raw, gov_man_df_raw, \
        uscourts_df_raw, oira_df_raw, other_df_raw, analysis = fetch_data(analysis)

    gov_df = format_gov_df(gov_df_raw)
    pulse_df = format_pulse_df(pulse_df_raw)
    dap_df = format_dap_df(dap_df_raw)
    other_df = format_other_df(other_df_raw)

    # Febraury 2024 datasets
    omb_idea_df = format_omb_idea_df(omb_idea_df_raw)
    eotw_df = format_eotw_df(eotw_df_raw)
    usagov_df = format_usagov_df(usagov_df_raw)
    gov_man_df = format_gov_man_df(gov_man_df_raw)
    uscourts_df = format_uscourts_df(uscourts_df_raw)
    oira_df = format_oira_df(oira_df_raw)

    # combine all URLs into one column
    print("Combining all URLs into one column")
    url_series = pd.concat([gov_df['target_url'], pulse_df['target_url'],
                            dap_df['target_url'], other_df['target_url'],
                            omb_idea_df['target_url'], eotw_df['target_url'],
                            usagov_df['target_url'], gov_man_df['target_url'],
                            uscourts_df['target_url'], oira_df['target_url']])

    url_df = pd.DataFrame(url_series)
    analysis['combined url list length'] = len(url_df.index)
    url_df.to_csv(config['combined_snapshot_path'], index=False)

    # remove duplicates
    url_series = url_df['target_url']
    duplicated_df = url_df[url_series.isin(url_series[url_series.duplicated()])].sort_values("target_url")
    duplicated_df = duplicated_df.drop_duplicates()
    duplicated_df.to_csv(config['dedup_removed'], index=False)
    url_df = url_df.drop_duplicates('target_url')
    url_df = url_df.dropna()
    analysis['deduped url list length'] = len(url_df.index)
    url_df.to_csv(config['deduped_snapshot_path'], index=False)

    # remove URLs with ignore-listed strings at the beginning of urls
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
    # ...and then reinstate URLs that we should not ignore
    ignore_except_df = pd.read_csv(config['ignore_except_path'])
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
    url_df = url_df.fillna('')

    url_df.to_csv(config['url_df_pre_base_domains_merged'], index=False)

    # populate base domain column
    url_df['base_domain'] = ''
    for idx, row in url_df.iterrows():
        if row['base_domain_gov'] != '':
            url_df.at[idx, 'base_domain'] = row['base_domain_gov']
        elif row['base_domain_pulse'] != '':
            url_df.at[idx, 'base_domain'] = row['base_domain_pulse']
        else:
            url_df.at[idx, 'base_domain'] = '.'.join(row['target_url'].split('.')[-2:])

    url_df.to_csv(config['url_df_post_base_domains_merged'], index=False)

    # get relevant subset
    url_df = url_df[['target_url', 'base_domain', 'branch', 'agency', 'bureau',
                     'source_list_federal_domains', 'source_list_pulse',
                     'source_list_dap', 'source_list_omb_idea', 'source_list_eotw',
                     'source_list_usagov', 'source_list_gov_man', 'source_list_uscourts',
                     'source_list_oira','source_list_other', 'omb_idea_public']]

    # format source columns
    url_df = format_source_columns(url_df)

    # populate the branch field
    url_df = populate_branch_field(url_df)

    # get lookup table of agencies mapped to base domain
    agency_df = gov_df[['base_domain_gov', 'agency']]
    agency_df = agency_df.rename(columns={'base_domain_gov': 'base_domain'})
    agency_df = agency_df.drop_duplicates()

    # merge in agencies
    url_df = merge_agencies(url_df, agency_df)

    # get lookup table of bureaus mapped to base domain
    bureau_df = gov_df[['base_domain_gov', 'bureau']]
    bureau_df = bureau_df.rename(columns={'base_domain_gov': 'base_domain'})
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
    url_df = url_df[['target_url', 'base_domain', 'branch', 'agency', 'agency_code',
                     'bureau', 'bureau_code', 'source_list_federal_domains',
                     'source_list_dap', 'source_list_pulse', 'source_list_omb_idea',
                     'source_list_eotw', 'source_list_usagov', 'source_list_gov_man',
                     'source_list_uscourts', 'source_list_oira', 'source_list_other',
                      'omb_idea_public']]
    url_df = url_df.sort_values(by=['base_domain', 'target_url'])
    url_df = url_df.drop_duplicates('target_url')

    # remove all non-.gov urls
    gov_base_domains = set(gov_df.base_domain_gov)
    analysis['number of .gov base domains'] = len(gov_base_domains)
    url_df['is_gov'] = url_df['base_domain'].apply(lambda x: x in gov_base_domains)
    non_gov_df = url_df[url_df['is_gov'] == False]
    non_gov_df = non_gov_df.drop(columns=['is_gov'])
    non_gov_df.to_csv(config['nonfederal_removed'], index=False)
    analysis['number of urls with non-.gov base domains removed'] = len(non_gov_df.index)

    url_df = url_df[url_df['is_gov'] == True]
    url_df = url_df.drop(columns=['is_gov'])
    analysis['url list length after non-federal urls removed'] = len(url_df.index)

    # add tld for .gov urls
    loc = url_df.columns.get_loc('base_domain')
    url_df.insert(loc=loc+1, column='top_level_domain', value='gov')

    # get mil subset
    mil_df = get_mil_subset()
    # set source_list_mil_1 and source_list_mil_2 to False for all urls apart from the mil subset
    url_df['source_list_mil_1'] = 'FALSE'
    url_df['source_list_mil_2'] = 'FALSE'
    # append mil subset to the main list of urls
    final_df = pd.concat([url_df, mil_df], ignore_index=True)

    # write list to csv
    final_df.to_csv(config['target_url_list_path'], index=False)

    # write analysis tocsv
    dict_to_csv(config['analysis_csv_path'], analysis)
