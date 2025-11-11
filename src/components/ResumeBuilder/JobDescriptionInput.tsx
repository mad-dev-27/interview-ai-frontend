import { useState } from 'react';
import { Button } from '../ui/Button';
import { X, Sparkles } from 'lucide-react';

interface JobDescriptionInputProps {
  onClose: () => void;
  onOptimize: (jobDescription?: string) => void;
  isLoading: boolean;
}

export function JobDescriptionInput({ onClose, onOptimize, isLoading }: JobDescriptionInputProps) {
  const [jobDescription, setJobDescription] = useState('');

  const handleOptimize = () => {
    onOptimize(jobDescription.trim() || undefined);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              AI-Powered Resume Optimization
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Paste a job description below to customize your resume for that specific role. Our AI will:
            </p>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Analyze the job requirements and extract key skills and keywords</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Optimize your resume content to be more ATS-friendly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Suggest improvements to match the job description</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Provide an ATS compatibility score</span>
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Job Description (Optional)
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here, or leave empty for general ATS optimization..."
              rows={10}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Leave empty to get general ATS optimization without job-specific customization
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <Button onClick={onClose} variant="outline" disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleOptimize} disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Optimize Resume
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
