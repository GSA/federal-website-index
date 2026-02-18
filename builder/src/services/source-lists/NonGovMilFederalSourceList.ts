import { sourceListConfig } from "../../config/source-list.config";
import { SourceList } from "../../types/config";
import { AbstractSourceList } from "./AbstractSourceList";
import DataFrame from "dataframe-js";

export class NonGovMilFederalSourceList extends AbstractSourceList {
  /**
   * Provides the entry point for loading data from this source list.
   */
  static async loadData(): Promise<DataFrame> {
    const loader = new NonGovMilFederalSourceList();
    return loader.load();
  }

  /**
   * Injects the configuration for this source list into the parent.
   */
  constructor() {
    super(sourceListConfig[SourceList.NON_GOV_MIL_FEDERAL]);
  }

  /**
   * Performs the initial data mutations specific to this source list.
   *
   * @param data - The raw data received from the source.
   * @protected The updated data, with initial data mutations applied.
   */
  protected async prepare(data: DataFrame): Promise<DataFrame> {
    // Drop Unnecessary Columns
    data = data.drop("Agency");
    data = data.drop("Organization name");

    // Rename Columns for Standardization
    data = data.rename("Domain name", "target_url");
    data = data.rename("Domain type", "branch");

    console.log(data.listColumns());

    // Strip 'Federal - ' from the beginning of the branch names
    //@ts-ignore
    data = data.withColumn("branch", (row) => {
      const val = row.get("branch");
      return val ? val.replace(/^Federal - /, "") : val;
    });

    return data;
  }
}
