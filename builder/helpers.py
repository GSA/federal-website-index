import io
import math
import pandas as pd
import requests


def csv_to_df(url):
    bytes = requests.get(url).content
    df = pd.read_csv(io.StringIO(bytes.decode('utf8')))
    return df

def round_float(x):
    return math.floor(x) if type(x) == float else x
