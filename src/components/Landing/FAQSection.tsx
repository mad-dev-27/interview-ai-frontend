import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How does the AI interview analysis work?",
      answer:
        "Our AI analyzes your responses using natural language processing and machine learning algorithms. It evaluates factors like communication clarity, technical depth, confidence level, and relevance to the job role. You'll receive detailed feedback on strengths, areas for improvement, and specific suggestions to enhance your performance.",
    },
    {
      question: "What types of questions can I practice with?",
      answer:
        "Our platform generates questions tailored to your resume and the specific job description you provide. This includes technical questions, behavioral questions, situational scenarios, and role-specific challenges. The AI ensures questions are relevant to your experience level and the position you're targeting.",
    },
    {
      question: "How accurate is the AI feedback?",
      answer:
        "Our AI has been trained on thousands of successful interview patterns and is continuously improved based on real interview outcomes. While it provides highly valuable insights and has helped many users improve their performance, we recommend using it as a comprehensive preparation tool alongside other interview practice methods.",
    },
    {
      question: "Can I practice for different job roles?",
      answer:
        "Absolutely! You can create multiple interview sessions for different positions. Simply upload your resume and provide different job descriptions for each role you're targeting. The AI will generate role-specific questions and provide tailored feedback for each position.",
    },
    {
      question: "Is my data secure and private?",
      answer:
        "Yes, we take data security very seriously. All uploaded resumes and personal information are encrypted and stored securely. We never share your data with third parties, and you can delete your information at any time. Your interview practice sessions are completely confidential.",
    },
    {
      question: "What happens after I complete an interview?",
      answer:
        "After completing an interview, you'll receive a comprehensive analysis including an overall score, question-by-question feedback, confidence analysis, strengths and areas for improvement, suggested answers, and actionable recommendations. You can review this feedback anytime and track your progress over multiple sessions.",
    },
    {
      question: "Can I retake interviews or practice the same questions?",
      answer:
        "Yes! You can practice as many times as you want with your purchased interview sessions. Each session generates fresh questions based on your resume and job description, so you'll get variety while still targeting the same role. This helps you practice different scenarios and improve consistently.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "Due to the instant digital nature of our service, all purchases are final and non-refundable. However, we're confident in our platform's value and offer excellent customer support to ensure you get the most out of your interview preparation experience.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:bg-gray-900 dark:from-transparent dark:to-transparent"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center space-x-3 mb-4"
          >
            <HelpCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-300"
          >
            Everything you need to know about our AI interview platform
          </motion.p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
