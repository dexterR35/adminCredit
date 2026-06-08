const IMAGE_EXT_RE = /\.(png|jpe?g|webp)$/i;
const PDF_EXT_RE = /\.pdf$/i;

const isImageAttachment = (attachment) =>
  (attachment?.content_type || "").startsWith("image/") ||
  IMAGE_EXT_RE.test(attachment?.original_name || "");

const isPdfAttachment = (attachment) =>
  (attachment?.content_type || "") === "application/pdf" ||
  PDF_EXT_RE.test(attachment?.original_name || "");

export const buildLegacyFisaDocumentItems = (row = {}) => {
  const form = row.form_data || {};
  const items = [];

  const photoUrl = row.photo_url || form.photoUrl;
  if (photoUrl) {
    items.push({
      id: "legacy-photo",
      originalName: "Report photo",
      url: photoUrl,
      fileSize: null,
      isLegacy: true,
    });
  }

  const pdfUrl = row.pdf_url || form.pdfUrl;
  if (pdfUrl) {
    items.push({
      id: "legacy-pdf",
      originalName: "Report PDF",
      url: pdfUrl,
      fileSize: null,
      isLegacy: true,
    });
  }

  return items;
};

export const mergeFisaReportDocuments = (row = {}, attachments = []) => [
  ...buildLegacyFisaDocumentItems(row),
  ...attachments,
];

export const getFisaReportAttachmentMeta = (row = {}) => {
  const attachments = row.fisa_report_attachments || [];
  return {
    attachments,
    hasImage: Boolean(
      row.photo_url ||
        row.form_data?.photoUrl ||
        attachments.some(isImageAttachment)
    ),
    hasPdf: Boolean(
      row.pdf_url ||
        row.form_data?.pdfUrl ||
        attachments.some(isPdfAttachment)
    ),
    imageUrl: row.photo_url || row.form_data?.photoUrl || "",
    pdfUrl: row.pdf_url || row.form_data?.pdfUrl || "",
  };
};
