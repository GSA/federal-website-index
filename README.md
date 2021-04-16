# Federal Website Index

The goal of this project is to assemble an accurate, up-to-date list of the public websites of the federal government.  It turns out that there's a lot more to that than one might think, but this repository will get into the detail and nuance behind that and refer to the resulting datasets.  This effort is a part of the [Site Scanning program](https://digital.gov/site-scanning).    

## Background

Virtually every one of the ~800 agencies that make up the US federal government maintain one or more websites (e.g. `www.state.gov`, `space.commerce.gov`).  We know what .gov domains exist and which of them are registered by federal agencies because the .gov registry [makes this information public](https://github.com/GSA/data/blob/master/dotgov-domains/current-federal.csv), but that only tells us what domains exist (e.g. state.gov, commerce.gov). Each domain may actually have hundreds of distinct websites (e.g. statecollection.census.gov and opportunity.census.gov are different websites than www.census.gov).  This project tries to find all of those distinct websites that are available to the public.  


## Caveats
 
* The true extent of federal websites includes many `.mil` websites, a small number of `.fed.us` websites, and some number of .com and .org websites.  For practical purposes, this project does not currently include those. While it is difficult to quantify the number of federal websites on those domains, we do know that `.gov` websites make up the vast bulk of federal websites. Over time though, we do aim to expand the scope of this website index to include this other top level domains. 
* There are many `.gov` domains and websites used by state, tribal, and local governments.  This index excludes those by using the [list of federal .gov domains](https://github.com/GSA/data/blob/master/dotgov-domains/current-federal.csv) as a canonical list of the `.gov` domains (and thus websites) that are operated by the federal government.  

## Summary of Methodology

The basic process for assembling this website index is as follows: 
* Download the below datasets
* Assemble them
* Dedup the list
* Remove any websites that do not a base domain that is on the list of federal .gov domains.
* Use the list of federal .gov domains to assign every website an agency and bureau
* Use the OMB list of agency and bureau codes to assign every website agency and bureau codes.  

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
