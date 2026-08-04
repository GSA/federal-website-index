import { describe, test, expect } from "bun:test";
import DataFrame from "dataframe-js";
import { SourceList, SourceListConfigMap } from "../types/config";
import { sourceListConfig } from "./source-list.config";
import { deduplicateSiteList } from "../utils/utilities";

// Enum members that are loaded for lookups/merging only, not as source_list_* columns in the union
// MIL_DOMAINS is loaded directly in main.ts:227 for agency merging and does not produce a source_list column
const LOOKUP_ONLY_SOURCES = new Set([SourceList.MIL_DOMAINS]);

describe("Source list configuration contract", () => {
  test("every SourceList enum member has a complete config entry", () => {
    for (const key in SourceList) {
      const sourceKey = SourceList[key as keyof typeof SourceList];
      const config = sourceListConfig[sourceKey as keyof SourceListConfigMap];

      expect(config).toBeDefined();
      expect(config.shortName).toBeTruthy();
      if (!LOOKUP_ONLY_SOURCES.has(sourceKey)) {
        expect(config.sourceColumnName).toBeTruthy();
      }
      expect(config.sourceUrl).toBeTruthy();
      expect(typeof config.hasHeaders).toBe("boolean");
    }
  });

  test("every sourceColumnName is unique across the config", () => {
    const columnNames = new Set<string>();
    const duplicates: string[] = [];

    for (const key in SourceList) {
      const sourceKey = SourceList[key as keyof typeof SourceList];
      const config = sourceListConfig[sourceKey as keyof SourceListConfigMap];
      const colName = config.sourceColumnName;

      if (columnNames.has(colName)) {
        duplicates.push(colName);
      }
      columnNames.add(colName);
    }

    expect(duplicates).toEqual([]);
  });

  test("deduplicateSiteList preserves all configured source_list columns", () => {
    // Build a one-row DataFrame with target_url + all required columns for deduplicateSiteList
    // plus a TRUE column for every configured sourceColumnName
    const rowData: { [key: string]: string } = {
      target_url: "test.gov",
      branch: "Executive",
      agency: "Test Agency",
      bureau: "Test Bureau",
      base_domain_pulse: "",
    };

    // Add all source_list columns with TRUE
    const allSourceColumns: string[] = [];
    for (const key in SourceList) {
      const sourceKey = SourceList[key as keyof typeof SourceList];

      // Skip lookup-only sources that don't participate in the union
      if (LOOKUP_ONLY_SOURCES.has(sourceKey)) {
        continue;
      }

      const config = sourceListConfig[sourceKey as keyof SourceListConfigMap];
      const colName = config.sourceColumnName;
      rowData[colName] = "TRUE";
      allSourceColumns.push(colName);
    }

    const columns = Object.keys(rowData);
    const df = new DataFrame([rowData], columns);

    // Run deduplicateSiteList
    const result = deduplicateSiteList(df);
    const resultColumns = result.listColumns();

    // Every configured source_list column must be present in the output
    const missingColumns = allSourceColumns.filter(
      (col) => !resultColumns.includes(col)
    );

    if (missingColumns.length > 0) {
      console.error("Missing source_list columns after deduplication:", missingColumns);
      console.error("This indicates the sourceListColumns array in utilities.ts is out of sync with the config.");
    }

    expect(missingColumns).toEqual([]);
  });
});
