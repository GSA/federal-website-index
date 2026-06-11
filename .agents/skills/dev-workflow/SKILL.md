---
name: dev-workflow
description: Common development commands and workflows for building and debugging the Federal Website Index
trigger: Use when user asks about running the builder, debugging output, understanding snapshots, or common development tasks
---

# Dev Workflow Skill

Common development commands and workflows for the Federal Website Index.

## Quick Reference

### Building the Index

```bash
cd builder
bun src/main.ts      # Run the full index builder
bun start            # Alternative using package.json script
```

**Duration:** 5-10 minutes for full build

### Processing DAP Data

```bash
cd dapDataCollapse
python main.py       # Download and process DAP top 100k domains
```

This pre-processes DAP analytics data before the main builder runs.

## Understanding Output Files

### Key Output Files

- `data/site-scanning-target-url-list.csv` - **Final output** consumed by Site Scanning Engine
- `data/site-scanning-target-url-list-analysis.csv` - Summary statistics for each pipeline step

### Process Snapshots (for debugging)

Each pipeline step writes a snapshot to `data/process-snapshots/`:
- `after-union.csv` - Combined source lists
- `after-dedup.csv` - After deduplication
- `after-add-base_domain-tld.csv` - With domain fields added
- `after-GOV-agency-bureau-merge.csv` - After .gov domain info merge
- `after-MIL-agency-bureau-merge.csv` - After .mil domain info merge
- `after-OTHER-FEDERAL-agency-bureau-merge.csv` - After other federal merge
- `after-OMB-agency-bureau-merge.csv` - After OMB IDEA override
- `after-gov_mil-filter.csv` - After filtering to federal domains
- `after-dap_top_100000_merge.csv` - After analytics data merge
- `after-dead-sites-filter.csv` - After removing suspected dead sites
- `after-column-reorder.csv` - After column reordering
- Final output is then alphabetized

### Source List Snapshots

Individual source lists are saved to `data/source-list-snapshots/`:
- `dotgov-registry-federal.csv`
- `pulse.csv`
- `dap.csv`
- `omb_idea.csv`
- ... (30+ files)

Use these to debug issues with specific data sources.

## Common Development Tasks

### Debugging Pipeline Issues

1. **Check which step failed**: Look at console output for error messages
2. **Examine snapshots**: Open the last successful snapshot CSV in `data/process-snapshots/`
3. **Validate source data**: Check corresponding file in `data/source-list-snapshots/`
4. **Review analysis**: Check `data/site-scanning-target-url-list-analysis.csv` for counts

### Testing Changes to Source Lists

After modifying a source list class:

1. Run the builder
2. Check `data/source-list-snapshots/<source-name>.csv` for your source
3. Verify format matches expected columns
4. Check `after-union.csv` to ensure it merged correctly

### Modifying Filter Criteria

Edit filter files in `criteria/`:
- `ignore-list-begins.csv` - Add URL prefix patterns (e.g., "test.", "dev.")
- `ignore-list-contains.csv` - Add substring patterns (e.g., "staging")
- `ignore-except.csv` - Add exceptions to filter rules
- `suspected-dead-sites.csv` - Add sites that consistently fail DNS

Then rebuild and check `Filtered` column in output.

### Validating Output Format

Check that output matches Site Scanning Engine expectations:

```bash
head -1 data/site-scanning-target-url-list.csv
```

Should show columns:
- Target URL
- Target URL Branch
- Agency
- Bureau
- Agency Code
- Bureau Code
- base_domain
- tld
- Filtered
- DAP_pageviews
- DAP_visits
- source_list_* (multiple boolean columns)

## Git Workflow

### Committing Changes

The GitHub Actions workflow auto-commits build results. For manual commits:

```bash
git add data/
git commit -m "Build target url list"
git push
```

**Note:** Don't commit local development changes to data files unless intentional.

### Working on Features

```bash
git checkout -b feature/my-feature
# Make changes
cd builder
bun src/main.ts
# Test locally, review output
git add <changed-files>
git commit -m "Description of changes"
git push origin feature/my-feature
```

## Before Committing Code Changes

1. Test the build runs successfully: `cd builder && bun src/main.ts`
2. Verify output CSV is valid: `head data/site-scanning-target-url-list.csv`
3. Check analysis report for unexpected changes: `cat data/site-scanning-target-url-list-analysis.csv`
4. Review snapshots if you modified pipeline logic

## Troubleshooting

### Build Fails to Start

- Verify Bun is installed: `bun --version`
- Check dependencies: `cd builder && bun install`
- Ensure you're in correct directory

### Source List Fetch Fails

- Check network connectivity
- Verify source URL is still valid in `builder/src/config/source-list.config.ts`
- Look for HTTP errors in console output
- Builder continues with available sources

### Output CSV Missing Columns

- Check that column names in `builder/src/utils/utilities.ts` match expected output
- Review `fullColumnNameList` constant
- Verify reordering logic in pipeline

### Suspected Dead Sites Not Filtering

- Ensure URL format in `criteria/suspected-dead-sites.csv` matches normalized format
- URLs should have no protocol, no www prefix, no paths
- Check `after-dead-sites-filter-removed.csv` to see what was removed

## Understanding the Data Flow

```
Source Lists (30+)
    ↓ fetch and normalize
Source Snapshots
    ↓ union
Combined List
    ↓ deduplicate
Unique URLs
    ↓ extract domains
URLs with base_domain/tld
    ↓ merge agency info
URLs with agency/bureau
    ↓ merge OMB overrides
URLs with accurate agency
    ↓ tag ignore patterns
URLs with Filtered flag
    ↓ filter to federal domains
Federal URLs only
    ↓ merge DAP analytics
URLs with pageviews/visits
    ↓ remove dead sites
Active URLs only
    ↓ reorder and sort
Final Target URL List
```

Each arrow represents a snapshot in `data/process-snapshots/`.
