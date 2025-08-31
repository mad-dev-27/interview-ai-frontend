import React from "react";

/**
 * No Refund Policy Page – AI Interview SaaS
 *
 * Usage:
 * <NoRefundPolicy
 *   companyName="InterviewElevate, Inc."
 *   effectiveDate="August 31, 2025"
 *   email="support@interviewelevate.in"
 *   website="https://interviewelevate.in"
 * />
 */

export default function NoRefundPolicy({
  companyName = "[Your Company/Platform Name]",
  effectiveDate = "[Insert Date]",
  email = "[Your Support Email]",
  website = "[Your Website]",
}) {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="mx-auto max-w-3xl px-6 py-12">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">
            No Refund Policy
          </h1>
          <p className="mt-2 text-sm text-gray-600">
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Effective Date:</span> {effectiveDate}
          </p>
        </header>

        {/* Intro */}
        <section className="prose prose-gray max-w-none">
          <p>
            At <strong>{companyName}</strong>, we provide access to our
            AI-powered interview platform on a{" "}
            <strong>one-time purchase</strong> basis. Please review this policy
            carefully before making your purchase.
          </p>
        </section>

        {/* Policy Statement */}
        <Section title="1. No Refunds">
          <p>
            All purchases made on our platform are{" "}
            <strong>final and non-refundable</strong>. Once payment is
            completed, you will receive immediate access to the services, and no
            refunds will be issued under any circumstances.
          </p>
        </Section>

        {/* Why No Refunds */}
        <Section title="2. Reason for No Refunds">
          <ul className="list-disc pl-6 space-y-2">
            <li>Our services involve instant access to AI-based features.</li>
            <li>
              Once a purchase is made, resources are allocated and cannot be
              reversed.
            </li>
            <li>
              This policy ensures fairness and transparency for all users.
            </li>
          </ul>
        </Section>

        {/* Contact Information */}
        <Section title="3. Contact Information">
          <p>If you have questions about this policy, please contact us at:</p>
          <address className="not-italic space-y-1 mt-2">
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
          </address>
        </Section>
      </div>
    </main>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
      <div className="mt-3 text-base leading-7 text-gray-800 space-y-3">
      <div className="mt-3 text-base leading-7 text-gray-800 dark:text-gray-200 space-y-3">
        {children}
      </div>
    </section>
  );
}
