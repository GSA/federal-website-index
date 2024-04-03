The files in this folder automatically update/overwrite whenever a new target URL list is generated. Here is what each file contains:

- [dap.csv](https://github.com/GSA/federal-website-index/blob/main/data/snapshots/dap.csv) - a snapshot of the DAP sourcefile that is being ingested
- [gov.csv](https://github.com/GSA/federal-website-index/blob/main/data/snapshots/gov.csv) - a snapshot of the list of federal .gov domains sourcefile that is being ingested
- [pulse.csv](https://github.com/GSA/federal-website-index/blob/main/data/snapshots/pulse.csv) - a snapshot of the pulse snapshot sourcefile that is being ingested
- [other.csv](https://github.com/GSA/federal-website-index/blob/main/data/snapshots/other.csv) - a snapshot of the of the websites list that is being ingested from `../dataset/other-websites.csv`
- [combined.csv](https://github.com/GSA/federal-website-index/blob/main/data/snapshots/combined.csv) - a snapshot of the list created when each of the sourcefiles are first added together
- [combined-dedup.csv](https://github.com/GSA/federal-website-index/blob/main/data/snapshots/combined-dedup.csv) - a shapshot of the list created when the `combined` list is deduped
- [dedup-removed.csv](https://github.com/GSA/federal-website-index/blob/main/data/snapshots/dedup-removed.csv) - a list of the URLs that are removed when the `combined` list is deduped
- [remove-ignore-begins.csv](https://github.com/GSA/federal-website-index/blob/main/data/snapshots/remove-ignore-begins.csv) - a snapshot of the list created when URLs that meet the `ignore list` 'begins with' criteria are removed from the `combined-deduped` list
- [remove-ignore-contains.csv](https://github.com/GSA/federal-website-index/blob/main/data/snapshots/remove-ignore-contains.csv) - a snapshot of the list created when URLs that meet the `ignore list` 'contains' criteria are removed from the `remove-ignore-begins` list
- [ignored-removed-begins.csv](https://github.com/GSA/federal-website-index/blob/main/data/snapshots/ignored-removed-begins.csv) - a list of the URLs that are removed when the URLs that meet the `ignore list` 'begins' criteria are removed from the `combined-deduped` list
- [ignored-removed-begins.csv](https://github.com/GSA/federal-website-index/blob/main/data/snapshots/ignored-removed-begins.csv) - a list of the URLs that are removed when the URLs that meet the `ignore list` 'contains' criteria are removed from the `remove-ignore-begins` list
- ~remove-nonfederal.csv~ - a snapshot of the list created when URLs on non-federal domains are removed from the `remove-ignore` list; **this is the [final target URL list file](https://github.com/GSA/federal-website-index/blob/main/data/site-scanning-target-url-list.csv)**
- [nonfederal-removed.csv](https://github.com/GSA/federal-website-index/blob/main/data/snapshots/nonfederal-removed.csv) - a list of the URLS that are removed when the URLS on non-federal domains are removed from the `remove-ignore` list


- [ignore-except.csv](https://github.com/GSA/federal-website-index/blob/main/criteria/ignore-except.csv) - List of the URLs that are added back in at the end of the process in order to ensure that they are not filtered out  
