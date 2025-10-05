import React, { useState } from 'react';
import { Plus, CreditCard as Edit2, Trash2, DollarSign } from 'lucide-react';
import { Button } from '../ui/Button';
import { toast } from 'sonner';

interface Price {
  id: string;
  qty: number;
  price: number;
  originalPrice: number;
  savings: number;
  popular: boolean;
}

export const PricesManagement: React.FC = () => {
  const [prices, setPrices] = useState<Price[]>([]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            Pricing Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage pricing tiers and plans
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Price Tier
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {prices.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-gray-500 dark:text-gray-400">
            No pricing tiers found. Create your first pricing tier.
          </div>
        ) : (
          prices.map((price) => (
            <div
              key={price.id}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-800"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                  {price.qty} Interviews
                </span>
                {price.popular && (
                  <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                    Popular
                  </span>
                )}
              </div>
              <div className="mb-4">
                <p className="text-4xl font-bold text-gray-900 dark:text-white">
                  ₹{price.price}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
                  ₹{price.originalPrice}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                  Save ₹{price.savings}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 p-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 rounded-lg text-blue-700 dark:text-blue-400 transition-colors">
                  <Edit2 className="w-4 h-4 mx-auto" />
                </button>
                <button className="flex-1 p-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-lg text-red-700 dark:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
