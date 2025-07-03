import React, { useState } from 'react';
import { Trash2, Edit3, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { PortfolioItem, CryptoData } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface PortfolioProps {
  portfolio: PortfolioItem[];
  cryptoData: CryptoData[];
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, updates: Partial<PortfolioItem>) => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({
  portfolio,
  cryptoData,
  onRemoveItem,
  onUpdateItem
}) => {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');

  const updatePortfolioWithCurrentPrices = () => {
    return portfolio.map(item => {
      const currentData = cryptoData.find(crypto => crypto.id === item.id);
      return {
        ...item,
        currentPrice: currentData?.current_price || item.currentPrice
      };
    });
  };

  const updatedPortfolio = updatePortfolioWithCurrentPrices();

  const calculatePortfolioStats = () => {
    const totalValue = updatedPortfolio.reduce((sum, item) => 
      sum + (item.amount * item.currentPrice), 0
    );
    
    const totalCost = updatedPortfolio.reduce((sum, item) => 
      sum + (item.amount * item.purchasePrice), 0
    );
    
    const totalGainLoss = totalValue - totalCost;
    const totalGainLossPercentage = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;
    
    return {
      totalValue,
      totalCost,
      totalGainLoss,
      totalGainLossPercentage
    };
  };

  const stats = calculatePortfolioStats();

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item.id);
    setEditAmount(item.amount.toString());
  };

  const handleSaveEdit = (id: string) => {
    const newAmount = parseFloat(editAmount);
    if (newAmount > 0) {
      onUpdateItem(id, { amount: newAmount });
    }
    setEditingItem(null);
    setEditAmount('');
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditAmount('');
  };

  if (portfolio.length === 0) {
    return (
      <div className="card animate-fade-in">
        <div className="card-content text-center py-12">
          <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Your Portfolio is Empty
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Start building your portfolio by adding cryptocurrencies from the dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Value
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(stats.totalValue)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Cost
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(stats.totalCost)}
                </p>
              </div>
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
                <DollarSign className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total P&L
                </p>
                <p className={`text-2xl font-bold ${
                  stats.totalGainLoss >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {formatCurrency(stats.totalGainLoss)}
                </p>
                <p className={`text-sm ${
                  stats.totalGainLoss >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {formatPercentage(stats.totalGainLossPercentage)}
                </p>
              </div>
              <div className={`p-3 rounded-full ${
                stats.totalGainLoss >= 0 
                  ? 'bg-green-100 dark:bg-green-900' 
                  : 'bg-red-100 dark:bg-red-900'
              }`}>
                {stats.totalGainLoss >= 0 ? (
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Holdings */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Holdings
          </h2>
        </div>
        <div className="card-content">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">
                    Asset
                  </th>
                  <th className="text-right py-3 px-2 font-medium text-gray-600 dark:text-gray-400">
                    Amount
                  </th>
                  <th className="text-right py-3 px-2 font-medium text-gray-600 dark:text-gray-400">
                    Avg. Price
                  </th>
                  <th className="text-right py-3 px-2 font-medium text-gray-600 dark:text-gray-400">
                    Current Price
                  </th>
                  <th className="text-right py-3 px-2 font-medium text-gray-600 dark:text-gray-400">
                    Value
                  </th>
                  <th className="text-right py-3 px-2 font-medium text-gray-600 dark:text-gray-400">
                    P&L
                  </th>
                  <th className="text-center py-3 px-2 font-medium text-gray-600 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {updatedPortfolio.map((item) => {
                  const currentValue = item.amount * item.currentPrice;
                  const costBasis = item.amount * item.purchasePrice;
                  const gainLoss = currentValue - costBasis;
                  const gainLossPercentage = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0;

                  return (
                    <tr 
                      key={item.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="py-4 px-2">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="h-8 w-8 rounded-full"
                          />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {item.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 uppercase">
                              {item.symbol}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-right">
                        {editingItem === item.id ? (
                          <input
                            type="number"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            className="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-right"
                            step="0.00000001"
                            min="0"
                          />
                        ) : (
                          <span className="font-medium text-gray-900 dark:text-white">
                            {item.amount.toFixed(8)}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-2 text-right text-gray-600 dark:text-gray-400">
                        {formatCurrency(item.purchasePrice)}
                      </td>
                      <td className="py-4 px-2 text-right font-medium text-gray-900 dark:text-white">
                        {formatCurrency(item.currentPrice)}
                      </td>
                      <td className="py-4 px-2 text-right font-medium text-gray-900 dark:text-white">
                        {formatCurrency(currentValue)}
                      </td>
                      <td className="py-4 px-2 text-right">
                        <div className={`${
                          gainLoss >= 0 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          <div className="font-medium">
                            {formatCurrency(gainLoss)}
                          </div>
                          <div className="text-sm">
                            {formatPercentage(gainLossPercentage)}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          {editingItem === item.id ? (
                            <>
                              <button
                                onClick={() => handleSaveEdit(item.id)}
                                className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900 rounded transition-colors"
                                title="Save"
                              >
                                ✓
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="p-1 text-gray-600 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
                                title="Cancel"
                              >
                                ✕
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(item)}
                                className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900 rounded transition-colors"
                                title="Edit amount"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => onRemoveItem(item.id)}
                                className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
                                title="Remove from portfolio"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};