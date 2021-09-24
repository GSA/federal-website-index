
1) Decide which datasets to use

* [List of Federal .gov Domains](https://github.com/GSA/federal-website-index/blob/main/source-data/dotgov-registry-federal.md)
* [Digital Analytics Program Websites](https://github.com/GSA/federal-website-index/blob/main/source-data/dap.md)
* 2016 EOT archive
* ...

2) Download fresh copies of the data and host them as snapshots [here](https://github.com/GSA/federal-website-index/tree/main/data/snapshots)

3) Upload/Import into a Google spreadsheet 

4) Normalize the columns so that the data can be stacked on each other

5) Combine all of the URLs 

6) Dedup the URLs

7) Remove URLs that begin with certain strings that are on our ignore list (e.g. `staging.`)

8) Add in the override list

7) Filter for Federal domains

8) Add corresponding base domain, agency, agency code, office, and bureau code

9) Export as a CSV and [host here](https://raw.githubusercontent.com/GSA/data/master/dotgov-websites/site-scanning/current-federal-subdomains.csv) for the use of the Site Scanning tool

10) Note that the Site Scanning system then needs to be prompted to ingest the new list.  
