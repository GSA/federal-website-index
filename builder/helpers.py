import io
import csv
import math
import pandas as pd
import requests


def csv_to_df(url):
    bytes = requests.get(url).content
    df = pd.read_csv(io.StringIO(bytes.decode('utf8')))
    return df

def round_float(x):
    return math.floor(x) if type(x) == float else x

def dict_to_csv(path, dict):
    with open(path, 'w') as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=['question', 'answer'])
        writer.writeheader()
        for key, value in dict.items():
            writer.writerow({'question': key, 'answer': value})
