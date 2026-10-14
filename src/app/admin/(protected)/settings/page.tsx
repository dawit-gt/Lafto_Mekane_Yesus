import type { Metadata } from "next";
import { SettingsTabs } from "@/components/admin/SettingsTabs";
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
      <SettingsTabs siteSettings={siteSettings} givingSettings={givingSettings} />
    </div>
  );
}