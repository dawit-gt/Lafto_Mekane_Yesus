"use client";

import { useActionState, useState, type ChangeEvent } from "react";
import { createMember, updateMember } from "@/lib/actions/admin-members";
import { initialFormState } from "@/lib/actions/state";
import { TextField, SelectField } from "@/components/ui/Field";
import { FormStatusBanner } from "@/components/forms/FormStatusBanner";
import { createClient } from "@/lib/supabase/client";
import { resizeImageToJpeg } from "@/lib/utils/image";
import type { Member } from "@/types/database";

export function MemberForm({
  member,
  ministries,
  photoUrl,
}: {
  member?: Member;
  ministries: Array<{ id: string; label: string }>;
  photoUrl?: string | null;
}) {
  const isEdit = !!member;
  const action = isEdit ? updateMember.bind(null, member.id) : createMember;
  const [state, formAction, isPending] = useActionState(action, initialFormState);

  const [photoPath, setPhotoPath] = useState(member?.photo_path ?? "");
  const [previewUrl, setPreviewUrl] = useState<string | null>(photoUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState("");

  async function onPhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError("");

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please choose an image file (JPG, PNG or WebP).");
      return;
    }

    setUploading(true);
    try {
      const blob = await resizeImageToJpeg(file);
      const path = `${crypto.randomUUID()}.jpg`;
      const supabase = createClient();
      const { error } = await supabase.storage
        .from("member-photos")
        .upload(path, blob, { contentType: "image/jpeg" });
      if (error) throw error;
      setPhotoPath(path);
      setPreviewUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error("photo upload failed:", err);
      setPhotoError("Could not upload this photo. Please try a different image.");
    } finally {
      setUploading(false);
    }
  }

  function removePhoto() {
    setPhotoPath("");
    setPreviewUrl(null);
    setPhotoError("");
  }

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <FormStatusBanner state={state} />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Full Name"
          name="fullName"
          required
          defaultValue={member?.full_name}
          errors={state.fieldErrors?.fullName}
        />
        <TextField
          label="Phone Number"
          name="phone"
          type="tel"
          required
          defaultValue={member?.phone ?? undefined}
          errors={state.fieldErrors?.phone}
        />
      </div>

      <div>
        <p className="text-sm font-medium text-ink">Photo (optional)</p>
        <div className="mt-2 flex items-center gap-4">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="" className="h-24 w-24 rounded-full border border-line object-cover" />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-dashed border-line text-xs text-ink/50">
              No photo
            </div>
          )}
          <div className="space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={onPhotoChange}
              disabled={uploading}
              aria-label="Choose a photo"
              className="block text-sm text-ink/80 file:mr-3 file:rounded-sm file:border file:border-line file:bg-paper-raised file:px-3 file:py-1.5 file:text-sm"
            />
            {previewUrl && (
              <button
                type="button"
                onClick={removePhoto}
                className="text-sm font-medium text-clay underline underline-offset-4"
              >
                Remove photo
              </button>
            )}
            {uploading && <p className="text-xs text-ink/60">Uploading photo…</p>}
            {photoError && <p className="text-xs text-clay">{photoError}</p>}
            {state.fieldErrors?.photoPath && (
              <p className="text-xs text-clay">{state.fieldErrors.photoPath[0]}</p>
            )}
          </div>
        </div>
        <p className="mt-1 text-xs text-ink/55">
          The photo is made smaller automatically. Any size works.
        </p>
        <input type="hidden" name="photoPath" value={photoPath} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          label="Marital Status (optional)"
          name="maritalStatus"
          defaultValue={member?.marital_status ?? ""}
          emptyOptionLabel="Not given"
          options={[
            { value: "married", label: "Married" },
            { value: "not_married", label: "Not married" },
          ]}
          errors={state.fieldErrors?.maritalStatus}
        />
        <TextField
          label="Number of Children (optional)"
          name="childrenCount"
          defaultValue={member?.children_count != null ? String(member.children_count) : undefined}
          hint="Leave empty if none or not known"
          errors={state.fieldErrors?.childrenCount}
        />
      </div>

      <TextField
        label="Work (optional)"
        name="occupation"
        defaultValue={member?.occupation ?? undefined}
        hint="e.g. Teacher, Nurse, Student"
        errors={state.fieldErrors?.occupation}
      />

      <SelectField
        label="Membership Status"
        name="membershipStatus"
        required
        defaultValue={member?.membership_status ?? "active"}
        options={[
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ]}
        errors={state.fieldErrors?.membershipStatus}
      />

      <fieldset>
        <legend className="text-sm font-medium text-ink">Ministries (optional)</legend>
        {ministries.length > 0 ? (
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {ministries.map((m) => (
              <label key={m.id} className="flex items-start gap-2 text-sm text-ink/85">
                <input
                  type="checkbox"
                  name="ministryIds"
                  value={m.id}
                  defaultChecked={member?.ministry_ids?.includes(m.id)}
                  className="mt-0.5 h-4 w-4 rounded-sm border-line accent-forest"
                />
                {m.label}
              </label>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-ink/60">No ministries yet. Add them under Content → Ministries.</p>
        )}
      </fieldset>

      <label className="flex items-start gap-2 text-sm text-ink/85">
        <input
          type="checkbox"
          name="directoryVisible"
          defaultChecked={member?.directory_visible}
          className="mt-0.5 h-4 w-4 rounded-sm border-line accent-forest"
        />
        Show this person&apos;s name and photo on the public &ldquo;Church Family&rdquo; page. Tick
        only if they gave permission.
      </label>

      <button
        type="submit"
        disabled={isPending || uploading}
        className="inline-flex items-center justify-center gap-2 rounded-sm bg-forest px-5 py-2.5 text-sm font-semibold text-paper-raised transition-colors hover:bg-forest-deep disabled:opacity-60"
      >
        {isPending ? "Saving…" : uploading ? "Uploading photo…" : isEdit ? "Save Changes" : "Add Member"}
      </button>
    </form>
  );
}