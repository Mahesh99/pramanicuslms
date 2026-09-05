export const MAX_BULK_EMAILS = 100;

export type BulkRowStatus = "created" | "enrolled" | "invalid" | "error";

export type BulkRegisterRow = {
  email: string;
  status: BulkRowStatus;
  password?: string;
  error?: string;
};

export type ParseBulkEmailsResult = {
  emails: string[];
  invalid: string[];
  error?: string;
};

function isValidEmail(value: string): boolean {
  return value.includes("@") && value.includes(".") && !value.includes(" ");
}

function csvEscape(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

export function parseBulkEmails(raw: string): ParseBulkEmailsResult {
  const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const emails: string[] = [];
  const seen = new Set<string>();
  const invalid: string[] = [];

  for (const line of lines) {
    const email = line.toLowerCase();
    if (!isValidEmail(email)) {
      invalid.push(line);
      continue;
    }
    if (seen.has(email)) continue;
    seen.add(email);
    emails.push(email);
  }

  if (emails.length > MAX_BULK_EMAILS) {
    return { emails: [], invalid: [], error: `Paste at most ${MAX_BULK_EMAILS} email addresses.` };
  }

  return { emails, invalid };
}

export function bulkResultsToCsv(rows: BulkRegisterRow[]): string {
  const header = "email,status,password,error";
  const body = rows.map((row) =>
    [row.email, row.status, row.password ?? "", row.error ?? ""].map(csvEscape).join(","),
  );
  return [header, ...body].join("\r\n");
}
