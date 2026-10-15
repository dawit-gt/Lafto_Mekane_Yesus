import { siteConfig } from "@/lib/site-config";

/**
 * The standard wording of the Privacy, Terms and Accessibility pages, written in the
 * simple Markdown that Admin -> Settings -> Legal pages edits. A page uses this text
 * until an Admin saves their own.
 */

export type LegalKind = "privacy" | "terms" | "accessibility";

export const legalMeta: Record<LegalKind, { title: string; intro: (church: string) => string }> = {
  privacy: {
    title: "Privacy Policy",
    intro: (church) => `How ${church} handles the personal information you share through this website.`,
  },
  terms: {
    title: "Terms of Use",
    intro: (church) => `Please read these terms before using the ${church} website.`,
  },
  accessibility: {
    title: "Accessibility",
    intro: (church) => `${church} wants everyone in our community to be able to use this website.`,
  },
};

function contactWays(): string {
  const email = siteConfig.contactEmail;
  const hasEmail = email.includes("@");
  return hasEmail
    ? `using the form on our Contact page or by writing to [${email}](mailto:${email})`
    : "using the form on our Contact page";
}

export function defaultLegalMarkdown(kind: LegalKind): string {
  const { churchName, denominationName, retentionMonths } = siteConfig;
  const contact = contactWays();

  if (kind === "privacy") {
    return `## Who we are

${churchName} is a congregation of the ${denominationName}. This website is run by the church's website team. Questions about this policy can be sent to us ${contact}.

## What we collect and why

You can read this website without giving us any personal information. We collect information only when you choose to send it to us:

- **Contact form:** your name, your phone number and your message. We use it to reply to you.
- **Prayer requests:** your request, and optionally your name and email. You can submit without giving your name. We use it so our prayer team can pray and, if you gave an email address, follow up.
- **Church member list:** the church's own records of its members, kept by our Admin team: name, phone number, and, where the person chose to share them, marital status, work, number of children and a photo. This information is collected by the church in person, not through this website's public forms.
- **Staff accounts:** for the people who manage this website, an email address and a password. Passwords are stored in scrambled form by our sign-in provider, so website staff cannot read them.
- **Staff activity records:** a log of which staff member changed what on the website. This is visible only to our Admin team.

This website does not take payments and never asks for card numbers or bank passwords. It does not currently use advertising or analytics trackers.

## Who can see it

Messages and prayer requests can only be seen by members of our Admin team who sign in to the staff area of this website. Prayer requests are never published on the website. We do not sell your information or use it for marketing.

The church member list can only be seen by our Admin team. Member photos are stored in a private area. The public Members page shows only the name and photo of members who gave us permission to be listed there. Phone numbers, work and family details are never shown publicly. A member can ask us at any time to be removed from that page.

## Companies that help us run the website

Our database and sign-in system are provided by Supabase, and the website is run on a cloud hosting service. These companies store information on our behalf, on servers that may be located outside Ethiopia.

Sermon pages can show videos from YouTube. When you open a sermon with a video, YouTube may set cookies and receive information about your visit, under its own policies. Links to Google Maps open on Google's site.

## Cookies

We use only the cookies needed to keep signed-in staff signed in, and one to remember your language choice. We do not set advertising or analytics cookies. Embedded YouTube videos may set their own.

## How long we keep information

We aim to keep contact messages for about ${retentionMonths.contactMessages} months, and prayer requests for about ${retentionMonths.prayerRequests} months, and then delete them. Our Admin team deletes these by hand, so it can take somewhat longer in practice. We will delete your information sooner if you ask.

Member list records are kept while a person is a member of the church, and deleted when they ask us to or when the church no longer needs them.

## Your choices

You can ask us what we hold about you, ask us to correct it, or ask us to delete it, ${contact}. You can also send a prayer request without giving your name.

## Children

The forms on this website are meant for adults. If a parent or guardian believes a child has sent us personal information, please contact us and we will delete it.

## Changes to this policy

If we change how the website handles information, we will update this page and the date at the top.`;
  }

  if (kind === "terms") {
    return `## Using this website

This website is provided by ${churchName} to share information about our church and to let you contact us. It is free to use. By using it you agree to these terms. If you do not agree, please do not use the forms on this site.

## Accuracy of information

We work to keep service times, events and other information correct, but they can change. If something matters for your plans, such as a service time or event, please check with us before you travel.

## Forms and messages

When you send us a message or prayer request, you agree to:

- give information that is honest and, where it is about you, accurate;
- not send anything abusive, unlawful, misleading or meant as spam;
- not send other people's private information without their permission.

We may delete messages that break these rules.

## Prayer requests and urgent needs

Our prayer team reads requests, but not instantly, and this website is not an emergency service. If you or someone else is in danger or needs urgent medical help, contact your local emergency services right away.

## Giving

Information about giving on this website is for guidance. This website never asks for card numbers or bank passwords. Account numbers shown on the Contact page are the church's own accounts. Please check them with the church office if you are unsure.

## Staff accounts

If you have a staff account, please keep your password private and do not share your account. We may suspend or remove an account that is misused or no longer needed.

## Content and links

The text, images and other material on this website belong to ${churchName} or are used with permission. You are welcome to share links to our pages. Please ask before copying our content for other uses. Videos are provided through YouTube and are also subject to YouTube's terms. We are not responsible for the content of other websites we link to.

## Availability

We try to keep the website running and free of errors, but we cannot promise it will always be available or error-free. We may change or remove parts of it at any time.

## Governing law

These terms are governed by the laws of Ethiopia.

## Contact

Questions about these terms can be sent to us ${contact}.`;
  }

  return `## Our goal

We are working towards meeting level AA of the Web Content Accessibility Guidelines (WCAG 2.2), so that people who use screen readers, keyboards, larger text or other assistive tools can use this website.

## What we have done

- A "Skip to main content" link at the top of every page.
- Navigation and forms that can be used with a keyboard, with a visible focus outline.
- Form fields with visible labels, and error messages shown next to the field.
- A layout that adapts to phones, tablets and larger screens, and to larger text.
- Reduced animation for visitors whose device is set to prefer it.
- Clear headings so pages can be navigated by screen reader.

## Known limitations

- Parts of the website are available in Amharic, but not every page and not all of the content added by our team.
- We have not yet completed a formal accessibility audit or testing with a range of assistive technologies, so some problems may remain.
- Sermon videos are provided through YouTube and may not have captions or transcripts.

## Tell us about a problem

If you find something on this website hard to use, please tell us which page it was and what went wrong, ${contact}. We will try to reply within a few working days and to fix the problem.`;
}