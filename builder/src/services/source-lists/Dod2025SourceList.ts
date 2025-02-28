import ts from "typescript";
import { sourceListConfig } from "../../config/source-list.config";
import { SourceList } from "../../types/config";
import { AbstractSourceList } from "./AbstractSourceList";
import DataFrame from "dataframe-js";

export class Dod2025SourceList extends AbstractSourceList {
  /**
   * Provides the entry point for loading data from this source list.
   */
  static async loadData(): Promise<DataFrame> {
    const loader = new Dod2025SourceList();
    return loader.load();
  }

  /**
   * Injects the configuration for this source list into the parent.
   */
  constructor() {
    super(sourceListConfig[SourceList.DOD_2025]);
  }

  /**
   * Performs the initial data mutations specific to this source list.
   *
   * @param data - The raw data received from the source.
   * @protected The updated data, with initial data mutations applied.
   */
  protected async prepare(data: DataFrame): Promise<DataFrame> {
    // Rename Columns for Standardization
    data = data.rename("Website", "target_url");

    return data;
  }

}
