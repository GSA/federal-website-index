import pandas as pd
import os

dirname = os.path.dirname(__file__)

TOP_DOMAIN_LIST_URL = 'https://analytics.usa.gov/data/live/top-100000-domains-30-days.csv'
DAP_TOP_DOMAIN_LIST_PATH = os.path.join(dirname, '../data/source-lists/dap_top_100000_domains_30_days.csv')

print('Downloading top 100000 domains from DAP')
df = pd.read_csv(TOP_DOMAIN_LIST_URL)
print('Total rows:', len(df))

print('Cleaning DAP top 100000 domains')
df['hostname'] = df['hostname'].apply(lambda x: x[4:] if x.startswith('www.') else x)

print('Grouping by hostname')
df_cleaned = df.groupby('hostname', as_index=False).agg({
    'pageviews': 'sum',
    'visits': 'sum'
})

print('Rows after grouping:', len(df_cleaned))

df_cleaned.to_csv(DAP_TOP_DOMAIN_LIST_PATH, index=False)