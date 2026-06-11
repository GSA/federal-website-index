# AGENTS.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The Federal Website Index is a GSA project that maintains a comprehensive, up-to-date list of public federal government `.gov` websites. The index is automatically rebuilt weekly (Wednesday at 6pm ET) and serves as the target URL list for the Site Scanning program.

The project aggregates data from ~30 different source lists (including DAP analytics, dotgov registry, pulse.cio.gov, OMB IDEA, End of Term archives, etc.), deduplicates and validates entries, filters non-public sites, and produces a single authoritative CSV file at `data/site-scanning-target-url-list.csv`.

## Repository Structure

- `builder/` - TypeScript application using Bun runtime that builds the index
- `dapDataCollapse/` - Python script that pre-processes DAP top 100000 domains data
- `data/` - Output files and snapshots
  - `site-scanning-target-url-list.csv` - Final index output
  - `source-lists/` - Raw source data files
  - `source-list-snapshots/` - Snapshots of individual sources
  - `process-snapshots/` - Intermediate processing steps
  - `formatted-source-lists/` - Cleaned source data
- `criteria/` - Filtering rules for non-public sites
  - `ignore-list-begins.csv` - URL prefix patterns to filter (e.g., "admin.", "staging.")
  - `ignore-list-contains.csv` - URL substring patterns to filter
  - `ignore-except.csv` - Exceptions to ignore rules
  - `suspected-dead-sites.csv` - Sites that consistently fail DNS resolution
- `process/` - Documentation of the index building process

## Development Commands

For first-time setup instructions, use the `/setup` skill.

For common development workflows, use the `/dev-workflow` skill.

To add a new data source to the index, use the `/add-source` skill.

### Quick Reference

**TypeScript Builder (Primary Application):**
```bash
cd builder
bun src/main.ts      # Run the full index builder
```

**Python DAP Data Processor:**
```bash
cd dapDataCollapse
python main.py       # Pre-process DAP analytics data
```

## Architecture

### Index Building Pipeline

The builder (`builder/src/main.ts`) executes a sequential pipeline with snapshots at each step:

1. **Fetch source lists** - Load ~30 source list classes (each implements a `loadData()` method that fetches and formats data)
2. **Union** - Combine all sources into single DataFrame
3. **Deduplicate** - Remove duplicate URLs
4. **Extract domains** - Add `base_domain` and `tld` columns
5. **Merge agency/bureau info** - Join federal domains registry data (dotgov, dotmil, non-gov/mil federal) to add agency/bureau/branch
6. **Override with OMB data** - OMB IDEA data has more accurate agency/bureau info
7. **Tag ignore list sites** - Mark non-public sites using criteria files (sets `Filtered = TRUE`)
8. **Filter to federal domains** - Remove sites with base domains not in federal registry
9. **Merge DAP analytics** - Add pageview/visit counts from collapsed DAP data
10. **Remove suspected dead sites** - Filter out sites from `suspected-dead-sites.csv`
11. **Reorder columns** - Align with Site Scanning schema
12. **Sort** - Alphabetize by `base_domain` then `initial_url`

Snapshots are written to `data/process-snapshots/` after each step (e.g., `after-union.csv`, `after-dedup.csv`, etc.).

### Source List Architecture

Each source list is a class in `builder/src/services/source-lists/` that:
- Extends a common base pattern
- Implements `loadData()` which returns a DataFrame
- Fetches data from URLs or local files defined in `builder/src/config/source-list.config.ts`
- Normalizes URL format (removes protocols, www., paths)
- Writes snapshot to `data/source-list-snapshots/`

Configuration in `source-list.config.ts` defines:
- `sourceUrl` - Remote URL or local path
- `sourceColumnName` - Column name in final output (e.g., `source_list_dap`)
- `shortName` - Abbreviated identifier
- `hasHeaders` - Whether CSV has header row

The enum `SourceList` in `builder/src/types/config.ts` defines all available sources.

### Adding a New Source List

1. Create new class file in `builder/src/services/source-lists/NewSourceList.ts`
2. Add enum entry to `SourceList` in `builder/src/types/config.ts`
3. Add configuration to `sourceListConfig` in `builder/src/config/source-list.config.ts`
4. Import and add to `fetchAllSourceListData()` array in `builder/src/main.ts` at `[SOURCE-ADD-POINT]`
5. Add column default in `setSourceListColumnDefaults()` function

### Utility Functions

`builder/src/utils/utilities.ts` contains core DataFrame operations:
- `unionSourceLists()` - Combines DataFrames
- `deduplicateSiteList()` - Removes duplicate URLs
- `extractBaseDomainFromUrl()` / `extractTLDFromUrl()` - Domain parsing
- `mergeUrlInfo()` - Joins agency/bureau data
- `tagIgnoreListSites()` - Applies filter criteria
- `removeNonFederalSites()` - Filters to federal domains only
- `mergeDapTopListDataframe()` - Adds analytics data
- `removeDeadSites()` - Filters suspected dead sites
- `generateAnalysisEntry()` - Creates summary statistics

## GitHub Actions Workflows

Four automated workflows in `.github/workflows/`:

1. **build-list-js.yml** - Main workflow, runs daily at 8:15pm UTC (3:15pm ET)
   - Runs TypeScript builder
   - Auto-commits results
   - Creates GitHub issue on failure

2. **build-dap-top-list.yml** - Processes DAP data
   - Runs Python DAP processor

3. **build-finalurl-list.yml** - Builds final URL list subset

4. **build-mil-list.yml** - Builds military domain list

## Data Files

The final output `data/site-scanning-target-url-list.csv` contains columns:
- `Target URL` - The website URL
- `Target URL Branch` - Federal branch (Executive, Legislative, Judicial)
- `Agency` - Agency name
- `Bureau` - Bureau/office name
- `Agency Code` - OMB agency code
- `Bureau Code` - OMB bureau code
- `base_domain` - Base domain extracted from URL
- `tld` - Top level domain
- `Filtered` - TRUE if marked as non-public
- `DAP_pageviews` - 30-day pageview count from DAP
- `DAP_visits` - 30-day visit count from DAP
- `source_list_*` - Boolean columns indicating which source lists contain this URL

The analysis file `data/site-scanning-target-url-list-analysis.csv` provides summary statistics about each processing step.

## Integration with Site Scanning Engine

This repository produces the target URL list consumed by the [Site Scanning Engine](https://github.com/GSA/site-scanning-engine).

**Integration flow:**
1. Federal Website Index generates nightly CSV at: `data/site-scanning-target-url-list.csv`
2. Site Scanning Engine ingests this file daily at 22:15 UTC via GitHub Actions workflow
3. Engine loads URLs into PostgreSQL `website` table
4. URLs are then queued for scanning by Puppeteer workers
5. Scan results are stored and exported as public snapshots

**Key integration points:**
- CSV format must match what Site Scanning Engine expects (columns: Target URL, Agency, Bureau, etc.)
- URL format should be normalized (no protocols, consistent www handling)
- The `Filtered` column marks sites that should potentially be excluded from scanning
- Agency/Bureau metadata enables scan result grouping and analysis

**Downstream dependencies:**
- Site Scanning API serves scan results to public at https://api.gsa.gov/technology/site-scanning/
- Digital Analytics Program (DAP) uses scan results for federal website analytics
- TTS uses data for policy compliance monitoring (accessibility, HTTPS, etc.)

## Key Constraints

- Only includes `.gov` websites (not `.mil`, `.com`, `.org`, etc.)
- Filters out non-public sites using patterns in `criteria/` files
- Only includes sites with base domains in the federal `.gov` registry
- Normalizes URLs by removing protocols, `www.` prefixes, and paths before deduplication
- Combines `www.` and non-`www.` analytics counts

## Development Philosophy

- **Evolved from manual to automated**: This codebase started as a manual Python process and evolved to a well-engineered TypeScript system
- **Source list pattern**: Each data source is a distinct class that handles data preparation and cleaning independently
- **Metadata tracking**: Analysis object tracks statistics at each pipeline step for debugging and monitoring
- **Immutable snapshots**: Each processing step writes a snapshot CSV for auditability
- **Configuration-driven**: Source URLs and column mappings are centralized in config files rather than hardcoded
