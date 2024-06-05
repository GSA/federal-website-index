
### Begins with `access.`
- 35 entries begin with `access.`
- I spot checked them all and 6 should not be filtered out, so I'm going to add them to the exceptions list.  

### Contains `accounts`
- 13 records, all but two regular accounts.xxxx
- Everyone is a login page and should be filtered out.  Doing that now.  


### Contains `acpt`

There's currently 15 entries that contain `acpt` in the federal website index.
- All belong to NSF, which I believe uses it as part of acceptance testing.
- Only 2 resolve to websites - the rest timeout, do not connect, or return an error server code.
- The 2 that resolve have been requested for us to remove them by NSF given that they are staging/development sites.
  
Therefore, we should add `acpt` to the `contains` ignore list.  

### Contains `alpha`
- 9 records
- 8 are staging-esque sites or similar, with only one seemingly production and public-facing.
- I'll filter out the 8, then add the last one into the `except` file so that it stays in.  


### Begins with `api`

There's currently 62 entries that start with `api.`.  
- 28 resolve or redirect to a real webpage of substance.
- 34 seem to either not load or go straight to the endpoint.
- I'm adding the 34 directly to the begins with list but leaving the other 29 in place

There's another 13 that start just with `api`.  Of those, 7 either do not load, go straight to the endpoint, or are staging urls.  

### Contains `api`

There's 204 entries that contain (but don't start with) `api`.  


### Begins with `app`
- There are 147 websites in our index that begin with `app`.
- 6 begin with `app-` and should all be filtered out.
- Some sites that begin with `app.` are legitimate and shouldn't be filtered out.  Therefore, I think the move is to add individual websites that we want to remove to the ignore list.  
- I've started doing ^^^ but there's a bunch that are already getting filtered out for not being live, so I'm not going to worry about those and just look at the ones that are live with 200 codes. 

### Contains `auth`
- 127 contain the string, many of which should stay.
- adding a bunch of begins with `auth...` 

### Contains `cdn`
- 5 records contain the string
- All should be filtered.  Adding a variety of begins and contains to do that.  

### Begins with `cms`

There's 93 urls that contain `cms` [that are removed](https://github.com/GSA/federal-website-index/blob/main/data/snapshots/ignored-removed-begins.csv) by the [`begins-with` ignore list](https://github.com/GSA/federal-website-index/blob/main/criteria/ignore-list-begins.csv).  Of those, 37 are cms.gov urls.  This means that maybe 47 are being removed by this filter (the other 36 are x.cms.gov urls that are rightly removed by another beginning string).  So, the filter is doing good work, but we need to somehow whitelist `cms.gov`.    

I'm creating an issue to consider solutions, such as moving the `other-websites` source file to the very end of the index generation process.  

### Begins with `connect.`

- There's 27 urls that contain `connect` [that are removed](https://github.com/GSA/federal-website-index/blob/main/data/snapshots/ignored-removed-begins.csv) by the [`begins-with` ignore list](https://github.com/GSA/federal-website-index/blob/main/criteria/ignore-list-begins.csv).  26 appear to be rightly filtered, but `connect.gov` shouldn't be.
- The same fix for `cms.gov` can be used to redress this, too.  

### Contains `demo`

We're already filtering out websites that begin with `demo.`.  After that, there's still 94 that contain `demo`.  

The `contains` ignore list actually functions by requiring that the string be boxed in on either side by special characters (e.g. a period or hyphen).  This is good for now, because at least some of the websites that just contain `demo` are intended for the public (e.g. democrats.gov, democraticleader.gov).  

- There are 56 entries that are `.demo.`, `-demo.`, or `-demo`, all of which appear to be staging or development sites and none of which appear to be intended for public consumption.
- Skimming through the rest, I can't see any others that would get caught up in this filter that we wouldn't want to remove.
- There are still several staging and development websites that look like they won't get filtered (e.g. awsdemo.grantsolutions.gov), but this change will at least address the ones that are currently being asked for us to remove.

### Contains `files`
- 46 results
- Some are legit, esp. if part of 'profiles'
- I'm going to Add to begin-ignore list: `cloudfiles.`, `nasatvfiles.`, `sfiles.` `files.`, `nfiles.`, and `nacp-files.`

### Contains `ftp` 
- 99 results
- Many are on eftps.gov, or are otherwise possibly urls that shouldn't be filtered.
- All that begin with `ftp`, `ftp2`, or `sftp` seem safe to filter though so I'll add those to these.



### Begins with `gp.`

Currently, 5 websites in the index begin with `gp.`.  

- At least 1 is a reference to an internal vpn resource called Global Protect.
- The other 4 do not resolve or return errors.

It seems safe and appropriate to filter all of these out by adding `gp.` to the begins list.  


### Begins with `idp`
- 28 records, all but 2 of which begin with `idp.` or `idp-`.
- Filtering those 26 should be good for now.

### Contains `preprod`
- There's 74 records.
- Looking through them, I think all can and should be filtered.
- I'm going to begin by adding `preprod` to both ignore lists, which will get mosts.  But will need to come back to look for edge cases that have the string buried within the url.

### Contains `sandbox`
- There's 47 records.
- It's a bit of a mess.
- To begin with, adding `sandbox` to begins and contains list.  

### Begins with `sbx`
- Only two records, both of which should clearly be filtered.
- Adding `sbx` to the begins list.  



### Contains `sharepoint`

We are already filtering out sites that begin with `sharepoint.`.  After that, 6 websites still contain `sharepoint`.  
- 2 do not resolve and seem safe to specifically remove as internal collaboration tools.
- 1 will soon be removed because it also contains `acpt`.  
- Of the other three though, they appear to all reference external guests/non-government individuals having access.  Up until now, our sense is that such a site *would* actually stay in the federal website index.  We should discuss further to confirm, but if that's the case, then we'll likely not filter them out.

### Contains `sit`
- 204 contain the string, but many should not be filtered
- Those that begin with `sit.` or contain `sit` between two characters all should be filtered.
- Adding `sit` to the contains ignore list should cover those.  

### Begins with `telework.`

- There's 3 urls that contain `telework.` [that are removed](https://github.com/GSA/federal-website-index/blob/main/data/snapshots/ignored-removed-begins.csv) by the [`begins-with` ignore list](https://github.com/GSA/federal-website-index/blob/main/criteria/ignore-list-begins.csv).
- One shouldn't be removed (telework.gov).
- One is rightly removed by another filter (dev.telework.gov)
- The third needs to be removed (telework.ojp.usdoj.gov).
- To address the issue, I'm going to remove `telework.` from the `begins with` ignore list but add in `telework.ojp.usdoj.gov`



### Begins with `tools.`

There's currently 8 entries that begin with `tools.` in the federal website index.  
- 2 are public sites in their own right
- 2 are redirects
- 1 resolves to a blank page so should be removed
- 3 are for internal collaboration tools, so should be removed

Therefore, we should filter out the four specific sites we want to remove instead of filtering all `tools.` sites.  

### Contains `vdi`

We are already filtering out sites that begin with `vdi.`.  After that 32 websites still contain `vdi`.  

- I've manually checked all 32 and all seem to be internal tools (i.e. all are virtual desktops systems meant for internal staff use).
- Unfortunately, there's a huge variety how the string `vdi` is included in there, so the only rule that would get them would be a true contains `vdi` instead of what we currently have, which requires characters on both sides.
- Adding `evdi` to the current contains list would get 7 of these.
- Adding `vdi-` to the begins list gets another 2.
- Adding `vdilab` to the begins list gets another 2.

This still leaves a good number unaddressed.  I'm creating an issue to return to this.  

### Contains `www` (and further characters with it)

Some background notes, from [here](https://github.com/GSA/site-scanning/issues/1021): 
- There are 29,649 target URLs
- 3,161 begin with www.
- 3,231 contain www. (70 unique from ^^^)
- 3,460 begin with www (298 unique from both of ^^^)
- 3,577 contain www (48 unique from all of ^^^^))

Looking at these turns up a lot of good candidates, e.g. `local-`, `origin-`, `qa-`, and more
