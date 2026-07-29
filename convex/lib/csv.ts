/** RFC 4180-style CSV cell escaping for export rows. */
export function escapeCsvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) {
    return "";
  }
  const text = String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function buildCsvRow(cells: Array<string | number | null | undefined>): string {
  return cells.map(escapeCsvCell).join(",");
}

export function buildCsv(headers: string[], rows: Array<Array<string | number | null | undefined>>) {
  const lines = [buildCsvRow(headers), ...rows.map((row) => buildCsvRow(row))];
  return lines.join("\n");
}
