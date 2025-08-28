import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Play,
  BookOpen,
  MessageSquare,
  Briefcase,
  ShoppingCart,
} from "lucide-react";
import { Button } from "../ui/Button";

import { PurchaseModal } from "./PurchaseModal";
import axios, { AxiosError, AxiosResponse } from "axios";
import { API_URL } from "../../config";
import Cookies from "js-cookie";
import { toast } from "sonner";

export const DashboardContent: React.FC = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const [showPurchaseModal, setShowPurchaseModal] = React.useState(false);

  useEffect(() => {
    if (searchParams.get("type") === "purchase") {
      setShowPurchaseModal(true);
    }
  }, [searchParams]);

  const handleStartInterview = () => {
    const token = Cookies.get("auth");

    const createSession = axios.post(
      API_URL + "/user/session",
      {},
      { headers: { Authorization: "Bearer " + token } }
    );
    toast.promise(createSession, {
      loading: "⚡ Setting up your interview session..",
      success: (data: AxiosResponse) => {
        localStorage.setItem("sessionId", data.data.sessionId);
        navigate("/mock-interview");
        return "✅ Session ready! Redirecting you to the interview...";
      },
      error: (error: AxiosError<{ error: string }>) => {
        return error.response?.data?.error ?? "Something went wrong.";
      },
    });
  };

  const handlePurchase = (quantity: number, price: number) => {
    // Handle purchase logic here
    console.log(`Purchasing ${quantity} interviews for $${price}`);
    // You would integrate with your payment processor here
  };

  const user = localStorage.getItem("name");

  const features = [
    {
      icon: Play,
      title: "Start Mock Interview",
      description: "Begin a new AI-powered interview session",
      action: "Start Now",
      onClick: handleStartInterview,
      primary: true,
    },
    {
      icon: ShoppingCart,
      title: "Purchase Interviews",
      description: "Buy additional interview sessions with special offers",
      action: "Buy Now",
      onClick: () => setShowPurchaseModal(true),
      primary: false,
    },
    {
      icon: BookOpen,
      title: "Interview History",
      description: "Review your past interview performances",
      action: "View History",
      onClick: () => {},
    },
    {
      icon: MessageSquare,
      title: "Soft Skills Questions",
      description:
        "Practice commonly asked behavioral and communication questions",
      action: "Coming soon",
      onClick: () => {},
    },
    {
      icon: Briefcase,
      title: "Top Company Interview Questions",
      description: "Practice commonly asked questions for your role",
      action: "Coming soon",
      onClick: () => {},
    },
  ];

  return (
    <div className="flex-1 h-full p-4 lg:p-8 overflow-y-auto pb-20 lg:pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto w-full"
      >
        <div className="mb-12">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome back, {user || "User"}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ready to practice and improve your interview skills?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 ${
                feature.primary ? "ring-2 ring-blue-500 ring-opacity-50" : ""
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    feature.primary
                      ? "bg-gradient-to-r from-blue-600 to-purple-600"
                      : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  <feature.icon
                    className={`w-6 h-6 ${
                      feature.primary
                        ? "text-white"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>

              <Button
                onClick={feature.onClick}
                variant={feature.primary ? "primary" : "outline"}
                className="w-full"
              >
                {feature.action}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Quick Tips - Responsive positioning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-4 lg:p-6"
        >
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Tips for Success
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                STAR
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use the STAR method for behavioral questions
              </p>
            </div>
            <div className="text-center">
              <div className="text-xl lg:text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                2-3 min
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ideal response length for most questions
              </p>
            </div>
            <div className="text-center">
              <div className="text-xl lg:text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                Practice
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Regular practice leads to better performance
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {showPurchaseModal && (
        <PurchaseModal
          onClose={() => setShowPurchaseModal(false)}
          onPurchase={handlePurchase}
        />
      )}
    </div>
  );
};
