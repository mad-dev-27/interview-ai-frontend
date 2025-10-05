import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  to?: string;
  label?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  to = "/dashboard",
  label = "Back"
}) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6 group"
    >
      <ArrowLeft
        size={20}
        className="group-hover:-translate-x-1 transition-transform duration-200"
      />
      <span className="font-medium">{label}</span>
    </button>
  );
};
