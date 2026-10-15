"use client";

import { useState } from "react";

export interface RowField {
  name: string;
  label: string;
  placeholder?: string;
  inputMode?: "text" | "tel" | "numeric";
}

type Row = { id: number; values: Record<string, string> };

const inputClasses =
  "w-full rounded-sm border border-line bg-paper-raised px-3 py-2.5 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-none";

/**
 * A list of rows the admin can add to and remove from. Each field is a normal form
 * input, so the server action reads them with formData.getAll(name) (one value per row,
 * in the same order for every field).
 */
export function RepeatableRows({
  legend,
  hint,
  addLabel,
  emptyNote,
  fields,
  initial,
  max = 10,
  errors,
}: {
  legend: string;
  hint?: string;
  addLabel: string;
  emptyNote: string;
  fields: RowField[];
  initial: Record<string, string>[];
  max?: number;
  errors?: string[];
}) {
  const [nextId, setNextId] = useState(initial.length);
  const [rows, setRows] = useState<Row[]>(() =>
    initial.map((values, id) => ({ id, values }))
  );

  const update = (id: number, name: string, value: string) =>
    setRows((rs) =>
      rs.map((r) => (r.id === id ? { ...r, values: { ...r.values, [name]: value } } : r))
    );

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium text-ink">{legend}</legend>
      {hint && <p className="text-xs text-ink/60">{hint}</p>}

      {rows.length === 0 && <p className="text-sm text-ink/60">{emptyNote}</p>}

      {rows.map((row, index) => (
        <div key={row.id} className="rounded-sm border border-line bg-paper p-3">
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((f) => (
              <label key={f.name} className="block text-xs font-medium text-ink/70">
                {f.label}
                <input
                  name={f.name}
                  value={row.values[f.name] ?? ""}
                  onChange={(e) => update(row.id, f.name, e.target.value)}
                  placeholder={f.placeholder}
                  inputMode={f.inputMode}
                  className={`${inputClasses} mt-1 font-normal`}
                />
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setRows((rs) => rs.filter((r) => r.id !== row.id))}
            className="mt-3 text-xs font-medium text-red-700 hover:underline"
            aria-label={`Remove ${legend.toLowerCase()} ${index + 1}`}
          >
            Remove
          </button>
        </div>
      ))}

      {rows.length < max && (
        <button
          type="button"
          onClick={() => {
            setRows((rs) => [...rs, { id: nextId, values: {} }]);
            setNextId((n) => n + 1);
          }}
          className="rounded-sm border border-forest px-4 py-2 text-sm font-medium text-forest transition-colors hover:bg-forest hover:text-paper-raised"
        >
          + {addLabel}
        </button>
      )}

      {errors?.map((e) => (
        <p key={e} role="alert" className="text-sm text-red-700">
          {e}
        </p>
      ))}
    </fieldset>
  );
}