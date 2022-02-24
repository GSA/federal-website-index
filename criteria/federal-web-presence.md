
## Understanding the size and scope of the federal web presence

There is no clear definition of what is meant by the US government's web presence.  Arguably, it includes not just websites operated by federal agencies, but also social media accounts and any other official content that agencies publish on the internet.  That said, for the purposes of this effort, we generally use the term `federal web presence` to refer to the public websites operated by the federal government.  

This federal web presence can be broadly split up into sites that end in `.gov.`, `.mil`, or anything else (`.com/.org/etc`).

### .gov

As of February 2022, there are 7,515 [domains registered in the .gov directory](https://github.com/cisagov/dotgov-data/blob/main/current-full.csv).  Of those, 6,232 are registered by state, local, and tribal agencies and 1283 are [registered by federal agencies](https://github.com/cisagov/dotgov-data/blob/main/current-federal.csv). 

So far, we have not found one public dataset that includes every website created on every federal .gov, but by combining and deduping the datasets that we have found, a picture emerges of roughly 250,000 subdomains.  However, a scan of those 250,000 results in only about 50,000 being accessible over the public internet.  The 200,000 that do not resolve don't do so for a number of reasons, including that they are only available inside firewalls or that the site has since been taken down.  Of the 50,000 websites that resolve, roughly half still may not make sense to think of as a public federal website (e.g. a login page to a system that is private, or a staging version of a website).

Thus, we end up with about the number 25,000 as a pretty good estimate for the number of Federal public websites across the 1,300 domains operated by Federal agencies.  


### .mil

We do not currently have a comprehensive list of domains or websites in the .mil area.  One useful dataset though is the [list of DOD websites](https://www.defense.gov/Resources/Military-Departments/DOD-Websites/) that the Department of Defense maintains.  It is not comprehensive, in the sense of capturing all of the discrete subdomains on each domain, but is still a good start.  


