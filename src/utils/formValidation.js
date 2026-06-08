import * as Yup from "yup";
import {
  sanitizeText,
  sanitizeEmail,
  sanitizeCnp,
  sanitizeUsername,
  sanitizePassword,
  containsDangerousContent,
  MAX_LENGTHS,
} from "./sanitize";
import {
  ROMANIAN_MOBILE_PHONE_MESSAGE,
  ROMANIAN_MOBILE_PHONE_PATTERN,
  normalizeRomanianMobilePhone,
} from "./phone";

const NO_XSS_MESSAGE = "Invalid or unsafe characters detected";

export const yupNoDangerousContent = () =>
  Yup.string().test("no-xss", NO_XSS_MESSAGE, (value) => !value || !containsDangerousContent(value));

export const yupSafeString = (maxLength = MAX_LENGTHS.default) =>
  Yup.string()
    .transform((value) => sanitizeText(value, { maxLength, trim: true }))
    .concat(yupNoDangerousContent());

export const yupSafeEmail = () =>
  Yup.string()
    .transform((value) => sanitizeEmail(value))
    .email("Invalid email address")
    .concat(yupNoDangerousContent());

export const yupSafePhone = () =>
  Yup.string()
    .transform((value) => normalizeRomanianMobilePhone(value))
    .test("romanian-mobile", ROMANIAN_MOBILE_PHONE_MESSAGE, (value) => (
      !value || ROMANIAN_MOBILE_PHONE_PATTERN.test(value)
    ))
    .concat(yupNoDangerousContent());

export const yupSafeCnp = () =>
  Yup.string()
    .transform((value) => sanitizeCnp(value))
    .matches(/^\d{13}$/, "CNP must be exactly 13 digits");

export const yupSafeUsername = () =>
  Yup.string()
    .transform((value) => sanitizeUsername(value))
    .min(2, "Username is too short")
    .concat(yupNoDangerousContent());

export const yupSafePassword = () =>
  Yup.string()
    .transform((value) => sanitizePassword(value))
    .min(6, "Password must be at least 6 characters");

export const buildStringValidator = (field) => {
  const name = field.name || "";
  const lower = name.toLowerCase();

  if (field.type === "email" || lower.includes("email")) {
    return field.required ? yupSafeEmail().required("This field is required") : yupSafeEmail().nullable();
  }

  if (field.type === "password" || lower.includes("password")) {
    return field.required ? yupSafePassword().required("This field is required") : yupSafePassword().nullable();
  }

  if (lower.includes("cnp")) {
    return field.required ? yupSafeCnp().required("This field is required") : yupSafeCnp().nullable();
  }

  if (lower.includes("phone")) {
    return field.required ? yupSafePhone().required("This field is required") : yupSafePhone().nullable();
  }

  if (lower.includes("username")) {
    return field.required ? yupSafeUsername().required("This field is required") : yupSafeUsername().nullable();
  }

  if (field.as === "textarea") {
    return field.required
      ? yupSafeString(MAX_LENGTHS.textarea).required("This field is required")
      : yupSafeString(MAX_LENGTHS.textarea).nullable();
  }

  return field.required
    ? yupSafeString(MAX_LENGTHS.default).required("This field is required")
    : yupSafeString(MAX_LENGTHS.default).nullable();
};

/** Shared Yup field schema for FormInput and fisa report stepper */
export const buildFieldSchema = (field) => {
  if (field.disabled) {
    return Yup.string();
  }

  if (field.as === "date") {
    return field.required
      ? Yup.date().nullable().required("This field is required")
      : Yup.date().nullable();
  }

  if (field.type === "number" || field.as === "number") {
    let schema = Yup.number().nullable().typeError("Must be a number only");

    if (field.integer) {
      schema = schema.integer("Must be a whole number");
    }

    if (field.min != null) {
      schema = schema.min(field.min, `Minimum value is ${field.min}`);
    }

    return field.required ? schema.required("This field is required") : schema;
  }

  return buildStringValidator(field);
};

export const buildValidationSchemaFromFields = (fields) =>
  Yup.object().shape(
    fields.reduce((schema, field) => {
      schema[field.name] = buildFieldSchema(field);
      return schema;
    }, {})
  );
