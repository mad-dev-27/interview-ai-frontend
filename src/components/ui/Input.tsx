import React from "react";
import { cn } from "../../utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className,
  buttonLabel,
  onButtonClick,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        <input
          className={cn(
            "w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
            error && "border-red-500 focus:ring-red-500",
            buttonLabel && "pr-24", // extra padding so text doesn’t overlap button
            className
          )}
          {...props}
        />
        {buttonLabel && (
          <button
            type="button"
            onClick={onButtonClick}
            className="absolute right-2 px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {buttonLabel}
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};
