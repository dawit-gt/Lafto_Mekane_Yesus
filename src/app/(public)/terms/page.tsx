import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { siteConfig } from "@/lib/site-config";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms for using the Lafto Mekaneyesus website.",
};

export default function TermsPage() {
  const { churchName,  legalLastUpdated } = siteConfig;

  return (
    <LegalPage
      title="Terms of Use"
      intro={`Please read these terms before using the ${churchName} website.`}
      updated={legalLastUpdated}
    >
      <h2>Using this website</h2>
      <p>
        This website is provided by {churchName} to share information about our church and to let
        you contact us. It is free to use. By using it you agree to these terms. If you do not
        agree, please do not use the forms or accounts on this site.
      </p>

      <h2>Accuracy of information</h2>
      <p>
        We work to keep service times, events and other information correct, but they can change.
        If something matters for your plans, such as a service time or event, please check with us
        before you travel.
      </p>

      <h2>Forms and messages</h2>
      <p>When you send us a message, prayer request or volunteer form, you agree to:</p>
      <ul>
        <li>give information that is honest and, where it is about you, accurate;</li>
        <li>not send anything abusive, unlawful, misleading or meant as spam;</li>
        <li>not send other people&apos;s private information without their permission.</li>
      </ul>
      <p>We may delete messages that break these rules.</p>

      <h2>Prayer requests and urgent needs</h2>
      <p>
        Our prayer team reads requests, but not instantly, and this website is not an emergency
        service. If you or someone else is in danger or needs urgent medical help, contact your
        local emergency services right away.
      </p>

      <h2>Giving</h2>
      <p>
        Information about giving on this website is for guidance. This website never asks for
        card numbers or bank passwords. If an online giving link is shown, it takes you to a
        separate payment provider, and that provider&apos;s own terms apply to your payment.
      </p>

      <h2>Member and staff accounts</h2>
      <p>
        If you have an account, please keep your password private and do not share your account.
        We may suspend or remove an account that is misused or no longer needed.
      </p>

      <h2>Content and links</h2>
      <p>
        The text, images and other material on this website belong to {churchName} or are used
        with permission. You are welcome to share links to our pages. Please ask before copying
        our content for other uses. Videos are provided through YouTube and are also subject to
        YouTube&apos;s terms. We are not responsible for the content of other websites we link to.
      </p>

      <h2>Availability</h2>
      <p>
        We try to keep the website running and free of errors, but we cannot promise it will always
        be available or error-free. We may change or remove parts of it at any time.
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of Ethiopia.</p>

      <h2>Contact</h2>
      <p>
        Questions about these terms can be sent to{" "}
        <Link href="/contact">contact form</Link>..
      </p>
    </LegalPage>
  );
}