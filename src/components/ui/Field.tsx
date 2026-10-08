import type { ReactNode } from "react";

const fieldClasses =
  "w-full rounded-sm border border-line bg-paper-raised px-3 py-2.5 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-none";

interface BaseProps {
  label: string;
  name: string;
  required?: boolean;
  errors?: string[];
  hint?: string;
}

export function TextField({
  label,
  name,
  required,
  errors,
  hint,
  type = "text",
  defaultValue,
}: BaseProps & {
  type?: "text" | "email" | "tel" | "password";
  defaultValue?: string;
}) {
  return (
    <FieldWrapper label={label} name={name} required={required} errors={errors} hint={hint}>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        aria-invalid={errors && errors.length > 0}
        className={fieldClasses}
      />
    </FieldWrapper>
  );
}

export function TextAreaField({
  label,
  name,
  required,
  errors,
  hint,
  rows = 5,
  defaultValue,
}: BaseProps & {
  rows?: number;
  defaultValue?: string;
}) {
  return (
    <FieldWrapper label={label} name={name} required={required} errors={errors} hint={hint}>
      <textarea
        id={name}
        name={name}
        rows={rows}
        required={required}
        defaultValue={defaultValue}
        aria-invalid={errors && errors.length > 0}
        className={fieldClasses}
      />
    </FieldWrapper>
  );
}

export function CheckboxField({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label htmlFor={name} className="flex items-start gap-2 text-sm text-ink/85">
      <input
        id={name}
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 rounded-sm border-line accent-forest"
      />
      {label}
    </label>
  );
}

export function SelectField({
  label,
  name,
  required,
  errors,
  hint,
  options,
  defaultValue,
  emptyOptionLabel,
}: BaseProps & {
  options: Array<{ value: string; label: string }>;
  defaultValue?: string;
  emptyOptionLabel?: string;
}) {
  return (
    <FieldWrapper label={label} name={name} required={required} errors={errors} hint={hint}>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        aria-invalid={errors && errors.length > 0}
        className={fieldClasses}
      >
        {emptyOptionLabel !== undefined && (
          <option value="">{emptyOptionLabel}</option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}

function FieldWrapper({
  label,
  name,
  required,
  errors,
  hint,
  children,
}: BaseProps & { children: ReactNode }) {
  const errorId = `${name}-error`;

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-ink">
        {label}
        {required && <span className="text-clay"> *</span>}
      </label>

      {hint && <p className="mt-0.5 text-xs text-ink/55">{hint}</p>}

      <div className="mt-1.5">{children}</div>

      {errors && errors.length > 0 && (
        <p id={errorId} className="mt-1 text-xs text-clay">
          {errors[0]}
        </p>
      )}
    </div>
  );
}