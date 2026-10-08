import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Lafto Mekaneyesus handles the personal information you share through this website.",
};

export default function PrivacyPage() {
  const { churchName, denominationName, contactEmail, retentionMonths, legalLastUpdated } =
    siteConfig;

  return (
    <LegalPage
      title="Privacy Policy"
      intro={`How ${churchName} handles the personal information you share through this website.`}
      updated={legalLastUpdated}
    >
      <h2>Who we are</h2>
      <p>
        {churchName} is a congregation of the {denominationName}. This website is run by the
        church&apos;s website team. Questions about this policy can be sent to{" "}
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
      </p>

      <h2>What we collect and why</h2>
      <p>
        You can read this website without giving us any personal information. We collect
        information only when you choose to send it to us:
      </p>
      <ul>
        <li>
          <strong>Contact form:</strong> your name, email address, optional phone number, optional
          subject and your message. We use it to reply to you.
        </li>
        <li>
          <strong>Prayer requests:</strong> your request, and optionally your name and email. You
          can submit without giving your name. We use it so our prayer team can pray and, if you
          gave an email address, follow up.
        </li>
        <li>
          <strong>Volunteer form:</strong> your name, email address, optional phone number, the
          ministry you are interested in and your availability. We use it to connect you with a
          ministry leader.
        </li>
        <li>
          <strong>Member and staff accounts:</strong> for people who have an account, your email
          address and a password. Passwords are stored in scrambled form by our sign-in provider,
          so website staff cannot read them.
        </li>
        <li>
          <strong>Staff activity records:</strong> a log of which staff member changed what on the
          website. This is visible only to our Admin team.
        </li>
      </ul>
      <p>
        This website does not take payments and never asks for card numbers or bank passwords. It
        does not currently use advertising or analytics trackers.
      </p>

      <h2>Who can see it</h2>
      <p>
        Messages, prayer requests and volunteer forms can only be seen by members of our Admin
        team who sign in to the staff area of this website. Prayer requests are never published on
        the website. We do not sell your information or use it for marketing.
      </p>

      <h2>Companies that help us run the website</h2>
      <p>
        Our database and sign-in system are provided by Supabase, and the website is run on a
        cloud hosting service. These companies store information on our behalf, on servers that
        may be located outside Ethiopia.
      </p>
      <p>
        Sermon pages can show videos from YouTube. When you open a sermon with a video, YouTube
        may set cookies and receive information about your visit, under its own policies. Links
        to Google Maps open on Google&apos;s site.
      </p>

      <h2>Cookies</h2>
      <p>
        We use only the cookies needed to keep signed-in members and staff signed in. We do not
        set advertising or analytics cookies. Embedded YouTube videos may set their own.
      </p>

      <h2>How long we keep information</h2>
      <p>
        We aim to keep contact messages and volunteer forms for about{" "}
        {retentionMonths.contactMessages} months, and prayer requests for about{" "}
        {retentionMonths.prayerRequests} months, and then delete them. Our Admin team deletes
        these by hand, so it can take somewhat longer in practice. We will delete your
        information sooner if you ask.
      </p>

      <h2>Your choices</h2>
      <p>
        You can ask us what we hold about you, ask us to correct it, or ask us to delete it, by
        writing to <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. You can also send a
        prayer request without giving your name.
      </p>

      <h2>Children</h2>
      <p>
        The forms on this website are meant for adults. If a parent or guardian believes a child
        has sent us personal information, please contact us and we will delete it.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If we change how the website handles information, we will update this page and the date at
        the top.
      </p>
    </LegalPage>
  );
}