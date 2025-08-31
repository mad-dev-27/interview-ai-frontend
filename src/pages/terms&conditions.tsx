import React from "react";

/**
 * Terms & Conditions Page – AI Interview SaaS
 *
 * Usage:
 * <TermsAndConditions
 *   companyName="JobPrepAI"
 *   effectiveDate="August 31, 2025"
 *   email="support@jobprepai.in"
 *   website="https://jobprepai.in/"
 *   address=""
 * />
 */

export default function TermsAndConditions({
  companyName = "[Your Company/Platform Name]",
  effectiveDate = "[Insert Date]",
  email = "[Your Support Email]",
  website = "[Your Website]",
  address = "[Your Business Address]",
}) {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="mx-auto max-w-3xl px-6 py-12">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">
            Terms and Conditions
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Effective Date:</span> {effectiveDate}
          </p>
        </header>

        {/* Intro */}
        <section className="prose prose-gray max-w-none">
          <p className="text-gray-700 dark:text-gray-300">
            Welcome to <strong>{companyName}</strong> ("Company," "we," "our,"
            or "us"). These Terms and Conditions ("Terms") govern your access to
            and use of our AI-powered interview preparation and assessment
            platform (the "Service"). By accessing or using the Service, you
            agree to be bound by these Terms. If you do not agree, you must not
            use the Service.
          </p>
        </section>

        {/* Rules of Conduct */}
        <Section title="1. Rules of Conduct">
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Provide accurate, complete, and current information during
              registration.
            </li>
            <li>
              Use the Service only for lawful and personal (or your
              organization’s authorized) purposes.
            </li>
            <li>
              Respect other users; do not disrupt, attack, or otherwise
              interfere with the Service.
            </li>
            <li>
              Refrain from uploading, sharing, or generating content that is
              unlawful, harmful, violent, harassing, defamatory, or
              discriminatory.
            </li>
            <li>
              Comply with all applicable laws, regulations, and these Terms when
              using the Service.
            </li>
          </ul>
        </Section>

        {/* User Restrictions */}
        <Section title="2. User Restrictions">
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Do not copy, modify, translate, adapt, or reverse-engineer any
              part of the Service without prior written permission.
            </li>
            <li>
              Do not use automated tools (including bots, crawlers, or scrapers)
              to access the Service except as allowed by a documented API.
            </li>
            <li>
              Do not attempt to bypass or disable security or access controls,
              or gain unauthorized access to any systems or data.
            </li>
            <li>
              Do not use the Service to create or offer a competing product or
              service without our express authorization.
            </li>
            <li>
              Do not share, resell, or transfer your account credentials; you
              are responsible for all activity under your account.
            </li>
          </ul>
        </Section>

        {/* Limitation of Liability & Disclaimer */}
        <Section title="3. Limitation of Liability & Disclaimer of Warranties">
          <p>
            The Service is provided on an{" "}
            <strong>"as is" and "as available"</strong> basis. To the fullest
            extent permitted by law, we disclaim all warranties, whether
            express, implied, statutory, or otherwise, including but not limited
            to implied warranties of merchantability, fitness for a particular
            purpose, and non-infringement.
          </p>
          <p>
            Our AI interview tools are designed to aid preparation, but{" "}
            <strong>we do not guarantee</strong> job offers, employment, or
            specific outcomes. We do not warrant that the Service will be
            uninterrupted, secure, or error-free, or that defects will be
            corrected.
          </p>
          <p>
            To the maximum extent permitted by law, {companyName} (and its
            affiliates, officers, employees, agents, and licensors) shall not be
            liable for any indirect, incidental, special, consequential, or
            exemplary damages, including damages for loss of profits, goodwill,
            data, or other intangible losses, arising out of or relating to your
            use of or inability to use the Service, even if we have been advised
            of the possibility of such damages. In no event will our total
            liability for all claims relating to the Service exceed the amount
            you paid, if any, to use the Service in the twelve (12) months
            preceding the claim.
          </p>
        </Section>

        {/* Intellectual Property */}
        <Section title="4. Intellectual Property">
          <p>
            All content, features, software, models, prompts, templates,
            branding, and other materials available through the Service are
            owned by {companyName} or its licensors and are protected by
            intellectual property and other laws. Except as expressly permitted,
            you may not use our intellectual property without our prior written
            consent.
          </p>
        </Section>

        {/* Changes to Terms */}
        <Section title="5. Changes to These Terms">
          <p>
            We may update these Terms from time to time. If we make material
            changes, we will provide notice (for example, by email or through
            the Service). Your continued use of the Service after the effective
            date of the updated Terms constitutes your acceptance of the
            changes.
          </p>
        </Section>

        {/* Contact Information */}
        <Section title="6. Contact Information">
          <address className="not-italic space-y-1">
            <p>
              <span className="font-medium">Email:</span>{" "}
              <a className="underline" href={`mailto:${email}`}>
                {email}
              </a>
            </p>
            <p>
              <span className="font-medium">Website:</span>{" "}
              <a
                className="underline"
                href={website}
                target="_blank"
                rel="noreferrer"
              >
                {website}
              </a>
            </p>
            {/* <p>
              <span className="font-medium">Address:</span> {address}
            </p> */}
          </address>
        </Section>

        {/* Footer Note */}
        <footer className="mt-12 border-t pt-6 text-xs text-gray-500">
          <p>
            If you are entering into these Terms on behalf of an organization,
            you represent that you have the authority to bind that organization.
            If any provision of these Terms is held invalid or unenforceable,
            that provision will be enforced to the maximum extent permissible
            and the remaining provisions will remain in full force and effect.
          </p>
        </footer>
      </div>
    </main>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
      <div className="mt-3 text-base leading-7 text-gray-800 dark:text-gray-200 space-y-3">
        {children}
      </div>
    </section>
  );
}