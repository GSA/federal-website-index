The files in this folder automatically update/overwrite whenever a new target URL list is generated.  Here is what each file contains:  

* dap.csv - a snapshot of the DAP sourcefile that is being ingested
* gov.csv - a snapshot of the list of federal .gov domains sourcefile that is being ingested
* pulse.csv - a snapshot of the pulse snapshot sourcefile that is being ingested
* To Create: other-websites.csv - a snapshot of the pulse snapshot sourcefile that is being ingested
* combined.csv - a snapshot of the list created when each of the sourcefiles are added together 
* combined-dedup.csv - a shapshot of the list created when the `combined` list is deduped
* dedup-removed.csv - a list of the URLs that are removed when the `combined` list is deduped
* remove-ignore.csv - a snapshot of the list created when URLs that meet the `ignore list` criteria are removed from the `combined-deduped` list
* ignored-removed.csv - a list of the URLs that are removed when the URLs that meet the `ignore list` criteria are removed from the `combined-deduped` list
* remove-nonfederal.csv - a snapshot of the list created when URLs on non-federal domains are removed from the `remove-ignore` list; this is the final target URL list file  
* nonfederal-removed.csv - a list of the URLS that are removed when the URLS on non-federal domains are removed from the `remove-ignore` list   




