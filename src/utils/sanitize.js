/**
 * Input sanitization — trim, strip HTML/control chars, block XSS patterns.
 * Client-side only; always re-validate on the server for security-critical flows.
 */

const HTML_TAG_RE = /<[^>]*>/g;
const SCRIPT_BLOCK_RE = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
const SCRIPT_BLOCK_TEST_RE = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/i;

const isControlChar = (char) => {
  const code = char.charCodeAt(0);
  return (code >= 0 && code <= 31) || (code >= 127 && code <= 159);
};

const DANGEROUS_PATTERNS = [
  /javascript:/i,
  /vbscript:/i,
  /data:text\/html/i,
  /on\w+\s*=/i,
  /<\s*iframe/i,
  /<\s*object/i,
  /<\s*embed/i,
];

export const MAX_LENGTHS = {
  default: 500,
  email: 254,
  phone: 30,
  name: 120,
  username: 60,
  search: 100,
  textarea: 2000,
  cnp: 13,
  password: 128,
  url: 500,
};

/** Max serialized JSON size for fisa/contract form_data payloads */
export const MAX_FORM_DATA_BYTES = 100_000;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function stripHtml(value) {
  if (typeof value !== "string") return value;
  return value.replace(SCRIPT_BLOCK_RE, "").replace(HTML_TAG_RE, "");
}

export function stripControlChars(value) {
  if (typeof value !== "string") return value;
  return Array.from(value).filter((char) => !isControlChar(char)).join("");
}

export function trimValue(value) {
  if (typeof value !== "string") return value;
  return value.trim();
}

export function containsDangerousContent(value) {
  if (typeof value !== "string" || !value) return false;
  if (SCRIPT_BLOCK_TEST_RE.test(value)) return true;
  return DANGEROUS_PATTERNS.some((pattern) => pattern.test(value));
}

export function sanitizeText(value, { maxLength = MAX_LENGTHS.default, trim = true } = {}) {
  if (value === null || value === undefined) return "";

  let result = String(value);
  result = stripHtml(result);
  result = stripControlChars(result);
  if (trim) result = result.trim();
  if (maxLength > 0 && result.length > maxLength) {
    result = result.slice(0, maxLength);
  }

  return result;
}

export function sanitizeEmail(value) {
  const cleaned = sanitizeText(value, { maxLength: MAX_LENGTHS.email, trim: true }).toLowerCase();
  return cleaned.replace(/[^\w.@+-]/g, "");
}

export function sanitizePhone(value) {
  const cleaned = sanitizeText(value, { maxLength: MAX_LENGTHS.phone, trim: true });
  return cleaned.replace(/[^\d\s/+\-()]/g, "");
}

export function sanitizePassword(value) {
  if (typeof value !== "string") return "";
  return stripControlChars(value);
}

export function sanitizeSearch(value) {
  return sanitizeText(value, { maxLength: MAX_LENGTHS.search, trim: true });
}

export function sanitizeCnp(value) {
  return sanitizeText(value, { maxLength: MAX_LENGTHS.cnp, trim: true }).replace(/\D/g, "");
}

export function sanitizeUsername(value) {
  const cleaned = sanitizeText(value, { maxLength: MAX_LENGTHS.username, trim: true });
  return cleaned.replace(/[^\w.-]/g, "");
}

export function sanitizeByInputType(value, type = "text", options = {}) {
  const { trim = false } = options;

  switch (type) {
    case "email":
      return trim ? sanitizeEmail(value) : sanitizeEmail(value).replace(/\s/g, "");
    case "tel":
    case "phone":
      return sanitizePhone(value);
    case "password":
      return trim ? sanitizePassword(value) : stripControlChars(String(value ?? ""));
    case "search":
      return sanitizeSearch(value);
    case "number":
      if (value === "" || value === null || value === undefined) return "";
      return String(value).replace(/[^\d.-]/g, "");
    case "integer":
      if (value === "" || value === null || value === undefined) return "";
      return String(value).replace(/\D/g, "");
    case "date":
      return sanitizeText(value, { maxLength: 10, trim });
    case "cnp":
      return sanitizeCnp(value);
    case "username":
      return sanitizeUsername(value);
    case "textarea":
      return sanitizeText(value, { maxLength: MAX_LENGTHS.textarea, trim });
    default:
      return sanitizeText(value, { maxLength: MAX_LENGTHS.default, trim });
  }
}

export function inferSanitizeType(fieldName = "", inputType = "text") {
  const name = fieldName.toLowerCase();

  if (inputType === "email" || name.includes("email")) return "email";
  if (inputType === "tel" || name.includes("phone")) return "phone";
  if (inputType === "password" || name.includes("password")) return "password";
  if (name.includes("cnp")) return "cnp";
  if (name === "username" || name.includes("username")) return "username";
  if (name.includes("creditvalue")) return "integer";
  if (inputType === "date") return "date";
  if (inputType === "number") return "number";
  if (inputType === "search") return "search";

  return "text";
}

export function sanitizeFormValues(values, fieldTypes = {}) {
  if (!values || typeof values !== "object") return values;

  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => {
      if (typeof value === "boolean" || value instanceof Date) {
        return [key, value];
      }

      if (typeof value === "number") {
        return [key, value];
      }

      if (Array.isArray(value)) {
        return [key, value.map((item) =>
          typeof item === "string"
            ? sanitizeByInputType(item, fieldTypes[key] || "text", { trim: true })
            : item
        )];
      }

      if (value && typeof value === "object") {
        return [key, sanitizeFormValues(value, fieldTypes)];
      }

      const sanitizeType = fieldTypes[key] || inferSanitizeType(key);
      return [key, sanitizeByInputType(value, sanitizeType, { trim: true })];
    })
  );
}

export function sanitizeDeepStrings(value, maxLength = MAX_LENGTHS.default) {
  if (value === null || value === undefined) return value;

  if (typeof value === "string") {
    return sanitizeText(value, { maxLength, trim: true });
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeDeepStrings(item, maxLength));
  }

  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => {
        const limit = key.toLowerCase().includes("email")
          ? MAX_LENGTHS.email
          : key.toLowerCase().includes("phone")
            ? MAX_LENGTHS.phone
            : key.toLowerCase().includes("cnp")
              ? MAX_LENGTHS.cnp
              : maxLength;

        return [key, sanitizeDeepStrings(item, limit)];
      })
    );
  }

  return value;
}

export function sanitizeUrl(value) {
  if (value === null || value === undefined || value === "") return null;

  const cleaned = sanitizeText(value, { maxLength: MAX_LENGTHS.url, trim: true });
  if (!cleaned || containsDangerousContent(cleaned)) return null;

  try {
    const url = new URL(cleaned);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.href;
  } catch {
    return null;
  }
}

/** Safe href for links; returns null when URL is invalid or unsafe */
export function sanitizeUrlForHref(value) {
  return sanitizeUrl(value);
}

export function isValidUuid(value) {
  return typeof value === "string" && UUID_RE.test(value);
}

export function assertFormDataSize(data) {
  const size = new Blob([JSON.stringify(data ?? {})]).size;
  if (size > MAX_FORM_DATA_BYTES) {
    throw new Error(
      `Form data is too large (${size} bytes). Maximum is ${MAX_FORM_DATA_BYTES} bytes.`
    );
  }
}

export function buildFieldTypeMap(fields = []) {
  return fields.reduce((map, field) => {
    if (field.name) {
      map[field.name] = inferSanitizeType(field.name, field.type || field.as || "text");
    }
    if (field.details?.name) {
      map[field.details.name] = inferSanitizeType(
        field.details.name,
        field.details.type || field.details.as || "text"
      );
    }
    return map;
  }, {});
}
