import ts from "typescript";
import { sourceListConfig } from "../../config/source-list.config";
import { SourceList } from "../../types/config";
import { AbstractSourceList } from "./AbstractSourceList";
import DataFrame from "dataframe-js";

export class CisaSourceList extends AbstractSourceList {
  /**
   * Provides the entry point for loading data from this source list.
   */
  static async loadData(): Promise<DataFrame> {
    const loader = new CisaSourceList();
    return loader.load();
  }

  /**
   * Injects the configuration for this source list into the parent.
   */
  constructor() {
    super(sourceListConfig[SourceList.CISA]);
  }

  /**
   * Performs the initial data mutations specific to this source list.
   *
   * @param data - The raw data received from the source.
   * @protected The updated data, with initial data mutations applied.
   */
  protected async prepare(data: DataFrame): Promise<DataFrame> {
    // Filter results to only include live=true
    //@ts-ignore
    data = data.filter(row => row.get("live") === "TRUE");

    // Drop Unnecessary Columns
    data = data.drop("base_domain");
    data = data.drop("agency.id");
    data = data.drop("agency.name");
    data = data.drop("canonical_url");
    data = data.drop("live");
    data = data.drop("redirect");
    data = data.drop("redirect_to");
    data = data.drop("downgrades_https");
    data = data.drop("https_bad_hostname");
    data = data.drop("https_expired_cert");
    data = data.drop("https_self_signed_cert");
    data = data.drop("hsts_base_domain_preloaded");
    data = data.drop("domain_enforces_https");
    data = data.drop("domain_uses_strong_hsts");
    data = data.drop("oscp_crl_domain");
    data = data.drop("unknown_error");
    data = data.drop("scan_date");


    // Rename Columns for Standardization
    data = data.rename("domain", "target_url");

    return data;
  }

}
