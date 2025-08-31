import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "../components/Layout/Header";
import { Sidebar } from "../components/Dashboard/Sidebar";
import { Calendar, CreditCard, CheckCircle, XCircle, Clock, IndianRupee } from "lucide-react";
import { Button } from "../components/ui/Button";

interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  currency: string;
  description: string;
  status: "completed" | "pending" | "failed" | "refunded";
  paymentMethod: string;
  transactionId: string;
  interviewsAdded: number;
}

const PaymentHistory: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPayments([
        {
          id: "1",
          date: "2025-01-15",
          amount: 150,
          currency: "INR",
          description: "1 Interview Session",
          status: "completed",
          paymentMethod: "UPI",
          transactionId: "TXN123456789",
          interviewsAdded: 1,
        },
        {
          id: "2",
          date: "2025-01-10",
          amount: 450,
          currency: "INR",
          description: "3 Interview Sessions (Bundle)",
          status: "completed",
          paymentMethod: "Credit Card",
          transactionId: "TXN987654321",
          interviewsAdded: 3,
        },
        {
          id: "3",
          date: "2025-01-05",
          amount: 150,
          currency: "INR",
          description: "1 Interview Session",
          status: "failed",
          paymentMethod: "UPI",
          transactionId: "TXN456789123",
          interviewsAdded: 0,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const sidebarData = {
    recentInterviews: 3,
    freeInterviewsLeft: 1,
    totalInterviews: 5,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case "refunded":
        return <XCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "refunded":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const totalSpent = payments
    .filter(p => p.status === "completed")
    .reduce((acc, payment) => acc + payment.amount, 0);

  const totalInterviewsPurchased = payments
    .filter(p => p.status === "completed")
    .reduce((acc, payment) => acc + payment.interviewsAdded, 0);

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        <Sidebar {...sidebarData} />
        
        <div className="flex-1 h-full p-4 lg:p-8 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto w-full"
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Payment History
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track your purchases and transaction history
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                    <IndianRupee className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ₹{totalSpent}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Transactions</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {payments.length}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Interviews Purchased</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {totalInterviewsPurchased}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Payment Records */}
            <div className="space-y-4">
              {payments.map((payment, index) => (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(payment.status)}
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {payment.description}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar size={16} />
                          <span>{new Date(payment.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CreditCard size={16} />
                          <span>{payment.paymentMethod}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs">ID: {payment.transactionId}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          ₹{payment.amount}
                        </div>
                        {payment.interviewsAdded > 0 && (
                          <div className="text-sm text-green-600 dark:text-green-400">
                            +{payment.interviewsAdded} interview{payment.interviewsAdded > 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                      
                      <Button variant="outline" size="sm">
                        Download Receipt
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;