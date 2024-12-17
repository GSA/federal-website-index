// Map, Set, Object, Arrays

const siteList = [
  { url: "www.google.com", b: 2 },
  { url: "abc123.google.com", b: 4 },
  { url: "yahoo.com", b: 6 }
];

function renameColumn( data, oldName, newName ) {
  return data.map( row => {
    const newRow = { ...row };
    newRow[newName] = newRow[oldName];
    delete newRow[oldName];
    return newRow;
  });
}

type ListMutationResult = {
  data: any[],
  removed: any[]
}

function removeUrlsWithPrefix( data, prefix ): ListMutationResult {
  const removed = [];
  const filtered = data.filter( row => {
    if (row.url.startsWith(prefix)) {
      removed.push(row);
      return false;
    }
    return true;
  });
  return { data: filtered, removed };
}

// does this URL start with x

async function loadSources() {
  const siteLists: SiteList[] = [];

  siteLists.push(
    await GovSiteList.fromCsvUrl('https://raw.githubusercontent.com/cisagov/dotgov-data/main/current-federal.csv')
  );

  return siteLists;
}

function mergeSiteLists( siteLists ) {
  return new SiteList( /*merged data goes here*/ );
}


class SiteList {
  protected static async loadCsvFromUrl( url ) {
    // download the csv
    //return SiteList.fromLocalCsv( downloadLocation );
  }
  protected static async loadCsvFromFile( path ) {

  }

  private _data: any[];

  constructor( data: any[] ) {
    this._data = data;
    this.initData();
    this.applyStandardTransformations();
  }

  get data() {
    return this._data;
  }

  protected applyStandardTransformations() {
    this.makeColumnDataLowercase( 'target_url' );
  }

  // stub
  protected initData() {
    // do nothing
  }

  protected makeColumnDataLowercase( columnName ) {
    this._data = this._data.map( row => {
      const newRow = { ...row };
      newRow[columnName] = newRow[columnName].toLowerCase();
      return newRow;
    });
  }

  renameColumn( oldName, newName ) {
    this._data = renameColumn( this._data, oldName, newName );
  }

  removeUrlsWithPrefix( prefix ) {
    const result = removeUrlsWithPrefix( this._data, prefix );
    this._data = result.data;
    return result.removed;
  }

  sortAlphabetically() {
    this._data.sort( (a, b) => a.url.localeCompare(b.url) );
  }

}

class GovSiteList extends SiteList {
  public static async fromCsvUrl( url ) {
    const data = await this.loadCsvFromUrl( url );
    return new GovSiteList( data );
  }

  protected initData() {
    this.deleteColumns( ['City', 'State', 'Security contact email'] );

    /*
    # drop unnecessary columns
    df = df.drop(columns=['City', 'State', 'Security contact email'])
    # rename columns
    df = df.rename(columns={'Domain name': 'target_url', 'Domain type': 'branch', 'Agency': 'agency', 'Organization name': 'bureau'})
    # convert to lowercase
    df['target_url'] = df['target_url'].str.lower()
    # remove duplicates
    df = df.drop_duplicates(subset='target_url')
    # set base domain
    df['base_domain_gov'] = df['target_url']
    # set source column
    df['source_list_federal_domains'] = 'TRUE'
    # strip out 'Federal - ' leading string from domain type column for .gov data
    df['branch'] = df['branch'].map(lambda x: x.lstrip('Federal - '))

    # add www. to .gov URLs
    www_gov_df = df.copy()
    www_gov_df['target_url'] = 'www.' + www_gov_df['target_url'].astype(str)
    df = pd.concat([df, www_gov_df])
    return df
     */

  }

  public toNormalized(): SiteData[] {
    return this._data.map( row => {
      return {
        targetUrl: row.target_url
      };
    });
  }

  // public mergeWith( other: SiteList ) {
  //
  // }

}


/*
  {
    name: 'gov',
    source: 'https://raw.githubusercontent.com/cisagov/dotgov-data/main/current-federal.csv',
    snapshotPath: path.join(__dirname, '../../data/snapshots/gov.csv'),
    droppedColumns: ['City', 'State', 'Security contact email'],
    renamedColumns: {'Domain name': 'target_url', 'Domain type': 'branch', 'Agency': 'agency', 'Organization name': 'bureau'},
    sourceListName: 'source_list_federal_domains',
    analysis: 'gov url list length',
  },

 */


// type SiteData = {
//   targetUrl: string;
// }
//
// type DotGovSiteData = {
//   domainName: string;
//   domainType: string;
//   agency: string;
// }




/*
Domain name,Domain type,Agency,Organization name,City,State,Security contact email
acus.gov,Federal - Executive,Administrative Conference of the United States,Administrative Conference of the United States,Washington,DC,info@acus.gov
achp.gov,Federal - Executive,Advisory Council on Historic Preservation,Advisory Council on Historic Preservation,Washington,DC,domainsecurity@achp.gov
preserveamerica.gov,Federal - Executive,Advisory Council on Historic Preservation,Advisory Council on Historic Preservation,Washington,DC,domainsecurity@achp.gov
abmc.gov,Federal - Executive,American Battle Monuments Commission,American Battle Monuments Commission,Arlington,VA,itsec@abmc.gov
amtrakoig.gov,Federal - Executive,AMTRAK,Office of Inspector General,Washington,DC,(blank)
 */