import React from "react";
import { motion } from "framer-motion";
import { Brain, User, LogOut, LogInIcon } from "lucide-react";
import { ThemeToggle } from "../ui/ThemeToggle";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export const Header: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const user = Cookies.get("auth");

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="flex-shrink-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="lg:text-xl sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              InterviewAI
            </span>
          </motion.div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {"Hi, " + localStorage.getItem("name") || "Hi, User"}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut size={16} />
                </Button>
              </div>
            ) : (
              <Button
                className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigate("/auth");
                }}
              >
                <LogInIcon size={20} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};
