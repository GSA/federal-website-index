import { describe, test, expect } from "bun:test";
import DataFrame from "dataframe-js";
import {
  extractBaseDomainFromUrl,
  extractTLDFromUrl,
  removeWwwFromUrl,
  removeProtocolFromUrl,
  removePathFromUrl,
  urlToLowercase,
  cleanTargetUrls,
  startsWithCheck,
  urlContainsCheck,
  tagIgnoreListSites,
  ensureColumnNames,
  fullColumnNameList,
  unionSourceLists,
  mergeUrlInfo,
  mergeOmbIdeaInfo,
  mergeDapTopListDataframe,
  removeNonFederalSites,
  removeDeadSites,
  deduplicateSiteList,
  generateAnalysisEntry,
} from "./utilities";

describe("URL helper functions", () => {
  test("extractBaseDomainFromUrl", () => {
    expect(extractBaseDomainFromUrl("irs.gov")).toBe("irs.gov");
    expect(extractBaseDomainFromUrl("travel.state.gov")).toBe("state.gov");
    expect(extractBaseDomainFromUrl("my.sub.agency.gov")).toBe("agency.gov");
    expect(extractBaseDomainFromUrl("gov")).toBe("gov");
    expect(extractBaseDomainFromUrl("")).toBe("");
  });

  test("extractTLDFromUrl", () => {
    expect(extractTLDFromUrl("irs.gov")).toBe("gov");
    expect(extractTLDFromUrl("travel.state.gov")).toBe("gov");
    expect(extractTLDFromUrl("my.sub.agency.gov")).toBe("gov");
    expect(extractTLDFromUrl("gov")).toBe("gov");
    expect(extractTLDFromUrl("")).toBe("");
  });

  test("removeWwwFromUrl", () => {
    expect(removeWwwFromUrl("www.irs.gov")).toBe("irs.gov");
    expect(removeWwwFromUrl("irs.gov")).toBe("irs.gov");
    expect(removeWwwFromUrl("www.")).toBe("");
  });

  test("removeProtocolFromUrl", () => {
    expect(removeProtocolFromUrl("https://irs.gov")).toBe("irs.gov");
    expect(removeProtocolFromUrl("http://irs.gov")).toBe("irs.gov");
    expect(removeProtocolFromUrl("//irs.gov")).toBe("irs.gov");
    expect(removeProtocolFromUrl("irs.gov")).toBe("irs.gov");
  });

  test("removePathFromUrl", () => {
    expect(removePathFromUrl("irs.gov/forms")).toBe("irs.gov");
    expect(removePathFromUrl("irs.gov/forms/1040")).toBe("irs.gov");
    expect(removePathFromUrl("irs.gov")).toBe("irs.gov");
  });

  test("urlToLowercase", () => {
    expect(urlToLowercase("IRS.GOV")).toBe("irs.gov");
    expect(urlToLowercase("IrS.gOv")).toBe("irs.gov");
    expect(urlToLowercase("irs.gov")).toBe("irs.gov");
  });

  test("cleanTargetUrls applies all transformations", () => {
    const df = new DataFrame(
      [{ target_url: "HTTPS://WWW.IRS.GOV/forms " }],
      ["target_url"]
    );
    const cleaned = cleanTargetUrls(df);
    const result = cleaned.toArray()[0][0];
    expect(result).toBe("irs.gov");
  });
});

describe("Ignore list matchers", () => {
  test("startsWithCheck matches prefix", () => {
    const patterns = new Set(["admin.", "staging."]);
    expect(startsWithCheck("admin.foo.gov", patterns)).toBe(true);
    expect(startsWithCheck("staging.foo.gov", patterns)).toBe(true);
    expect(startsWithCheck("myadmin.foo.gov", patterns)).toBe(false);
    expect(startsWithCheck("foo.gov", patterns)).toBe(false);
  });

  test("urlContainsCheck requires delimiters on both sides", () => {
    const patterns = new Set(["dev", "test"]);
    // x.dev.gov has delimiter before 'dev' (the dot) and after (the dot)
    expect(urlContainsCheck("x.dev.gov", patterns)).toBe(true);
    // dev.gov has no delimiter BEFORE 'dev' (starts at position 0)
    expect(urlContainsCheck("dev.gov", patterns)).toBe(false);
    // mydev.gov has delimiter before 'dev' (the dot after 'mydev')
    // but 'dev' is not between non-word chars because 'y' is word char
    expect(urlContainsCheck("mydev.gov", patterns)).toBe(false);
    // foo.test.gov has delimiters on both sides
    expect(urlContainsCheck("foo.test.gov", patterns)).toBe(true);
  });

  test("tagIgnoreListSites sets filtered flag correctly", () => {
    const df = new DataFrame(
      [
        { target_url: "admin.foo.gov" },
        { target_url: "x.dev.gov" },
        { target_url: "safe.gov" },
        { target_url: "exception.gov" },
      ],
      ["target_url"]
    );

    const startsWithDf = new DataFrame(
      [{ "URL begins with:": "admin." }],
      ["URL begins with:"]
    );
    const containsDf = new DataFrame(
      [{ "URL contains between non-word characters:": "dev" }],
      ["URL contains between non-word characters:"]
    );
    const exceptionsDf = new DataFrame(
      [{ URL: "exception.gov" }],
      ["URL"]
    );

    const tagged = tagIgnoreListSites(df, containsDf, startsWithDf, exceptionsDf);
    const results = tagged.toArray();

    expect(results[0][1]).toBe(true); // admin.foo.gov - starts with match
    expect(results[1][1]).toBe(true); // x.dev.gov - contains match
    expect(results[2][1]).toBe(false); // safe.gov - no match
    expect(results[3][1]).toBe(false); // exception.gov - in exceptions list
  });
});

describe("Column plumbing functions", () => {
  test("ensureColumnNames adds missing columns", () => {
    const df1 = new DataFrame([{ a: "1", b: "2" }], ["a", "b"]);
    const df2 = new DataFrame([{ a: "3", c: "4" }], ["a", "c"]);
    const sourceLists = [df1, df2];
    const columnNames = ["a", "b", "c"];

    const result = ensureColumnNames(sourceLists, columnNames);

    expect(result[0].listColumns()).toEqual(["a", "b", "c"]);
    expect(result[1].listColumns()).toEqual(["a", "c", "b"]);
  });

  test("fullColumnNameList aggregates all column names", () => {
    const df1 = new DataFrame([{ a: "1", b: "2" }], ["a", "b"]);
    const df2 = new DataFrame([{ c: "3", d: "4" }], ["c", "d"]);
    const result = fullColumnNameList([df1, df2]);

    expect(result).toEqual(["a", "b", "c", "d"]);
  });

  test("unionSourceLists combines DataFrames", () => {
    const df1 = new DataFrame([{ url: "a.gov" }], ["url"]);
    const df2 = new DataFrame([{ url: "b.gov" }], ["url"]);
    const df3 = new DataFrame([{ url: "c.gov" }], ["url"]);

    const result = unionSourceLists([df1, df2, df3]);
    expect(result.count()).toBe(3);
  });
});

describe("Merge functions", () => {
  test("mergeUrlInfo enriches matching rows", () => {
    const allSites = new DataFrame(
      [
        { target_url: "foo.gov", base_domain: "foo.gov", agency: "", bureau: "", branch: "" },
        { target_url: "bar.gov", base_domain: "bar.gov", agency: "", bureau: "", branch: "" },
      ],
      ["target_url", "base_domain", "agency", "bureau", "branch"]
    );

    const sourceDf = new DataFrame(
      [
        { target_url: "foo.gov", agency: "Agency A", bureau: "Bureau A", branch: "Executive" },
      ],
      ["target_url", "agency", "bureau", "branch"]
    );

    const result = mergeUrlInfo(allSites, sourceDf);
    const rows = result.toArray();

    expect(rows[0][2]).toBe("Agency A"); // agency
    expect(rows[0][3]).toBe("Bureau A"); // bureau
    expect(rows[0][4]).toBe("Executive"); // branch
    expect(rows[1][2]).toBe(""); // bar.gov unchanged
  });

  test("mergeOmbIdeaInfo only enriches when source_list_omb_idea is true", () => {
    const allSites = new DataFrame(
      [
        { target_url: "foo.gov", source_list_omb_idea: true, agency: "", bureau: "" },
        { target_url: "bar.gov", source_list_omb_idea: false, agency: "", bureau: "" },
        { target_url: "baz.gov", source_list_omb_idea: true, agency: "", bureau: "" },
      ],
      ["target_url", "source_list_omb_idea", "agency", "bureau"]
    );

    const ombDf = new DataFrame(
      [
        { website: "foo.gov", agency: "OMB Agency A", bureau: "OMB Bureau A" },
        { website: "bar.gov", agency: "OMB Agency B", bureau: "OMB Bureau B" },
      ],
      ["website", "agency", "bureau"]
    );

    const result = mergeOmbIdeaInfo(allSites, ombDf);
    const rows = result.toArray();

    expect(rows[0][2]).toBe("OMB Agency A"); // foo.gov enriched
    expect(rows[0][3]).toBe("OMB Bureau A");
    expect(rows[1][2]).toBe(""); // bar.gov NOT enriched (flag is false)
    expect(rows[1][3]).toBe("");
    expect(rows[2][2]).toBe(""); // baz.gov not in OMB frame
  });

  test("mergeDapTopListDataframe adds pageviews and visits", () => {
    const allSites = new DataFrame(
      [
        { target_url: "foo.gov", pageviews: "", visits: "" },
        { target_url: "bar.gov", pageviews: "", visits: "" },
      ],
      ["target_url", "pageviews", "visits"]
    );

    const dapDf = new DataFrame(
      [{ hostname: "foo.gov", pageviews: "1000", visits: "500" }],
      ["hostname", "pageviews", "visits"]
    );

    const result = mergeDapTopListDataframe(allSites, dapDf);
    const rows = result.toArray();

    expect(rows[0][1]).toBe("1000"); // pageviews
    expect(rows[0][2]).toBe("500"); // visits
    expect(rows[1][1]).toBe(""); // bar.gov unchanged
  });
});

describe("Filter functions", () => {
  test("removeNonFederalSites partitions correctly", () => {
    const allSites = new DataFrame(
      [
        { target_url: "a.gov", base_domain: "a.gov" },
        { target_url: "b.mil", base_domain: "b.mil" },
        { target_url: "c.com", base_domain: "c.com" },
        { target_url: "d.gov", base_domain: "d.gov" },
      ],
      ["target_url", "base_domain"]
    );

    const govDomains = new DataFrame(
      [{ target_url: "a.gov" }, { target_url: "d.gov" }],
      ["target_url"]
    );
    const milDomains = new DataFrame([{ target_url: "b.mil" }], ["target_url"]);
    const nonDotGovMil = new DataFrame([{ target_url: "c.com" }], ["target_url"]);

    const { validSites, filteredOutSites } = removeNonFederalSites(
      allSites,
      milDomains,
      govDomains,
      nonDotGovMil
    );

    expect(validSites.count()).toBe(4);
    expect(filteredOutSites.count()).toBe(0);
    expect(validSites.count() + filteredOutSites.count()).toBe(allSites.count());

    // Check tag columns are dropped
    expect(validSites.listColumns()).not.toContain("is_gov");
    expect(validSites.listColumns()).not.toContain("is_mil");
    expect(validSites.listColumns()).not.toContain("is_other_federal");
  });

  test("removeDeadSites partitions correctly", () => {
    const allSites = new DataFrame(
      [
        { target_url: "alive.gov" },
        { target_url: "dead.gov" },
        { target_url: "another.gov" },
      ],
      ["target_url"]
    );

    const deadSites = new DataFrame(
      [{ initial_domain: "dead.gov" }],
      ["initial_domain"]
    );

    const { validSites, filteredOutSites } = removeDeadSites(allSites, deadSites);

    expect(validSites.count()).toBe(2);
    expect(filteredOutSites.count()).toBe(1);
    expect(validSites.count() + filteredOutSites.count()).toBe(allSites.count());

    // Check tag column is dropped
    expect(validSites.listColumns()).not.toContain("is_dead");
    expect(filteredOutSites.listColumns()).not.toContain("is_dead");
  });
});

describe("deduplicateSiteList - regression test for hyperlink bug", () => {
  test("preserves source_list_hyperlink_domains column with OR aggregation", () => {
    const allSites = new DataFrame(
      [
        {
          target_url: "foo.gov",
          branch: "Executive",
          agency: "Agency A",
          bureau: "Bureau A",
          base_domain_pulse: "",
          source_list_hyperlink_domains: "TRUE",
          source_list_federal_domains: "FALSE",
        },
        {
          target_url: "foo.gov",
          branch: "Executive",
          agency: "Agency A",
          bureau: "Bureau A",
          base_domain_pulse: "",
          source_list_hyperlink_domains: "FALSE",
          source_list_federal_domains: "TRUE",
        },
      ],
      [
        "target_url",
        "branch",
        "agency",
        "bureau",
        "base_domain_pulse",
        "source_list_hyperlink_domains",
        "source_list_federal_domains",
      ]
    );

    const result = deduplicateSiteList(allSites);

    // Should have exactly one row
    expect(result.count()).toBe(1);

    // The hyperlink_domains column must exist
    const columns = result.listColumns();
    expect(columns).toContain("source_list_hyperlink_domains");

    // The OR-aggregation should yield 'true'
    const row = result.toArray()[0];
    const hyperlinkIdx = columns.indexOf("source_list_hyperlink_domains");
    expect(row[hyperlinkIdx]).toBe("true");
  });
});

describe("generateAnalysisEntry", () => {
  test("creates correct structure", () => {
    const entry = generateAnalysisEntry("TestName", "test value", 42);
    expect(entry).toEqual({
      name: "TestName",
      value: "test value",
      count: 42,
    });
  });
});
