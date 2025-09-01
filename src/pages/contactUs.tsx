const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Contact Us</h1>
          <p className="mb-6 text-gray-700 dark:text-gray-300 text-lg">
            We'd love to hear from you! If you have any questions, feedback, or
            support requests, please reach out to us through the following:
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-6">
            <p className="mb-2 text-gray-700 dark:text-gray-300 text-lg">
              📧 <strong>Email:</strong> 
              <a href="mailto:support@jobprepai.in" className="text-blue-600 dark:text-blue-400 hover:underline ml-2">
                support@jobprepai.in
              </a>
            </p>
          </div>

          <p className="mt-4 text-gray-700 dark:text-gray-300">
            As we are a fully remote operation, we do not maintain a public office
            address. Our team works virtually to provide you with the best service
            possible.
          </p>

          <p className="mt-4 text-gray-700 dark:text-gray-300">
            For official correspondence, please contact us via email.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
