import { useCallback, useRef, useState } from "react";

const CLOUD_NAME = "dlqsbm1a2";
const UPLOAD_PRESET = "COSPAC";
const FOLDER = "samples/ecommerce";

export type CloudinaryUploadState = {
  uploading: boolean;
  progress: number;
  error: string | null;
  previewUrl: string | null;
  resultUrl: string | null;
};

export function useCloudinaryUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const previewRevoke = useRef<(() => void) | null>(null);

  const clearPreview = useCallback(() => {
    previewRevoke.current?.();
    previewRevoke.current = null;
    setPreviewUrl(null);
  }, []);

  const reset = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setError(null);
    clearPreview();
    setResultUrl(null);
  }, [clearPreview]);

  const setFilePreview = useCallback((file: File | null) => {
    clearPreview();
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    previewRevoke.current = () => URL.revokeObjectURL(url);
    setPreviewUrl(url);
  }, [clearPreview]);

  const upload = useCallback(async (file: File): Promise<string> => {
    setError(null);
    setResultUrl(null);
    setUploading(true);
    setProgress(0);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("upload_preset", UPLOAD_PRESET);
      body.append("folder", FOLDER);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body,
      });
      setProgress(100);
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        const msg = (errJson as { error?: { message?: string } })?.error?.message ?? res.statusText;
        throw new Error(msg || "Upload failed");
      }
      const data = (await res.json()) as { secure_url?: string };
      if (!data.secure_url) throw new Error("No URL returned");
      setResultUrl(data.secure_url);
      return data.secure_url;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Upload error";
      setError(message);
      throw e;
    } finally {
      setUploading(false);
    }
  }, []);

  const state: CloudinaryUploadState = {
    uploading,
    progress,
    error,
    previewUrl,
    resultUrl,
  };

  return { state, upload, reset, setFilePreview, clearPreview };
}
