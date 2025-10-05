import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center space-x-2 text-sm mb-6">
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <Home size={16} />
        <span>Home</span>
      </button>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={16} className="text-gray-400 dark:text-gray-600" />
          {item.path && index < items.length - 1 ? (
            <button
              onClick={() => navigate(item.path!)}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-gray-900 dark:text-white font-medium">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
