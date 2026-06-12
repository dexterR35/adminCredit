const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const formatFilenamePart = (value) =>
  String(value || "fisa-report")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "fisa-report";

export const downloadFisaReportFile = ({
  values = {},
  fields = [],
  filename,
} = {}) => {
  const rows = fields
    .filter((field) => field.name && field.name !== "user")
    .map((field) => {
      const rawValue = values[field.name];
      const selected = field.options?.find(
        (option) => String(option.value) === String(rawValue)
      );
      const value = selected?.label || rawValue || "";

      return `
        <tr>
          <th>${escapeHtml(field.label || field.name)}</th>
          <td>${escapeHtml(value || "-")}</td>
        </tr>
      `;
    })
    .join("");

  const title = values.clientFullName || values.client_full_name || "Fisa report";
  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #111827; margin: 32px; }
    h1 { font-size: 22px; margin: 0 0 6px; }
    p { color: #6b7280; margin: 0 0 24px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #d1d5db; padding: 8px 10px; text-align: left; vertical-align: top; }
    th { width: 32%; background: #f9fafb; font-weight: 700; }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <p>Generated ${escapeHtml(new Date().toLocaleString())}</p>
  <table>${rows}</table>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename || formatFilenamePart(title)}.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
