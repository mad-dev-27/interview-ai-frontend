import React, { useState } from 'react';
import { Search, HelpCircle } from 'lucide-react';
import { Input } from '../ui/Input';

export const QuestionsManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-7 h-7 text-purple-600 dark:text-purple-400" />
          Questions & Answers Management
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View and manage interview questions and answers
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No questions found. Database integration required.
      </div>
    </div>
  );
};
