## Digital Analytics Program - Top Hostnames

The Digital Analytics Program (DAP) is a website analytics shared service that is available to all federal agencies. A daily export of the hostnames that have implemented DAP on at least one page is generated and hosted on analytics.usa.gov.  

[The file is located here](https://analytics.usa.gov/data/live/top-100000-domains-30-days.csv).   

It contains roughly 50-60k URLs, however, only domains with 100+ pageviews (over the past 30 days) are used, which limits the number to roughly 10-15k.  The reason for this is made clear when looking at the full dataset - the long tail of hostnames reporting a visit to DAP is very, very noisy and offers little value when trying to identify public websites.  

One note is that the index is assembled using this data [directly from the source](https://analytics.usa.gov/data/live/top-100000-domains-30-days.csv), but a later distinct process pulls in pageview and visit data by instead querying a [copy of the file](https://raw.githubusercontent.com/GSA/federal-website-index/refs/heads/main/data/source-lists/dap_top_100000_domains_30_days.csv).  This is simply for the convenience of the GitHub actions that together generate the website index.  
