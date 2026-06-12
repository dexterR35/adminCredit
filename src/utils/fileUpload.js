/** Client document upload rules — validated client-side; storage bucket enforces server-side. */

export const CLIENT_ATTACHMENT_MAX_BYTES = 20 * 1024 * 1024;

const ALLOWED_EXTENSIONS = new Set(["webp", "png", "jpg", "jpeg", "pdf", "docx"]);

const EXTENSION_MIME = {
  webp: ["image/webp"],
  png: ["image/png"],
  jpg: ["image/jpeg", "image/jpg"],
  jpeg: ["image/jpeg", "image/jpg"],
  pdf: ["application/pdf"],
  docx: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
};

const DANGEROUS_FILENAME_CHARS = new Set(['\\', '/', '<', '>', ':', '"', '|', '?', '*']);

const hasDangerousFileNameChar = (value) => {
  for (const char of value) {
    if (DANGEROUS_FILENAME_CHARS.has(char) || char.charCodeAt(0) === 0) {
      return true;
    }
  }
  return false;
};

const readFileHeader = (file, length = 12) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(new Uint8Array(reader.result));
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsArrayBuffer(file.slice(0, length));
  });

const bytesMatch = (bytes, signature, offset = 0) =>
  signature.every((value, index) => bytes[offset + index] === value);

const matchesMagicBytes = (bytes, extension) => {
  switch (extension) {
    case "pdf":
      return bytesMatch(bytes, [0x25, 0x50, 0x44, 0x46]);
    case "png":
      return bytesMatch(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    case "jpg":
    case "jpeg":
      return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    case "webp":
      return (
        bytesMatch(bytes, [0x52, 0x49, 0x46, 0x46]) &&
        bytesMatch(bytes, [0x57, 0x45, 0x42, 0x50], 8)
      );
    case "docx":
      return bytesMatch(bytes, [0x50, 0x4b, 0x03, 0x04]);
    default:
      return false;
  }
};

export const getClientAttachmentExtension = (filename) => {
  if (typeof filename !== "string" || !filename.trim()) return null;

  const baseName = filename.split(/[/\\]/).pop()?.trim() || "";
  if (!baseName || hasDangerousFileNameChar(baseName)) return null;

  const parts = baseName.toLowerCase().split(".");
  if (parts.length < 2) return null;

  const extension = parts.pop();
  if (!extension || !ALLOWED_EXTENSIONS.has(extension)) return null;
  if (parts.some((part) => !part)) return null;

  return extension;
};

export const formatFileSize = (bytes) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const CLIENT_ATTACHMENT_ACCEPT =
  ".webp,.png,.jpg,.jpeg,.pdf,.docx,image/webp,image/png,image/jpeg,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export const CLIENT_ATTACHMENT_HELP_TEXT =
  "Allowed: WEBP, PNG, JPG, PDF, DOCX. Max size 20 MB per file.";

/**
 * @param {File} file
 * @returns {Promise<{ extension: string, mimeType: string }>}
 */
export const validateClientAttachmentFile = async (file) => {
  if (!(file instanceof File)) {
    throw new Error("Invalid file.");
  }

  if (!file.size) {
    throw new Error("The file is empty.");
  }

  if (file.size > CLIENT_ATTACHMENT_MAX_BYTES) {
    throw new Error("File exceeds the 20 MB limit.");
  }

  const extension = getClientAttachmentExtension(file.name);
  if (!extension) {
    throw new Error("Only WEBP, PNG, JPG, PDF, and DOCX files are allowed.");
  }

  const allowedMimeTypes = EXTENSION_MIME[extension];
  const reportedMime = (file.type || "").toLowerCase();
  if (reportedMime && !allowedMimeTypes.includes(reportedMime)) {
    throw new Error("File type does not match the selected extension.");
  }

  const bytes = await readFileHeader(file);
  if (!matchesMagicBytes(bytes, extension)) {
    throw new Error("File content does not match the allowed document type.");
  }

  return {
    extension,
    mimeType: reportedMime || allowedMimeTypes[0],
  };
};
