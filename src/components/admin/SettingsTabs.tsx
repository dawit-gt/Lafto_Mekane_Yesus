"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { SiteSettingsForm, type SiteTab } from "@/components/admin/SiteSettingsForm";
import { GivingSettingsForm } from "@/components/admin/GivingSettingsForm";
import type { GivingSettings, SiteSettings } from "@/types/database";

type Tab = SiteTab | "giving";

const tabs: Array<{ key: Tab; label: string }> = [
  { key: "general", label: "General" },
  { key: "home", label: "Home page" },
  { key: "about", label: "About page" },
  { key: "seo", label: "Search & sharing" },
  { key: "giving", label: "Giving" },
];

const missingNote =
  "These settings couldn't be loaded. Check that the database migrations ran, which create the default settings row.";

export function SettingsTabs({
  siteSettings,
  givingSettings,
}: {
  siteSettings: SiteSettings | null;
  givingSettings: GivingSettings | null;
}) {
  const [tab, setTab] = useState<Tab>("general");

  return (
    <div>
      <div
        role="tablist"
        aria-label="Settings sections"
        className="mt-6 flex flex-wrap gap-2 border-b border-line"
      >
        {tabs.map((item) => {
          const active = item.key === tab;
          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              id={`tab-${item.key}`}
              aria-selected={active}
              aria-controls={`panel-${item.key}`}
              onClick={() => setTab(item.key)}
              className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? "border-forest text-forest"
                  : "border-transparent text-ink/60 hover:text-forest"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <Card className="mt-6 max-w-2xl">
        <div
          role="tabpanel"
          id={`panel-${tab}`}
          aria-labelledby={`tab-${tab}`}
        >
          {/* The site form stays on the page (hidden) so every tab is saved together. */}
          <div hidden={tab === "giving"}>
            {siteSettings ? (
              <SiteSettingsForm settings={siteSettings} tab={tab === "giving" ? "general" : tab} />
            ) : (
              <p className="text-sm text-ink/70">{missingNote}</p>
            )}
          </div>

          {tab === "giving" &&
            (givingSettings ? (
              <GivingSettingsForm settings={givingSettings} />
            ) : (
              <p className="text-sm text-ink/70">{missingNote}</p>
            ))}
        </div>
      </Card>
    </div>
  );
}