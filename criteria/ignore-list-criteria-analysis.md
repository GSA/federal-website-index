


### Contains `acpt`

There's currently 15 entries that contain `acpt` in the federal website index.
- All belong to NSF, which I believe uses it as part of acceptance testing.
- Only 2 resolve to websites - the rest timeout, do not connect, or return an error server code.
- The 2 that resolve have been requested for us to remove them by NSF given that they are staging/development sites.

Therefore, we should add `acpt` to the `contains` ignore list.  

### Begins with `tools.`

There's currently 8 entries that begin with `tools.` in the federal website index.  
- 2 are public sites in their own right
- 2 are redirects
- 1 resolves to a blank page so should be removed
- 3 are for internal collaboration tools, so should be removed

Therefore, we should filter out the four specific sites we want to remove instead of filtering all `tools.` sites.  
