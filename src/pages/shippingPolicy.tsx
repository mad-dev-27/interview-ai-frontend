import React from "react";

/**
 * Shipping & Delivery Policy Page – AI Interview SaaS
 *
 * Usage:
 * <ShippingDelivery
 *   companyName="InterviewElevate, Inc."
 *   effectiveDate="August 31, 2025"
 *   email="support@interviewelevate.in"
 *   website="https://interviewelevate.in"
 *   address="123, 5th Main Road, Chennai, TN 600001, India"
 * />
 */

export default function ShippingDelivery({
  companyName = "[Your Company/Platform Name]",
  effectiveDate = "[Insert Date]",
  email = "[Your Support Email]",
  website = "[Your Website]",
  address = "[Your Business Address]",
}) {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <header className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Shipping and Delivery Policy
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Effective Date:</span> {effectiveDate}
            </p>
          </header>

          {/* Intro */}
          <section className="prose prose-gray max-w-none mb-8">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              At <strong>{companyName}</strong>, all purchases provide{" "}
              <strong>digital access</strong> to our AI-powered interview
              platform. This means no physical shipping is required.
            </p>
          </section>

          {/* Order Processing */}
          <Section title="1. Order Processing and Delivery Time">
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                Once payment is confirmed, you will receive access credentials via
                email within <strong>minutes of purchase</strong>.
              </li>
              <li>
                In rare cases (such as payment verification delays), delivery may
                take up to <strong>24 hours</strong>.
              </li>
              <li>
                If you do not receive your confirmation email within 24 hours,
                please contact our support team.
              </li>
            </ul>
          </Section>

          {/* Shipping Costs */}
          <Section title="2. Shipping Costs">
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                Since our services are digital, there are{" "}
                <strong>no shipping fees</strong>.
              </li>
              <li>
                The only cost is the one-time purchase price displayed at
                checkout.
              </li>
            </ul>
          </Section>

          {/* International Access */}
          <Section title="3. International Access">
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                Our digital platform is accessible <strong>worldwide</strong>.
              </li>
              <li>
                Availability may vary depending on local internet regulations or
                restrictions.
              </li>
              <li>
                Customers are responsible for ensuring that access to our services
                is permitted in their country.
              </li>
            </ul>
          </Section>

          {/* Contact Information */}
          <Section title="4. Contact Information">
            <p className="text-gray-700 dark:text-gray-300 mb-4">If you have questions about this policy, please contact us at:</p>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
              <address className="not-italic space-y-2">
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Email:</span>{" "}
                  <a className="underline text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300" href={`mailto:${email}`}>
                    {email}
                  </a>
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Website:</span>{" "}
                  <a
                    className="underline text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    href={website}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {website}
                  </a>
                </p>
              </address>
            </div>
          </Section>
        </div>
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