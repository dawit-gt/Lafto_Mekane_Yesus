import type { Metadata } from "next";
import { getAdminMedia } from "@/lib/data/admin-media";
import { deleteMedia } from "@/lib/actions/admin-media";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { CopyUrlButton } from "@/components/admin/CopyUrlButton";
import { MediaUploader } from "@/components/admin/MediaUploader";

export const metadata: Metadata = {
  title: "Media",
  robots: { index: false, follow: false },
};

function formatSize(bytes: number | null) {
  if (bytes == null) return "";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function AdminMediaPage() {
  const items = await getAdminMedia();

  return (
    <div>
      <h1 className="text-2xl font-bold text-forest">Media</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink/70">
        Upload pictures and PDFs here, then use <strong>Copy link</strong> and paste the link into
        a &ldquo;Photo URL&rdquo; or &ldquo;Image URL&rdquo; field on an event, sermon, ministry,
        story or leader. Everything in this library is public: anyone with the link can open it.
        Do not upload private documents or member photos here.
      </p>

      <div className="mt-6">
        <MediaUploader />
      </div>

      {items.length > 0 ? (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.id} className="overflow-hidden rounded-sm border border-line bg-paper-raised">
              {item.kind === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.url}
                  alt={item.alt_text ?? item.title}
                  loading="lazy"
                  className="h-40 w-full object-cover"
                />
              ) : (
                <div className="flex h-40 items-center justify-center bg-line/60 font-serif text-lg font-semibold text-ink/60">
                  PDF
                </div>
              )}
              <div className="space-y-2 p-4">
                <p className="font-medium text-ink">{item.title}</p>
                <p className="text-xs text-ink/55">
                  {item.kind === "image" ? "Picture" : "PDF"} · {formatSize(item.file_size_bytes)}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <CopyUrlButton url={item.url} />
                  <DeleteButton
                    action={deleteMedia.bind(null, item.id)}
                    confirmMessage={`Delete "${item.title}"? Any page using this link will lose it.`}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 text-sm text-ink/60">Nothing uploaded yet.</p>
      )}
    </div>
  );
}