import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";
import { GivingSettingsForm } from "@/components/admin/GivingSettingsForm";
import { getGivingSettings, getSiteSettings } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage() {
  const [siteSettings, givingSettings] = await Promise.all([
    getSiteSettings(),
    getGivingSettings(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-forest">Settings</h1>

      <h2 className="mt-8 text-lg font-semibold text-ink">Site</h2>
      <Card className="mt-3 max-w-2xl">
        {siteSettings ? (
          <SiteSettingsForm settings={siteSettings} />
        ) : (
          <p className="text-sm text-ink/70">
            Site settings couldn&apos;t be loaded. Check that the database migration ran, which
            creates the default settings row.
          </p>
        )}
      </Card>

      <h2 className="mt-10 text-lg font-semibold text-ink">Giving</h2>
      <Card className="mt-3 max-w-2xl">
        {givingSettings ? (
          <GivingSettingsForm settings={givingSettings} />
        ) : (
          <p className="text-sm text-ink/70">
            Giving settings couldn&apos;t be loaded. Check that the database migration ran, which
            creates the default settings row.
          </p>
        )}
      </Card>
    </div>
  );
}