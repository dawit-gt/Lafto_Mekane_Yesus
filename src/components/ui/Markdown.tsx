import type { ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";

/**
 * Shows text written with simple Markdown: **bold**, *italic*,
 * [link text](https://...), lists, headings and quotes.
 *
 * It is safe for text typed by staff: raw HTML is never shown as HTML, pictures
 * and tables are not allowed, and links may only start with https://, http://,
 * mailto:, tel:, / or #. Single line breaks are kept as line breaks.
 */

const allowedElements = [
  "p", "strong", "em", "a", "ul", "ol", "li",
  "h1", "h2", "h3", "h4", "blockquote", "br", "hr",
];

function safeUrl(url: string): string {
  const value = url.trim();
  if (/^(https?:|mailto:|tel:)/i.test(value) || value.startsWith("/") || value.startsWith("#")) {
    return value;
  }
  return "";
}

const heading2 = ({ children }: { children?: ReactNode }) => (
  <h2 className="mb-3 mt-8 font-serif text-2xl font-bold text-forest">{children}</h2>
);
const heading3 = ({ children }: { children?: ReactNode }) => (
  <h3 className="mb-2 mt-6 font-serif text-xl font-semibold text-forest">{children}</h3>
);

const components: Components = {
  // The page already has its own main heading, so "#" becomes a section heading.
  h1: heading2,
  h2: heading2,
  h3: heading3,
  h4: heading3,
  p: ({ children }) => <p className="mb-4 whitespace-pre-line leading-7">{children}</p>,
  ul: ({ children }) => <ul className="mb-4 list-disc space-y-1 pl-6 leading-7">{children}</ul>,
  ol: ({ children }) => <ol className="mb-4 list-decimal space-y-1 pl-6 leading-7">{children}</ol>,
  blockquote: ({ children }) => (
    <blockquote className="mb-4 border-l-2 border-brass pl-4 italic text-ink/75">{children}</blockquote>
  ),
  hr: () => <hr className="my-6 border-line" />,
  a: ({ href, children }) => {
    if (!href) return <span>{children}</span>;
    const external = /^https?:/i.test(href);
    return (
      <a
        href={href}
        className="font-medium text-forest underline underline-offset-4 hover:text-forest-deep"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  },
};

export function Markdown({ children, className = "" }: { children: string; className?: string }) {
  return (
    <div className={`max-w-[70ch] break-words ${className}`}>
      <ReactMarkdown
        allowedElements={allowedElements}
        unwrapDisallowed
        urlTransform={safeUrl}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}