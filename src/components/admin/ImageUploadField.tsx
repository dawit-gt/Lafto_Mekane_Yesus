"use client";

import { useState, type ChangeEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { registerMedia } from "@/lib/actions/admin-media";
import { resizeImageToJpeg } from "@/lib/utils/image";

/**
 * Picture upload for admin forms. The file is shrunk in the browser, uploaded
 * to the public Media library, and its link is sent with the form under `name`.
 */
export function ImageUploadField({
  label,
  name,
  defaultValue,
  errors,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  errors?: string[];
  hint?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onChange(e: ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;
    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (JPG, PNG or WebP).");
      input.value = "";
      return;
    }

    setBusy(true);
    try {
      const blob = await resizeImageToJpeg(file, 1600, 0.85);
      const path = `${crypto.randomUUID()}.jpg`;
      const supabase = createClient();

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(path, blob, { contentType: "image/jpeg" });
      if (uploadError) throw uploadError;

      const title = file.name.replace(/\.[^.]+$/, "").slice(0, 200) || "Uploaded picture";
      const result = await registerMedia({ path, title, altText: "", size: blob.size });
      if (!result.ok) {
        await supabase.storage.from("media").remove([path]);
        throw new Error(result.message ?? "Could not save the picture.");
      }

      setUrl(supabase.storage.from("media").getPublicUrl(path).data.publicUrl);
    } catch (err) {
      console.error("image upload failed:", err);
      setError("Could not upload this picture. Please try a different image.");
    } finally {
      setBusy(false);
      input.value = "";
    }
  }

  return (
    <div>
      <p className="block text-sm font-medium text-ink">{label}</p>
      {hint && <p className="mt-0.5 text-xs text-ink/55">{hint}</p>}

      <div className="mt-2 flex items-center gap-4">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="h-20 w-28 rounded-sm border border-line object-cover" />
        ) : (
          <div className="flex h-20 w-28 items-center justify-center rounded-sm border border-dashed border-line text-xs text-ink/50">
            No picture
          </div>
        )}
        <div className="space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={onChange}
            disabled={busy}
            aria-label={`Choose a picture for: ${label}`}
            className="block text-sm text-ink/80 file:mr-3 file:rounded-sm file:border file:border-line file:bg-paper-raised file:px-3 file:py-1.5 file:text-sm"
          />
          {url && (
            <button
              type="button"
              onClick={() => setUrl("")}
              className="text-sm font-medium text-clay underline underline-offset-4"
            >
              Remove picture
            </button>
          )}
          {busy && <p className="text-xs text-ink/60">Uploading…</p>}
          {error && <p className="text-xs text-clay">{error}</p>}
          {errors && errors.length > 0 && <p className="text-xs text-clay">{errors[0]}</p>}
        </div>
      </div>

      <input type="hidden" name={name} value={url} />
    </div>
  );
}