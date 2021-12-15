# Federal Website Index

The goal of this project is to assemble an accurate, up-to-date list of the public websites of the federal government.  It turns out that there are a lot of sources to consider, but this repository will explain the process used and reference the source datasets. This effort is a part of the [Site Scanning program](https://digital.gov/site-scanning).    

## Background

Virtually all of the ~800 agencies that make up the US federal government maintain one or more websites (e.g. `www.state.gov`, `space.commerce.gov`). We know what `.gov` domains exist and which of them are registered by federal agencies because the `.gov` registry [makes this information public](https://github.com/GSA/data/blob/master/dotgov-domains/current-federal.csv), but that only tells us what domains exist (e.g. `state.gov`, `commerce.gov`). Each domain may actually have hundreds of distinct web properties (e.g. `statecollection.census.gov` and `opportunity.census.gov` are different websites than `www.census.gov`). This project tries to assemble a comprehensive list of all distinct federal websites available to the public.  


## Caveats
 
* The full extent of federal websites includes many `.mil` websites, a small number of `.fed.us` websites, and some number of `.com` and `.org` websites. For practical purposes, this project does not currently include those. While it is difficult to quantify the number of federal websites on those domains, we do know that `.gov` websites make up the vast majority of federal websites. Over time, we plan expand the scope of this website index to include other top level domains. 
* There are many `.gov` domains and websites used by state, tribal, and local governments. This index excludes those by using the [list of federal .gov domains](https://github.com/GSA/data/blob/master/dotgov-domains/current-federal.csv) as a canonical list of the `.gov` domains (and thus websites) that are operated by the federal government.  

## Summary of Methodology

Here's the process we use to build the website index: 
* Download, combine, and deduplicate the below datasets
* Remove any websites that do not a base domain that is on the list of federal `.gov` domains.
* Use the list of federal `.gov` domains to assign each website an agency and bureau
* Use the OMB list of agency and bureau codes to match and add website agency and bureau codes.  

## Major Datasets

* [List of Federal .Gov Domains](https://github.com/GSA/data/blob/master/dotgov-domains/current-federal.csv) 
* [List of Websites That Participate In The Digital Analytics Program](https://analytics.usa.gov/data/live/sites.csv) 
* [2016 End of Term Web Archive](https://github.com/end-of-term/eot2016/blob/master/seed-lists/eot_2016_bulk_seeds_test_report.txt)
* [OMB Bureau/Agency Codes](https://resources.data.gov/resources/dcat-us/#bureauCode)
* Censys 
* Rapid7
* .gov Registry DNS


## Feedback

If you have questions or want to give feedback, please [leave an issue here](https://github.com/GSA/federal-website-index/issues) or email site-scanning@gsa.gov.  
