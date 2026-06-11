---
name: add-source
description: Step-by-step guide for adding a new data source to the Federal Website Index
trigger: Use when user wants to add a new source list, integrate a new dataset, or expand coverage with additional data sources
---

# Add Source Skill

Guide for adding a new data source to the Federal Website Index.

## When to Add a Source

Add a new source list when:
- You discover a dataset containing federal government URLs
- You want to improve coverage of a specific agency or domain type
- You have a curated list of sites that should be included

## Source List Requirements

A valid source must:
- Contain URLs or domains of federal websites
- Be accessible via HTTP/HTTPS URL or local file path
- Be in CSV format (or convertible to CSV)
- Be relatively stable/reliable (not frequently offline)

## Step-by-Step Process

### 1. Add Source Enum

Edit `builder/src/types/config.ts`:

```typescript
export enum SourceList {
  // ... existing entries ...
  MY_NEW_SOURCE = "MY_NEW_SOURCE",
}
```

Use SCREAMING_SNAKE_CASE for the enum name.

### 2. Add Source Configuration

Edit `builder/src/config/source-list.config.ts`:

```typescript
export const sourceListConfig: SourceListConfigMap = {
  // ... existing entries ...
  [SourceList.MY_NEW_SOURCE]: {
    shortName: "my_source",           // Used for snapshot filename
    sourceUrl: "https://example.gov/data.csv",  // Or local path
    sourceColumnName: "source_list_my_source",  // Column in final output
    hasHeaders: true,                 // Does CSV have header row?
  },
};
```

**Notes:**
- `shortName`: lowercase, underscores, no spaces
- `sourceColumnName`: prefix with `source_list_` for consistency
- `sourceUrl`: Can be HTTP URL or local path using `path.join(__dirname, '...')`
- `hasHeaders`: Set to `false` if CSV has no header row

### 3. Create Source List Class

Create `builder/src/services/source-lists/MyNewSourceList.ts`:

```typescript
import { DataFrame } from "dataframe-js";
import { sourceListConfig } from "../../config/source-list.config";
import { SourceList } from "../../types/config";

export class MyNewSourceList {
  static async loadData(): Promise<DataFrame> {
    const config = sourceListConfig[SourceList.MY_NEW_SOURCE];
    
    // Load CSV from URL or file
    const df = await DataFrame.fromCSV(config.sourceUrl);
    
    // Transform to standard format with 'initial_url' column
    // Example: if source has 'domain' column, rename it
    let processedDf = df.select("domain").rename("domain", "initial_url");
    
    // Add source tracking column
    processedDf = processedDf.withColumn(
      config.sourceColumnName,
      () => "TRUE"
    );
    
    // Clean URLs (remove protocols, www., paths)
    processedDf = processedDf.withColumn("initial_url", (row) => {
      let url = row.get("initial_url");
      url = url.replace(/^https?:\/\//, "");  // Remove protocol
      url = url.replace(/^www\./, "");        // Remove www.
      url = url.split("/")[0];                // Remove paths
      return url;
    });
    
    // Write snapshot for debugging
    const snapshotPath = path.join(
      __dirname,
      `../../../data/source-list-snapshots/${config.shortName}.csv`
    );
    await processedDf.toCSV(true, snapshotPath);
    
    return processedDf;
  }
}
```

**Key patterns:**
- Must have `static async loadData()` method returning `Promise<DataFrame>`
- Must create `initial_url` column (normalized URL)
- Must add source tracking column (e.g., `source_list_my_source`)
- Must write snapshot to `data/source-list-snapshots/`
- URL cleaning should match existing patterns

### 4. Import and Register

Edit `builder/src/main.ts`:

Add import at top:
```typescript
import { MyNewSourceList } from './services/source-lists/MyNewSourceList';
```

Add to `fetchAllSourceListData()` function:
```typescript
async function fetchAllSourceListData(): Promise<DataFrame[]> {
  return Promise.all([
    // ... existing sources ...
    MyNewSourceList.loadData(),
    // [SOURCE-ADD-POINT]
    // Add new source list configuration here
  ]);
}
```

Add column default in `setSourceListColumnDefaults()`:
```typescript
function setSourceListColumnDefaults(allSites: DataFrame) {
  return allSites.replace("", "FALSE", [
    // ... existing columns ...
    sourceListConfig[SourceList.MY_NEW_SOURCE].sourceColumnName,
  ]);
}
```

### 5. Test the Integration

Run the builder:
```bash
cd builder
bun src/main.ts
```

Check outputs:
1. **Source snapshot**: `data/source-list-snapshots/my_source.csv`
   - Verify it has `initial_url` and `source_list_my_source` columns
   - Check URLs are properly normalized

2. **After union**: `data/process-snapshots/after-union.csv`
   - Verify your URLs appear in combined list
   - Check your source column exists

3. **Final output**: `data/site-scanning-target-url-list.csv`
   - Find entries where `source_list_my_source` = TRUE
   - Verify they made it through filters

4. **Analysis report**: `data/site-scanning-target-url-list-analysis.csv`
   - Check row counts to see impact of your source

## Common Issues

### URLs Not Appearing in Final Output

Possible reasons:
1. **Filtered as non-public**: Check if URLs match patterns in `criteria/ignore-list-*.csv`
2. **Not federal domains**: URLs must have base domain in federal .gov registry
3. **Marked as dead**: Check if URLs are in `criteria/suspected-dead-sites.csv`
4. **Duplicate URLs**: May be deduplicated if already in another source

Check `data/process-snapshots/after-dead-sites-filter-removed.csv` to see what was removed.

### Source Fetch Fails

- Verify URL is accessible: `curl <url>`
- Check CSV format is valid
- For local files, verify path is correct
- Add error handling if source is unreliable

### Column Name Conflicts

- Ensure `sourceColumnName` is unique
- Follow naming convention: `source_list_<name>`
- Check no other source uses same name

## Source List Patterns

### Remote CSV
```typescript
sourceUrl: "https://example.gov/data.csv"
```

### Local CSV
```typescript
sourceUrl: path.join(__dirname, "../../../data/source-lists/my-data.csv")
```

### CSV Without Headers
```typescript
hasHeaders: false
```

Then in class, manually add column names:
```typescript
let df = await DataFrame.fromCSV(config.sourceUrl, false);
df = df.rename("0", "initial_url");  // Rename first column
```

## Testing Best Practices

1. **Start with small source**: Test with 10-100 URLs first
2. **Review snapshots**: Check each pipeline step
3. **Compare before/after**: Run analysis before and after adding source
4. **Check for duplicates**: See how many URLs are new vs. existing
5. **Validate federal domains**: Ensure URLs have valid federal base domains

## Documentation

After adding a source, update:
- `README.md` - Add to list of datasets
- `data/source-descriptions/` - Create markdown file describing the source
- Commit message should note source addition and expected impact
