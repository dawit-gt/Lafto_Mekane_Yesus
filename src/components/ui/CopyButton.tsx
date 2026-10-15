"use client";

import { useState } from "react";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          /* clipboard blocked: the number is still visible to copy by hand */
        }
      }}
      className="rounded-sm border border-line px-3 py-1 text-xs font-medium text-forest transition-colors hover:border-forest"
    >
      {copied ? "Copied" : label}
    </button>
  );
}