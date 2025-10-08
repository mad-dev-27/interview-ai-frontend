import { ATSAnalysis } from '../../types/resumeTypes';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ATSScoreCardProps {
  analysis: ATSAnalysis;
}

export function ATSScoreCard({ analysis }: ATSScoreCardProps) {
  const { score, keywordMatches, suggestions } = analysis;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 60) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">ATS Score Analysis</h3>
        <div className="flex items-center gap-3">
          <div className={`text-5xl font-bold ${getScoreColor(score)}`}>{score}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">/ 100</div>
        </div>
      </div>

      <div className="mb-6">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${getScoreGradient(score)} transition-all duration-500`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-gray-900 dark:text-white">Matched Keywords</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {keywordMatches.matched.length > 0 ? (
              keywordMatches.matched.map((keyword, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No matched keywords</p>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="w-5 h-5 text-red-600" />
            <h4 className="font-semibold text-gray-900 dark:text-white">Missing Keywords</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {keywordMatches.missing.length > 0 ? (
              keywordMatches.missing.map((keyword, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">All keywords matched</p>
            )}
          </div>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-gray-900 dark:text-white">Suggestions for Improvement</h4>
          </div>
          <ul className="space-y-2">
            {suggestions.map((suggestion, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="text-blue-600 mt-1">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
