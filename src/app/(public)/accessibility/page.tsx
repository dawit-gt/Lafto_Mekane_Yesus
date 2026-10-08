import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Our commitment to making the Lafto Mekaneyesus website usable by everyone.",
};

export default function AccessibilityPage() {
  const { churchName, contactEmail, legalLastUpdated } = siteConfig;

  return (
    <LegalPage
      title="Accessibility"
      intro={`${churchName} wants everyone in our community to be able to use this website.`}
      updated={legalLastUpdated}
    >
      <h2>Our goal</h2>
      <p>
        We are working towards meeting level AA of the Web Content Accessibility Guidelines (WCAG
        2.2), so that people who use screen readers, keyboards, larger text or other assistive
        tools can use this website.
      </p>

      <h2>What we have done</h2>
      <ul>
        <li>A &quot;Skip to main content&quot; link at the top of every page.</li>
        <li>Navigation and forms that can be used with a keyboard, with a visible focus outline.</li>
        <li>Form fields with visible labels, and error messages shown next to the field.</li>
        <li>A layout that adapts to phones, tablets and larger screens, and to larger text.</li>
        <li>Reduced animation for visitors whose device is set to prefer it.</li>
        <li>Clear headings so pages can be navigated by screen reader.</li>
      </ul>

      <h2>Known limitations</h2>
      <ul>
        <li>
          An Amharic version of the website is planned but not available yet. At the moment the
          site is in English only.
        </li>
        <li>
          We have not yet completed a formal accessibility audit or testing with a range of
          assistive technologies, so some problems may remain.
        </li>
        <li>
          Sermon videos are provided through YouTube and may not have captions or transcripts.
        </li>
      </ul>

      <h2>Tell us about a problem</h2>
      <p>
        If you find something on this website hard to use, please tell us which page it was and
        what went wrong, at <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. We will try to
        reply within a few working days and to fix the problem.
      </p>
    </LegalPage>
  );
}