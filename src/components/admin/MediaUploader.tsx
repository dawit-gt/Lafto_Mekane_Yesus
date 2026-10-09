"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { registerMedia } from "@/lib/actions/admin-media";
import { resizeImageToJpeg } from "@/lib/utils/image";

const MAX_PDF_BYTES = 5 * 1024 * 1024;

export function MediaUploader() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setDone("");

    const form = new FormData(e.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    const altText = String(form.get("altText") ?? "").trim();
    const file = form.get("file");

    if (!title) return setError("Please give the file a title.");
    if (!(file instanceof File) || file.size === 0) return setError("Please choose a file.");

    const isPdf = file.type === "application/pdf";
    const isImage = file.type.startsWith("image/");
    if (!isPdf && !isImage) return setError("Only images (JPG, PNG, WebP) and PDF files are allowed.");
    if (isPdf && file.size > MAX_PDF_BYTES) return setError("PDF files must be smaller than 5 MB.");
    if (isImage && !altText) {
      return setError("Please describe the image in a few words, for people who cannot see it.");
    }

    setBusy(true);
    try {
      const body: Blob = isPdf ? file : await resizeImageToJpeg(file, 1600, 0.85);
      const path = `${crypto.randomUUID()}.${isPdf ? "pdf" : "jpg"}`;

      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(path, body, { contentType: isPdf ? "application/pdf" : "image/jpeg" });
      if (uploadError) throw uploadError;

      const result = await registerMedia({ path, title, altText: isPdf ? "" : altText, size: body.size });
      if (!result.ok) {
        await supabase.storage.from("media").remove([path]);
        setError(result.message ?? "Could not save the file.");
        return;
      }

      formRef.current?.reset();
      setDone(`"${title}" was added.`);
      router.refresh();
    } catch (err) {
      console.error("media upload failed:", err);
      setError("Could not upload this file. Please try again or choose a different file.");
    } finally {
      setBusy(false);
    }
  }

  const inputClass =
    "w-full rounded-sm border border-line bg-paper-raised px-3 py-2.5 text-sm text-ink focus-visible:outline-none";

  return (
    <form ref={formRef} onSubmit={onSubmit} className="max-w-2xl space-y-4 rounded-sm border border-line bg-paper-raised p-5">
      <h2 className="font-serif text-lg font-semibold text-ink">Upload a file</h2>

      {error && (
        <p role="alert" className="rounded-sm border border-clay/30 bg-clay/10 px-3 py-2 text-sm text-clay">
          {error}
        </p>
      )}
      {done && (
        <p role="status" className="rounded-sm border border-forest/30 bg-forest/10 px-3 py-2 text-sm text-forest-deep">
          {done}
        </p>
      )}

      <div>
        <label htmlFor="media-title" className="block text-sm font-medium text-ink">
          Title <span className="text-clay">*</span>
        </label>
        <input id="media-title" name="title" type="text" maxLength={200} className={`${inputClass} mt-1.5`} />
      </div>

      <div>
        <label htmlFor="media-alt" className="block text-sm font-medium text-ink">
          Picture description
        </label>
        <p className="mt-0.5 text-xs text-ink/55">
          Required for pictures, e.g. &ldquo;Choir singing on Easter Sunday&rdquo;. Leave empty for PDFs.
        </p>
        <input id="media-alt" name="altText" type="text" maxLength={300} className={`${inputClass} mt-1.5`} />
      </div>

      <div>
        <label htmlFor="media-file" className="block text-sm font-medium text-ink">
          File <span className="text-clay">*</span>
        </label>
        <p className="mt-0.5 text-xs text-ink/55">
          Pictures are made smaller automatically. PDFs can be up to 5 MB.
        </p>
        <input
          id="media-file"
          name="file"
          type="file"
          accept="image/*,application/pdf"
          className="mt-1.5 block text-sm text-ink/80 file:mr-3 file:rounded-sm file:border file:border-line file:bg-paper file:px-3 file:py-1.5 file:text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={busy}
        className="inline-flex items-center justify-center rounded-sm bg-forest px-5 py-2.5 text-sm font-semibold text-paper-raised hover:bg-forest-deep disabled:opacity-60"
      >
        {busy ? "Uploading…" : "Upload"}
      </button>
    </form>
  );
}