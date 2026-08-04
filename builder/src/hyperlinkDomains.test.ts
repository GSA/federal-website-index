import { describe, test, expect } from "bun:test";
import {
  validateAndNormalizeDomain,
  extractDomainsFromCell,
} from "./hyperlinkDomainsBuilder";

describe("validateAndNormalizeDomain", () => {
  test("accepts and lowercases valid domains", () => {
    expect(validateAndNormalizeDomain("WWW.IRS.GOV")).toBe("www.irs.gov");
    expect(validateAndNormalizeDomain("travel.state.gov")).toBe("travel.state.gov");
    expect(validateAndNormalizeDomain("GSA.GOV")).toBe("gsa.gov");
  });

  test("rejects empty and whitespace-only input", () => {
    expect(validateAndNormalizeDomain("")).toBe(null);
    expect(validateAndNormalizeDomain("   ")).toBe(null);
    expect(validateAndNormalizeDomain("\t\n")).toBe(null);
  });

  test("rejects bare hostname without dot", () => {
    expect(validateAndNormalizeDomain("localhost")).toBe(null);
    expect(validateAndNormalizeDomain("server")).toBe(null);
  });

  test("rejects valid IPv4 addresses", () => {
    expect(validateAndNormalizeDomain("192.168.1.1")).toBe(null);
    expect(validateAndNormalizeDomain("10.0.0.1")).toBe(null);
    expect(validateAndNormalizeDomain("255.255.255.255")).toBe(null);
  });

  test("accepts out-of-range IPv4 as domain (octet validation fails)", () => {
    // 999 is not a valid octet, so this is NOT treated as IP
    expect(validateAndNormalizeDomain("999.1.1.1")).toBe("999.1.1.1");
    expect(validateAndNormalizeDomain("256.0.0.1")).toBe("256.0.0.1");
  });

  test("rejects IPv6 addresses", () => {
    expect(validateAndNormalizeDomain("[::1]")).toBe(null);
    expect(validateAndNormalizeDomain("[2001:db8::1]")).toBe(null);
  });
});

describe("extractDomainsFromCell", () => {
  test("parses JSON array and adds domains to set", () => {
    const domainSet = new Set<string>();
    const cellValue = '["irs.gov", "state.gov", "gsa.gov"]';

    const invalidCount = extractDomainsFromCell(cellValue, domainSet);

    expect(invalidCount).toBe(0);
    expect(domainSet.size).toBe(3);
    expect(domainSet.has("irs.gov")).toBe(true);
    expect(domainSet.has("state.gov")).toBe(true);
    expect(domainSet.has("gsa.gov")).toBe(true);
  });

  test("returns 0 and adds nothing for empty string", () => {
    const domainSet = new Set<string>();
    const invalidCount = extractDomainsFromCell("", domainSet);

    expect(invalidCount).toBe(0);
    expect(domainSet.size).toBe(0);
  });

  test("returns 0 and adds nothing for empty JSON array", () => {
    const domainSet = new Set<string>();
    const invalidCount = extractDomainsFromCell("[]", domainSet);

    expect(invalidCount).toBe(0);
    expect(domainSet.size).toBe(0);
  });

  test("returns 0 for non-array JSON (scalar)", () => {
    const domainSet = new Set<string>();
    const invalidCount = extractDomainsFromCell('"just-a-string"', domainSet);

    expect(invalidCount).toBe(0);
    expect(domainSet.size).toBe(0);
  });

  test("deduplicates across multiple calls sharing the same Set", () => {
    const domainSet = new Set<string>();

    extractDomainsFromCell('["irs.gov", "state.gov"]', domainSet);
    extractDomainsFromCell('["state.gov", "gsa.gov"]', domainSet);

    // state.gov appears twice but should only be in set once
    expect(domainSet.size).toBe(3);
    expect(domainSet.has("irs.gov")).toBe(true);
    expect(domainSet.has("state.gov")).toBe(true);
    expect(domainSet.has("gsa.gov")).toBe(true);
  });

  test("counts invalid domains (IPs and malformed) correctly", () => {
    const domainSet = new Set<string>();
    const cellValue = '["irs.gov", "192.168.1.1", "gsa.gov", "[::1]", ""]';

    const invalidCount = extractDomainsFromCell(cellValue, domainSet);

    expect(invalidCount).toBe(3); // IP, IPv6, and empty string
    expect(domainSet.size).toBe(2); // only irs.gov and gsa.gov
    expect(domainSet.has("irs.gov")).toBe(true);
    expect(domainSet.has("gsa.gov")).toBe(true);
  });

  test("handles malformed JSON without throwing", () => {
    const domainSet = new Set<string>();
    const cellValue = '{"not": "an array"}';

    // Should warn and return 0, not throw
    const invalidCount = extractDomainsFromCell(cellValue, domainSet);

    expect(invalidCount).toBe(0);
    expect(domainSet.size).toBe(0);
  });

  test("handles completely invalid JSON without throwing", () => {
    const domainSet = new Set<string>();
    const cellValue = 'this is not json at all';

    // Should warn and return 0, not throw
    const invalidCount = extractDomainsFromCell(cellValue, domainSet);

    expect(invalidCount).toBe(0);
    expect(domainSet.size).toBe(0);
  });
});
