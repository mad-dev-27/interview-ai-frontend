const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Privacy Policy</h1>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Effective Date: August 31, 2025
          </p>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
              1. Information We Collect
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may collect personal information such as your name, email
              address, resume details, and job preferences when you use our
              platform. We also collect technical data like IP addresses, browser
              type, and usage activity for analytics and security purposes.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
              2. How We Collect Information
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Information is collected directly when you register, submit your
              resume, or interact with our interview services. We also use cookies
              and tracking technologies to gather browsing activity to improve
              user experience.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
              3. How We Use Information
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              The information collected is used to provide and improve our
              interview-related services, personalize user experience, analyze
              trends, and ensure security of our platform. We may also use your
              contact information to send important updates and notifications.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
              4. How We Keep Information Safe
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We use industry-standard security measures, including encryption,
              firewalls, and secure servers, to protect your data from
              unauthorized access, alteration, or disclosure. While we take all
              necessary steps, no online transmission is completely secure, and we
              cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
              5. Information Sharing
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We do not sell or rent your personal information to third parties.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
              <address className="not-italic space-y-2 text-gray-700 dark:text-gray-300">
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  <a
                    className="underline text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    href={`mailto:support@jobprepai.in`}
                  >
                    support@jobprepai.in
                  </a>
                </p>
                <p>
                  <span className="font-medium">Website:</span>{" "}
                  <a
                    className="underline text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    href={"https://jobprepai.in/"}
                    target="_blank"
                    rel="noreferrer"
                  >
                    https://jobprepai.in/
                  </a>
                </p>
              </address>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
