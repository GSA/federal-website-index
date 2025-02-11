## List of Site Scanning Final URL websites

The Site Scanning program takes the Federal Website Index and uses it as its Target URL list against which it runs daily scans.  As part of that process, every Target URL is loaded in a browser and given a chance to resolve to a Final URL.  For every Final URL, a separate column of data is derived by stripping the protocol and path, which is the Final URL - Base Website (e.g. for the Final URL `http://x.y.gov/blog`, the Final URL - Base Website would be `x.y.gov`).  This sometimes reveals subdomains which were not in the original Index.  An daily recurring automation takes the `all` snapshot and pulls out the `domain` column to populate this dataset.  

[The file is located here](https://github.com/GSA/federal-website-index/blob/main/data/dataset/final_url_websites.csv) and can be [downloaded here](https://raw.githubusercontent.com/GSA/federal-website-index/refs/heads/main/data/dataset/final_url_websites.csv).  

This file contains roughtly 13,000 urls.  
