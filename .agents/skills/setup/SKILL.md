---
name: setup
description: First-time development environment setup for Federal Website Index
trigger: Use when user wants to set up the project for the first time, install dependencies, or verify their development environment
---

# Setup Skill

Guide user through initial development setup of the Federal Website Index.

## Prerequisites Check

First verify prerequisites are installed:
- [Bun](https://bun.sh/) runtime (for TypeScript builder)
- Python 3.x (for DAP data processor)
- Git (for version control and committing results)

## Setup Steps

### 1. Install Bun Runtime

If not already installed:
```bash
curl -fsSL https://bun.sh/install | bash
```

Then follow the instructions to add Bun to your shell profile and restart your terminal.

### 2. Install TypeScript Dependencies

```bash
cd builder
bun install
```

This installs:
- `dataframe-js` - DataFrame library for data manipulation
- `objects-to-csv` - CSV export utility
- TypeScript and type definitions

### 3. Install Python Dependencies (Optional)

Only needed if you plan to run the DAP data processor:

```bash
cd dapDataCollapse
pip install -r requirements.txt
```

This installs:
- `pandas` - DataFrame library for Python

### 4. Verify Setup

Run the builder to ensure everything works:

```bash
cd builder
bun src/main.ts
```

This will:
1. Fetch ~30 source lists from various URLs
2. Process and combine them through the pipeline
3. Write snapshots to `data/` directory
4. Generate final `data/site-scanning-target-url-list.csv`

**Note:** Full run takes 5-10 minutes depending on network speed.

## What Gets Created

After running the builder, you'll see:
- `data/source-list-snapshots/` - Individual source list snapshots
- `data/process-snapshots/` - Intermediate processing steps
- `data/site-scanning-target-url-list.csv` - Final output
- `data/site-scanning-target-url-list-analysis.csv` - Summary statistics

## Verification

Check that the final CSV was created:
```bash
wc -l data/site-scanning-target-url-list.csv
```

Should show ~20,000-30,000 lines (varies based on current federal website count).

## Common Issues

### Bun Installation Fails
- Ensure you have curl installed
- Check that your shell profile was updated (restart terminal)
- Verify with: `bun --version`

### Source List Fetch Failures
- Check internet connection
- Some source URLs may be temporarily unavailable
- Builder continues with available sources and logs warnings

### TypeScript Errors
- Ensure you're using Bun (not Node.js) to run the builder
- Re-run `bun install` to ensure dependencies are current

## Next Steps

After setup:
1. Review output CSV: `data/site-scanning-target-url-list.csv`
2. Check analysis report: `data/site-scanning-target-url-list-analysis.csv`
3. Explore process snapshots to understand pipeline steps
4. Use `/dev-workflow` skill for common development commands
