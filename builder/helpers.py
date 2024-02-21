import io
import csv
import math
import pandas as pd
import requests


def csv_to_df(url, has_headers=True):
    bytes = requests.get(url).content
    header_option = 'infer' if has_headers else None
    df = pd.read_csv(io.StringIO(bytes.decode('utf8')), header=header_option)
    return df

def round_float(x):
    return math.floor(x) if type(x) == float else x

def dict_to_csv(path, dict):
    with open(path, 'w') as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=['question', 'answer'])
        writer.writeheader()
        for key, value in dict.items():
            writer.writerow({'question': key, 'answer': value})
