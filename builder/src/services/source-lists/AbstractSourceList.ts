import { SourceListConfig } from "../../types/config";
import DataFrame from "dataframe-js";
import path from 'path';
import { cleanTargetUrls } from "../../utils/utilities";

export abstract class AbstractSourceList {
  public readonly shortName: string;
  public readonly sourceColumnName: string;
  public readonly sourceUrl: string;
  public readonly hasHeaders: boolean;

  protected constructor(config: SourceListConfig) {
    this.shortName = config.shortName;
    this.sourceColumnName = config.sourceColumnName;
    this.sourceUrl = config.sourceUrl;
    this.hasHeaders = config.hasHeaders;
  }

  protected async fetchData(): Promise<DataFrame> {
    return DataFrame.fromCSV(this.sourceUrl, this.hasHeaders);
  }

  protected abstract prepare(data: DataFrame): Promise<DataFrame>;

  public async load(): Promise<DataFrame> {
    let data = await this.fetchData();

    // Prepare the data
    data = await this.prepare(data);

    // Add source list column
    data = this.addSourceListColumn(data);

    // Clean the target URLs removing the protocol, path, www., and converting to lowercase.
    if (data.listColumns().includes("target_url")) {
      data = cleanTargetUrls(data);
    }

    // Create a csv file of the loaded data in a testing folder.
    data.toCSV(true, path.join(__dirname, `../../testing/${this.shortName}.csv`));

    return data;
  }

  protected addSourceListColumn(data: DataFrame): DataFrame {
    return data.withColumn(this.sourceColumnName, () => "TRUE");
  }

}