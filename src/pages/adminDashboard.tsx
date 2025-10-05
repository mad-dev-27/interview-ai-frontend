import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  CreditCard,
  FileText,
  HelpCircle,
  DollarSign,
  Activity,
  Menu,
  X,
  LogOut,
  Shield,
} from 'lucide-react';
import { UsersManagement } from '../components/Admin/UsersManagement';
import { PaymentsManagement } from '../components/Admin/PaymentsManagement';
import { InterviewsManagement } from '../components/Admin/InterviewsManagement';
import { QuestionsManagement } from '../components/Admin/QuestionsManagement';
import { PricesManagement } from '../components/Admin/PricesManagement';
import { AdminLogsViewer } from '../components/Admin/AdminLogsViewer';

type Tab = 'users' | 'payments' | 'interviews' | 'questions' | 'prices' | 'logs';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'users' as Tab, label: 'Users', icon: Users },
    { id: 'payments' as Tab, label: 'Payments', icon: CreditCard },
    { id: 'interviews' as Tab, label: 'Interviews', icon: FileText },
    { id: 'questions' as Tab, label: 'Questions & Answers', icon: HelpCircle },
    { id: 'prices' as Tab, label: 'Pricing', icon: DollarSign },
    { id: 'logs' as Tab, label: 'Admin Logs', icon: Activity },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UsersManagement />;
      case 'payments':
        return <PaymentsManagement />;
      case 'interviews':
        return <InterviewsManagement />;
      case 'questions':
        return <QuestionsManagement />;
      case 'prices':
        return <PricesManagement />;
      case 'logs':
        return <AdminLogsViewer />;
      default:
        return <UsersManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex">
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Admin Panel
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Management System</p>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) {
                    setIsSidebarOpen(false);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              window.location.href = '/';
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </motion.aside>

      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'lg:ml-64' : 'ml-0'
        }`}
      >
        <header className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-40">
          <div className="px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Administrator
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Full Access
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
