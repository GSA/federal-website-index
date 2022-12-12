

## V2, using GitHub Actions

* The process now runs automatically [once a week](https://github.com/GSA/site-scanning-documentation/blob/main/pages/schedule.md) or can be triggered on demand.  
* The order of the process is represented [in this code](https://github.com/GSA/site-scanning-documentation/blob/main/pages/schedule.md) (from the beginning to the end of the file).  


## V1, using google sheets 

1) Decide [which datasets to use](https://github.com/GSA/federal-website-index#major-datasets)

2) Download fresh copies of the data and host them as snapshots [here](https://github.com/GSA/federal-website-index/tree/main/data/snapshots)

3) Take the [current template formula spreadsheet](https://docs.google.com/spreadsheets/d/1reGwemIkUeMDwyebQTcHuutaRxCUUztAK_INv9287tA/edit#gid=1843664497) and clone it into [this folder](https://drive.google.com/drive/u/1/folders/1ndBdaI78RPFPQAjamROOmiv_wCi1bsp5)

5) Import the fresh copies of the source data into the new spreadsheet

4) Normalize the columns so that the data can be stacked on each other

5) Use Find/Replace to remove the `Federal - ` from the Branch column on the `federal_domains` sheet

6) Combine all of the URLs 

7) Dedup the URLs

8) Remove URLs that begin with certain strings that are on our ignore list (e.g. `staging.`)

9) Add in the override list

10) Filter for Federal domains

11) Add corresponding base domain, agency, agency code, office, and bureau code

12) Export as a CSV and [host here](https://raw.githubusercontent.com/GSA/data/master/dotgov-websites/site-scanning/current-federal-subdomains.csv) for the use of the Site Scanning tool

13) Note that the Site Scanning system then needs to be [prompted]([url](https://github.com/GSA/site-scanning-engine/actions/workflows/ingest.yml)) to ingest the new list.  
