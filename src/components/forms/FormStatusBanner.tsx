import type { FormState } from "@/lib/actions/state";

export function FormStatusBanner({ state }: { state: FormState }) {
  if (state.status === "idle") return null;

  const isSuccess = state.status === "success";

  return (
    <div
      role="status"
      className={`rounded-sm border px-4 py-3 text-sm ${
        isSuccess
          ? "border-forest/30 bg-forest/5 text-forest-deep"
          : "border-clay/30 bg-clay/5 text-clay"
      }`}
    >
      {state.message}
    </div>
  );
}