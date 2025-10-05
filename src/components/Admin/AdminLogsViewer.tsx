import React, { useState } from 'react';
import { Search, Activity, Monitor, Globe } from 'lucide-react';
import { Input } from '../ui/Input';

interface AdminLog {
  id: string;
  originIp: string;
  originBrowser: string;
  originOs: string;
  originPlatform: string;
  rawUserAgent: string;
  changeUserId: string;
  changedValue: number;
  createdAt: string;
}

export const AdminLogsViewer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [logs, setLogs] = useState<AdminLog[]>([]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Activity className="w-7 h-7 text-orange-600 dark:text-orange-400" />
          Admin Activity Logs
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Monitor admin actions and system changes
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search logs by IP, user, or action..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-4">
        {logs.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No admin logs found. Database integration required.
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={log.id}
              className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-mono text-sm text-gray-900 dark:text-white">
                      {log.originIp}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full">
                      {log.originBrowser}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <Monitor className="w-4 h-4 inline mr-1" />
                    {log.originOs} - {log.originPlatform}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Modified User: {log.changeUserId} | Value: {log.changedValue}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
