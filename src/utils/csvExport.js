const escapeCsvCell = (value) => {
  const str = value == null ? "" : String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const buildCsv = (headers, rows) => {
  const lines = [headers.map(escapeCsvCell).join(",")];
  rows.forEach((row) => {
    lines.push(row.map(escapeCsvCell).join(","));
  });
  return lines.join("\r\n");
};

export const downloadCsv = (content, filename) => {
  const blob = new Blob(["\ufeff", content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const buildExportFilename = (baseName) => {
  const slug = String(baseName || "export")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const date = new Date().toISOString().slice(0, 10);
  return `${slug || "export"}-${date}.csv`;
};
