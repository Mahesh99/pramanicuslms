import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { bulkResultsToCsv, parseBulkEmails } from "./bulk-register.ts";

describe("parseBulkEmails", () => {
  it("parses one email per line, trims, lowercases, and drops blanks", () => {
    const parsed = parseBulkEmails("  Alex@School.edu  \n\nsecond@x.com\n");
    assert.deepEqual(parsed.emails, ["alex@school.edu", "second@x.com"]);
    assert.deepEqual(parsed.invalid, []);
  });

  it("dedupes repeated emails and records invalid lines separately", () => {
    const parsed = parseBulkEmails("a@x.com\nnot-an-email\na@x.com\nb@x.com");
    assert.deepEqual(parsed.emails, ["a@x.com", "b@x.com"]);
    assert.deepEqual(parsed.invalid, ["not-an-email"]);
  });

  it("rejects a list over the max size", () => {
    const lines = Array.from({ length: 101 }, (_, i) => `s${i}@x.com`).join("\n");
    const parsed = parseBulkEmails(lines);
    assert.equal(parsed.error, "Paste at most 100 email addresses.");
    assert.equal(parsed.emails.length, 0);
  });
});

describe("bulkResultsToCsv", () => {
  it("writes email, status, and password columns with CSV escaping", () => {
    const csv = bulkResultsToCsv([
      { email: "new@x.com", status: "created", password: 'ab,c"d' },
      { email: "old@x.com", status: "enrolled" },
      { email: "bad", status: "invalid", error: "Not a valid email." },
    ]);
    assert.equal(
      csv,
      [
        "email,status,password,error",
        'new@x.com,created,"ab,c""d",',
        "old@x.com,enrolled,,",
        "bad,invalid,,Not a valid email.",
      ].join("\r\n"),
    );
  });
});
