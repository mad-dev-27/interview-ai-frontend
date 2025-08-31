import React from "react";
import { motion } from "framer-motion";
import { Brain, Mail } from "lucide-react";

import { Link as ScrollLink } from "react-scroll";

export const Footer: React.FC = () => {
  const footerLinks = [
    {
      title: "Legal",
      links: [
        { name: "Terms & Conditions", href: "/t&c" },
        { name: "Privacy Policy", href: "/privacyPolicy" },
        { name: "Cancellation & Refund", href: "/cancellation&refundPolicy" },
        { name: "Shipping Policy", href: "/shippingPolicy" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Contact Us", href: "/contactUs" },
        { name: "Opinion Survey", href: "/opinionSurvey" },
      ],
    },
    {
      title: "Product",
      links: [
        { name: "Features", href: "features" },
        { name: "How It Works", href: "howItWorks" },
        { name: "Pricing", href: "pricing" },
        { name: "FAQ", href: "faq" },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 dark:bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                JobPrepAI
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Master your interview skills with AI-powered mock interviews and
              detailed feedback to land your dream job.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Mail size={16} />
              <span>support@jobprepai.in</span>
            </div>
          </motion.div>

          {/* Links Sections */}
          {footerLinks.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-white">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith("/") ? (
                      // External page route
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                      >
                        {link.name}
                      </a>
                    ) : (
                      // Scroll to section on same page
                      <ScrollLink
                        to={link.href}
                        smooth={false}
                        duration={50}
                        offset={-50}
                        className="cursor-pointer text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                      >
                        {link.name}
                      </ScrollLink>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-gray-800 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2025 JobPrepAI. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>Made with ❤️ for job seekers</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
