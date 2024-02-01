

## For a website that is not in the `Primary` snapshot (aka adding a website)

_x.y.gov is reported as not being a target URL in the Site Scanning data._

* First, see if x.y.gov is in the Federal Website Index ([direct link](https://raw.githubusercontent.com/GSA/federal-website-index/main/data/site-scanning-target-url-list.csv); [flatgithub link](https://flatgithub.com/GSA/federal-website-index/blob/main/data/site-scanning-target-url-list.csv?filename=data%2Fsite-scanning-target-url-list.csv))
  * If x.y.gov isn't in the Federal Website Index, check whether it was in any of the source datasets by seeing if it is in the [combined list](https://github.com/GSA/federal-website-index/blob/main/data/snapshots/combined.csv) that represents the very first step in the index creation process.
    * If x.y.gov isn't in the combined list, add x.y.gov to [the `Other Websites` list](https://github.com/GSA/federal-website-index/blob/main/data/dataset/other-websites.csv), in alphabetical order.
    * If x.y.gov is in the combined list, then look at [each of the snapshots that are created](https://github.com/GSA/federal-website-index/tree/main/data/snapshots#readme) at each step of the index creation process to see at which step x.y.gov was removed.
      * The [`begins with` ignore list](https://github.com/GSA/federal-website-index/blob/main/criteria/ignore-list-begins.csv) or the [`contains` ignore list](https://github.com/GSA/federal-website-index/blob/main/criteria/ignore-list-contains.csv) are almost certainly where x.y.gov is being filtered out, so the fix will likely be a matter of refining those files.
  * If x.y.gov is in the Federal Website Index, then look at the current Site Scanning data for that entry, either by [querying the API directly](https://api.gsa.gov/technology/site-scanning/v1/websites/x.y.gov?API_KEY=DEMO_KEY) or looking at the [`All` snapshot](https://api.gsa.gov/technology/site-scanning/data/weekly-snapshot-all.csv).
    * Reasons that x.y.gov may be filtered out of the `Primary` snapshot include 1) primary scan status error, 2) the final URL is inactive (i.e. a 4xx or 5xx server code), or 3) the final URL is a data file (JSON, XML) or image file (JPG).
    * Manually check x.y.gov by loading it into a browser and if it doesn't appear to match any of ^^^ situations, [file an issue](https://github.com/GSA/site-scanning/issues).  






## For a website that is in the primary snapshot (aka removing a website)
