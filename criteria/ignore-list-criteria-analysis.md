


### Contains `acpt`

There's currently 15 entries that contain `acpt` in the federal website index.
- All belong to NSF, which I believe uses it as part of acceptance testing.
- Only 2 resolve to websites - the rest timeout, do not connect, or return an error server code.
- The 2 that resolve have been requested for us to remove them by NSF given that they are staging/development sites.

Therefore, we should add `acpt` to the `contains` ignore list.  

### Contains `demo`

We're already filtering out websites that begin with `demo.`.  After that, there's still 94 that contain `demo`.  

The `contains` ignore list actually functions by requiring that the string be boxed in on either side by special characters (e.g. a period or hyphen).  This is good for now, because at least some of the websites that just contain `demo` are intended for the public (e.g. democrats.gov, democraticleader.gov).  

- There are 56 entries that are `.demo.`, `-demo.`, or `-demo`, all of which appear to be staging or development sites and none of which appear to be intended for public consumption.
- Skimming through the rest, I can't see any others that would get caught up in this filter that we wouldn't want to remove.
- There are still several staging and development websites that look like they won't get filtered (e.g. awsdemo.grantsolutions.gov), but this change will at least address the ones that are currently being asked for us to remove.  

### Begins with `tools.`

There's currently 8 entries that begin with `tools.` in the federal website index.  
- 2 are public sites in their own right
- 2 are redirects
- 1 resolves to a blank page so should be removed
- 3 are for internal collaboration tools, so should be removed

Therefore, we should filter out the four specific sites we want to remove instead of filtering all `tools.` sites.  
