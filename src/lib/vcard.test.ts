import { describe, expect, it } from "vitest";
import { buildVCard, escapeText, foldLine } from "./vcard";

const base = {
  name: "Muhammad Arslan",
  title: "Architect and Energy Consultant",
  company: "MARK Architects",
  phone: "+923449240884",
  email: "info.markarchitects@gmail.com",
  website: "https://example.com",
};

describe("escapeText", () => {
  it("escapes backslash, comma, semicolon and newlines", () => {
    expect(escapeText("a,b;c\\d\ne")).toBe("a\\,b\\;c\\\\d\\ne");
  });
});

describe("foldLine", () => {
  it("leaves short lines untouched", () => {
    expect(foldLine("FN:Short")).toBe("FN:Short");
  });

  it("folds long lines to at most 75 octets and round-trips", () => {
    const long = "NOTE:" + "x".repeat(200);
    const folded = foldLine(long);
    const physical = folded.split("\r\n");
    expect(physical.length).toBeGreaterThan(1);
    for (const line of physical) {
      expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
    }
    expect(folded.replace(/\r\n /g, "")).toBe(long);
  });

  it("never splits a multi-byte character", () => {
    const long = "NOTE:" + "é".repeat(100);
    const folded = foldLine(long);
    expect(folded.replace(/\r\n /g, "")).toBe(long);
  });
});

describe("buildVCard", () => {
  it("produces a valid, CRLF-terminated vCard 3.0", () => {
    const v = buildVCard(base);
    expect(v.startsWith("BEGIN:VCARD\r\nVERSION:3.0\r\n")).toBe(true);
    expect(v.endsWith("END:VCARD\r\n")).toBe(true);
    expect(v).toContain("N:Arslan;Muhammad;;;");
    expect(v).toContain("FN:Muhammad Arslan");
    expect(v).toContain("TEL;TYPE=CELL,VOICE:+923449240884");
    expect(v).not.toMatch(/[^\r]\n/); // no bare LF line endings
  });

  it("includes the secondary phone and address only when provided", () => {
    expect(buildVCard(base)).not.toContain("ADR;");
    const v = buildVCard({
      ...base,
      secondaryPhone: "+923130003322",
      address: { street: "1 Main St, Unit 2", city: "Peshawar", country: "Pakistan" },
    });
    expect(v).toContain("TEL;TYPE=WORK,VOICE:+923130003322");
    expect(v).toContain("ADR;TYPE=WORK:;;1 Main St\\, Unit 2;Peshawar;;;Pakistan");
  });

  it("handles single-word names", () => {
    expect(buildVCard({ ...base, name: "Madonna" })).toContain("N:;Madonna;;;");
  });
});
