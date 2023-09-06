


## V2, using GitHub Actions (active) - verbose version 


* The federal website index is created by combining and processing a number of individual source datasets.  The list of datasets is managed [here](https://github.com/GSA/federal-website-index/blob/main/builder/main.py), and the urls for these datasets are managed [here](https://github.com/GSA/federal-website-index/blob/main/builder/main.py).  
* The specified source datasets are copied and imported into memory.  Snapshots of each individual dataset are stored [here](https://github.com/GSA/federal-website-index/tree/main/data/snapshots).
* One further source dataset is created by taking the [list of federal .gov domains](https://github.com/GSA/federal-website-index/blob/main/source-data/dotgov-registry-federal.md) and adding `www` to the front of each of them.
* Agency, bureau, and branch information is added to each website by pulling in the relevant information for its base domain from the [list of federal .gov domains](https://github.com/GSA/federal-website-index/blob/main/source-data/dotgov-registry-federal.md).  
* The various source datasets are combined.  A snapshot of this combined list is stored [here](https://github.com/GSA/federal-website-index/blob/main/data/snapshots/combined.csv).  
* The combined list of websites is then deduplicated.  A snapshot of the dedupped list is stored [here](https://github.com/GSA/federal-website-index/blob/main/data/snapshots/combined-dedup.csv).  A list of the website that are removed in this step is stored [here](https://github.com/GSA/federal-website-index/blob/main/data/snapshots/dedup-removed.csv).
* The list of websites is filtered to remove any entries that should be ignored, as specified by two ignore files (begins with list, contains list). The purpose of this is to try and remove non-public websites.
* ...





The code for this process is [here](https://github.com/GSA/federal-website-index/blob/main/builder/main.py), and is actually well commented so as to enable a layperson to follow what is happening.  

## V2, using GitHub Actions (active)

* The process now runs automatically [once a week](https://github.com/GSA/site-scanning-documentation/blob/main/pages/schedule.md) or can be triggered on demand.  
* The order of the process is represented [in this code](https://github.com/GSA/site-scanning-documentation/blob/main/pages/schedule.md) (from the beginning to the end of the file).  


## ~V1, using google sheets (inactive)~

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
