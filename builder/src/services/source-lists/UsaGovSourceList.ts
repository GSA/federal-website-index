import { sourceListConfig } from "../../config/source-list.config";
import { SourceList } from "../../types/config";
import { AbstractSourceList } from "./AbstractSourceList";
import DataFrame from "dataframe-js";

export class UsaGovSourceList extends AbstractSourceList {
  /**
   * Provides the entry point for loading data from this source list.
   */
  static async loadData(): Promise<DataFrame> {
    const loader = new UsaGovSourceList();
    return loader.load();
  }

  /**
   * Injects the configuration for this source list into the parent.
   */
  constructor() {
    super(sourceListConfig[SourceList.USA_GOV]);
  }

  /**
   * Performs the initial data mutations specific to this source list.
   *
   * @param data - The raw data received from the source.
   * @protected The updated data, with initial data mutations applied.
   */
  protected async prepare(data: DataFrame): Promise<DataFrame> {
    // Drop Unnecessary Columns

    // Rename Columns for Standardization
    data = data.rename('0', 'target_url');

    return data;
  }

}
