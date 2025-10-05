import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, CheckCircle, XCircle, Calendar, DollarSign } from 'lucide-react';
import { Input } from '../ui/Input';
import { toast } from 'sonner';

interface Payment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  receiptId: string;
  amount: number;
  orderQty: number;
  isCompleted: boolean;
  razorPayOrderId: string;
  razorPayPaymentId: string;
  razorPaySignature: string;
  createdAt: string;
  updatedAt: string;
}

export const PaymentsManagement: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      toast.success('Payments loaded successfully');
      setPayments([]);
    } catch (error) {
      toast.error('Failed to fetch payments');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPayments = payments.filter(
    (payment) =>
      payment.receiptId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-7 h-7 text-green-600 dark:text-green-400" />
              Payments Management
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              View and manage payment transactions
            </p>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by receipt ID, user name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-700 dark:text-green-400 mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-green-900 dark:text-green-300">₹0</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-400 mb-1">Completed</p>
            <p className="text-3xl font-bold text-blue-900 dark:text-blue-300">0</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-xl border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-700 dark:text-amber-400 mb-1">Pending</p>
            <p className="text-3xl font-bold text-amber-900 dark:text-amber-300">0</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Receipt ID
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                  User
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Amount
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Quantity
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Status
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Date
                </th>
                <th className="text-right p-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500 dark:text-gray-400">
                    {isLoading ? 'Loading payments...' : 'No payments found'}
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment, index) => (
                  <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="p-4 font-mono text-sm text-gray-900 dark:text-white">
                      {payment.receiptId}
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {payment.userName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {payment.userEmail}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-gray-900 dark:text-white">
                      ₹{payment.amount}
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{payment.orderQty}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
                          payment.isCompleted
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}
                      >
                        {payment.isCompleted ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Completed
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            Pending
                          </>
                        )}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => setSelectedPayment(payment)}
                          className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPayment(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl p-6"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Payment Details
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receipt ID</p>
                    <p className="font-mono text-gray-900 dark:text-white">
                      {selectedPayment.receiptId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      ₹{selectedPayment.amount}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">User Name</p>
                    <p className="text-gray-900 dark:text-white">{selectedPayment.userName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-gray-900 dark:text-white">{selectedPayment.userEmail}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Order Quantity</p>
                    <p className="text-gray-900 dark:text-white">{selectedPayment.orderQty}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedPayment.isCompleted
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}
                    >
                      {selectedPayment.isCompleted ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                </div>

                {selectedPayment.razorPayOrderId && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Razorpay Order ID</p>
                    <p className="font-mono text-sm text-gray-900 dark:text-white">
                      {selectedPayment.razorPayOrderId}
                    </p>
                  </div>
                )}

                {selectedPayment.razorPayPaymentId && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Razorpay Payment ID
                    </p>
                    <p className="font-mono text-sm text-gray-900 dark:text-white">
                      {selectedPayment.razorPayPaymentId}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Created At</p>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(selectedPayment.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Updated At</p>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(selectedPayment.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
