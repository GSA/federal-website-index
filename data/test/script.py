import pandas as pd
import requests
import io

def csv_to_df(url, has_headers=True):
    bytes = requests.get(url).content
    header_option = 'infer' if has_headers else None
    df = pd.read_csv(io.StringIO(bytes.decode('utf8')), header=header_option)
    return df


def main():
    df = pd.read_csv('./site-scanning-target-url-list-sans-www-not-dedupped-6-12-24.csv')
    df = df.drop(columns=['agency_code', 'bureau_code'])
    print('Length of list pre-dedup:', len(df.index))
    df = df.drop_duplicates()
    print('Length of list post-dedup:', len(df.index))
    df.to_csv('./site-scanning-target-url-list-sans-www-dedupped-6-12-24.csv', index=False)


if __name__ == '__main__':
    main()
