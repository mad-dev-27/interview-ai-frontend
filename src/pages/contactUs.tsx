const ContactUs = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          We'd love to hear from you! If you have any questions, feedback, or
          support requests, please reach out to us through the following:
        </p>

        <p className="mb-2 text-gray-700 dark:text-gray-300">
          📧 <strong>Email:</strong>support@jobprepai.in
        </p>

        <p className="mt-4 text-gray-700 dark:text-gray-300">
          As we are a fully remote operation, we do not maintain a public office
          address. Our team works virtually to provide you with the best service
          possible.
        </p>

        <p className="mt-2 text-gray-700 dark:text-gray-300">
          For official correspondence, please contact us via email.
        </p>
      </div>
    </div>
  );
};

export default ContactUs;
