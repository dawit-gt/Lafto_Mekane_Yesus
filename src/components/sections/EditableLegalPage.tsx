import { LegalPage } from "@/components/sections/LegalPage";
import { Markdown } from "@/components/ui/Markdown";
import { defaultLegalMarkdown, legalMeta, type LegalKind } from "@/lib/legal-defaults";
import { getSiteSettings } from "@/lib/data/public";
import { siteConfig } from "@/lib/site-config";

const columns = {
  privacy: "privacy_md",
  terms: "terms_md",
  accessibility: "accessibility_md",
} as const;

/** A legal page whose text comes from Admin -> Settings, or the standard wording. */
export async function EditableLegalPage({ kind }: { kind: LegalKind }) {
  const settings = await getSiteSettings();
  const custom = settings?.[columns[kind]]?.trim();
  const body = custom || defaultLegalMarkdown(kind);
  const updated = settings?.legal_last_updated?.trim() || siteConfig.legalLastUpdated;

  return (
    <LegalPage
      title={legalMeta[kind].title}
      intro={legalMeta[kind].intro(settings?.church_name?.trim() || siteConfig.churchName)}
      updated={updated}
    >
      <Markdown className="text-ink/85">{body}</Markdown>
    </LegalPage>
  );
}