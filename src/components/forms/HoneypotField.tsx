/**
 * Invisible to real visitors, but a naive bot filling out every field will
 * fill this in too. Server Actions check it and silently drop the
 * submission. See lib/actions/forms.ts.
 */
export function HoneypotField() {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
      <label htmlFor="company">Company</label>
      <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}