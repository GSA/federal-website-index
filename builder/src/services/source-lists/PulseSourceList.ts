import { sourceListConfig } from "../../config/source-list.config";
import { SourceList } from "../../types/config";
import { AbstractSourceList } from "./AbstractSourceList";
import DataFrame from "dataframe-js";

export class PulseSourceList extends AbstractSourceList {
  /**
   * Provides the entry point for loading data from this source list.
   */
  static async loadData(): Promise<DataFrame> {
    const loader = new PulseSourceList();
    return loader.load();
  }

  /**
   * Injects the configuration for this source list into the parent.
   */
  constructor() {
    super(sourceListConfig[SourceList.PULSE]);
  }

  /**
   * Performs the initial data mutations specific to this source list.
   *
   * @param data - The raw data received from the source.
   * @protected The updated data, with initial data mutations applied.
   */
  protected async prepare(data: DataFrame): Promise<DataFrame> {
    // Drop Unnecessary Columns
    data = data.drop("URL");
    data = data.drop("Agency");
    data = data.drop("Sources");
    data = data.drop("Compliant with M-15-13 and BOD 18-01");
    data = data.drop("Enforces HTTPS");
    data = data.drop("Strict Transport Security (HSTS)");
    data = data.drop("Free of RC4/3DES and SSLv2/SSLv3");
    data = data.drop("3DES");
    data = data.drop("RC4");
    data = data.drop("SSLv2");
    data = data.drop("SSLv3");
    data = data.drop("Preloaded");

    // Rename Columns for Standardization
    data = data.rename("Domain", "target_url");
    data = data.rename("Base Domain", "base_domain_pulse");

    return data;
  }

}
