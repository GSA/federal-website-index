import { sourceListConfig } from "../../config/source-list.config";
import { SourceList } from "../../types/config";
import { AbstractSourceList } from "./AbstractSourceList";
import DataFrame from "dataframe-js";

export class OmbIdeaSourceList extends AbstractSourceList {
  /**
   * Provides the entry point for loading data from this source list.
   */
  static async loadData(): Promise<DataFrame> {
    const loader = new OmbIdeaSourceList();
    return loader.load();
  }

  /**
   * Injects the configuration for this source list into the parent.
   */
  constructor() {
    super(sourceListConfig[SourceList.OMB_IDEA]);
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
    data = data.rename("Website", "target_url");
    data = data.rename("Public-Facing", "omb_idea_public");

    // Map Yes/No to Boolean
    //@ts-ignore
    data = data.withColumn("omb_idea_public", (row) => {
      if (row.get("omb_idea_public") === "Yes") {
        return "TRUE";
      }
      if (row.get("omb_idea_public") === "No") {
        return "FALSE";
      }
      if (row.get("omb_idea_public") !== "No" && row.get("omb_idea_public") !== "Yes") {
        return "";
      }
    });

    return data;
  }

}
