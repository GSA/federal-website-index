## Cybersecurity and Infrastructure Security Agency HTTPS Scans

The Cybersecurity and Infrastructure Security Agency, a component of the Department of Homeland Security, runs regular security scans against the .gov domain.  As part of that, they generate a dataset of known federal .gov websites, along with assorted HTTPS/HSTS scan data.  More information about their fields and methodologies can be found in the [NCATS data dictionary](https://github.com/cisagov/ncats-data-dictionary/blob/develop/NCATS_Data_Dictionary.md).  

The file is updated on a monthly basis, is [located here](https://github.com/GSA/federal-website-index/blob/main/data/dataset/cisa_https.csv), and can be [downloaded here](https://raw.githubusercontent.com/GSA/federal-website-index/refs/heads/main/data/dataset/cisa_https.csv).  It contains roughly 101,000 urls, though the seed list that is used to contribute to building the website index is about 22,000 urls once the `LIVE` field is filtered for `TRUE`.  
