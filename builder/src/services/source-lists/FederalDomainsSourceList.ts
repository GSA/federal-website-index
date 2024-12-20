import { sourceListConfig } from "../../config/source-list.config";
import { SourceList } from "../../types/config";
import { AbstractSourceList } from "./AbstractSourceList";
import DataFrame from "dataframe-js";

export class FederalDomainsSourceList extends AbstractSourceList {
  /**
   * Provides the entry point for loading data from this source list.
   */
  static async loadData(): Promise<DataFrame> {
    const loader = new FederalDomainsSourceList();
    return loader.load();
  }

  /**
   * Injects the configuration for this source list into the parent.
   */
  constructor() {
    super(sourceListConfig[SourceList.FEDERAL_DOMAINS]);
  }

  /**
   * Performs the initial data mutations specific to this source list.
   *
   * @param data - The raw data received from the source.
   * @protected The updated data, with initial data mutations applied.
   */
  protected async prepare(data: DataFrame): Promise<DataFrame> {
    // Drop Unnecessary Columns
    data = data.drop("City");
    data = data.drop("State");
    data = data.drop("Security contact email");

    // Rename Columns for Standardization
    data = data.rename("Domain name", "target_url");
    data = data.rename("Domain type", "branch");
    data = data.rename("Agency", "agency");
    data = data.rename("Organization name", "bureau");

    // Strip 'Federal - ' from the beginning of the branch names
    //@ts-ignore
    data = data.withColumn("branch", (row) => {
      return row.get("branch").replace(/^Federal - /, "");
    });

    return data;
  }

}