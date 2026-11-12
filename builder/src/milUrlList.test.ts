import { describe, test, expect } from "bun:test";
import DataFrame from "dataframe-js";
import {
  removeAllNonMilDomains,
  convertDomainToSecondLevelDomain,
} from "./milUrlListBuilder";

describe("mil url list builder", () => {
  test("keeps .mil hostnames whatever case the source list uses", () => {
    const df = new DataFrame(
      [
        { "Domain name": "www.SERDP-ESTCP.MIL" },
        { "Domain name": "WWW.NPC.NAVY.MIL" },
        { "Domain name": "myafn.dodlive.mil" },
        { "Domain name": "100fss.com" },
      ],
      ["Domain name"]
    );

    const kept = removeAllNonMilDomains(df).toArray().map(row => row[0]);

    expect(kept).toContain("www.serdp-estcp.mil");
    expect(kept).toContain("www.npc.navy.mil");
    expect(kept).toContain("myafn.dodlive.mil");
    expect(kept).not.toContain("100fss.com");
    expect(kept.length).toBe(3);
  });

  test("second level domains come out lowercase so the dedup can see them", () => {
    const df = new DataFrame(
      [
        { "Domain name": "www.SERDP-ESTCP.MIL" },
        { "Domain name": "OPA.NAVY.MIL" },
        { "Domain name": "cmp.ncdc.navy.mil" },
      ],
      ["Domain name"]
    );

    const domains = convertDomainToSecondLevelDomain(removeAllNonMilDomains(df));
    const deduped = domains.dropDuplicates("Domain name").toArray().map(row => row[0]);

    expect(deduped).toContain("serdp-estcp.mil");
    expect(deduped).toContain("navy.mil");
    expect(deduped.length).toBe(2);
  });
});
