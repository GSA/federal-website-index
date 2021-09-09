
1) Decide which datasets to use

* DAP export
* .gov domain export 
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

9) Export as a CSV and [hohttps://raw.githubusercontent.com/GSA/data/master/dotgov-websites/site-scanning/current-federal-subdomains.csvhere](url) for the use of the Site Scanning tool
