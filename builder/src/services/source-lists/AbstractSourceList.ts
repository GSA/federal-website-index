import { SourceListConfig } from "../../types/config";
import DataFrame from "dataframe-js";

export abstract class AbstractSourceList {
  public readonly shortName: string;
  public readonly sourceColumnName: string;
  public readonly sourceUrl: string;

  protected constructor(config: SourceListConfig) {
    this.shortName = config.shortName;
    this.sourceColumnName = config.sourceColumnName;
    this.sourceUrl = config.sourceUrl;
  }

  protected async fetchData(): Promise<DataFrame> {
    return DataFrame.fromCSV(this.sourceUrl);
  }

  protected abstract prepare(data: DataFrame): Promise<DataFrame>;

  public async load(): Promise<DataFrame> {
    let data = await this.fetchData();

    // Prepare the data
    data = await this.prepare(data);

    // Add source list column
    data = this.addSourceListColumn(data);

    return data;
  }

  protected addSourceListColumn(data: DataFrame): DataFrame {
    return data.withColumn(this.sourceColumnName, () => "TRUE");
  }

}