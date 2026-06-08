import { supabase } from "../supabase/client";
import { sanitizeText } from "../utils/sanitize";
import { validateClientAttachmentFile } from "../utils/fileUpload";

const STORAGE_BUCKET = "creditimg";
const SIGNED_URL_TTL_SECONDS = 60 * 60;

const mapAttachmentRow = (row, url = "") => ({
  id: row.id,
  fisaReportId: row.fisa_report_id,
  originalName: row.original_name || "",
  storagePath: row.storage_path || "",
  contentType: row.content_type || "",
  fileSize: row.file_size ?? 0,
  uploadedBy: row.uploaded_by || null,
  createdAt: row.created_at,
  url,
});

const signAttachmentUrl = async (storagePath) => {
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(storagePath, SIGNED_URL_TTL_SECONDS);

  if (error) throw error;
  return data?.signedUrl || "";
};

export const fetchFisaReportAttachments = async (fisaReportId) => {
  const { data, error } = await supabase
    .from("fisa_report_attachments")
    .select("*")
    .eq("fisa_report_id", fisaReportId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const rows = await Promise.all(
    (data || []).map(async (row) => {
      try {
        const url = await signAttachmentUrl(row.storage_path);
        return mapAttachmentRow(row, url);
      } catch (signError) {
        console.error("Could not sign attachment URL:", signError);
        return mapAttachmentRow(row);
      }
    })
  );

  return rows;
};

export const uploadFisaReportAttachment = async (fisaReportId, file) => {
  const { extension, mimeType } = await validateClientAttachmentFile(file);
  const attachmentId = crypto.randomUUID();
  const storagePath = `fisa-docs/${fisaReportId}/${attachmentId}.${extension}`;
  const originalName = sanitizeText(file.name, { maxLength: 180, trim: true });

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, file, {
      contentType: mimeType,
      upsert: false,
      cacheControl: "3600",
    });

  if (uploadError) throw uploadError;

  const { data, error } = await supabase
    .from("fisa_report_attachments")
    .insert({
      id: attachmentId,
      fisa_report_id: fisaReportId,
      original_name: originalName,
      storage_path: storagePath,
      content_type: mimeType,
      file_size: file.size,
    })
    .select("*")
    .single();

  if (error) {
    await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);
    throw error;
  }

  const url = await signAttachmentUrl(storagePath);
  return mapAttachmentRow(data, url);
};

export const deleteFisaReportAttachment = async (attachment) => {
  if (!attachment?.id || !attachment?.storagePath) {
    throw new Error("Invalid attachment.");
  }

  const { error: storageError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([attachment.storagePath]);

  if (storageError) throw storageError;

  const { error } = await supabase
    .from("fisa_report_attachments")
    .delete()
    .eq("id", attachment.id);

  if (error) throw error;
};
