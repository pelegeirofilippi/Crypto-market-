import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { CryptoData } from '../types';
import { formatCurrency, formatPercentage, formatNumber } from '../utils/formatters';

interface CryptoTableProps {
  cryptoData: CryptoData[];
  loading: boolean;
  onCryptoSelect: (crypto: CryptoData) => void;
  onAddToPortfolio: (crypto: CryptoData, amount: number) => void;
}

type SortField = 'market_cap_rank' | 'current_price' | 'price_change_percentage_24h' | 'market_cap' | 'total_volume';
type SortDirection = 'asc' | 'desc';

export const CryptoTable: React.FC<CryptoTableProps> = ({
  cryptoData,
  loading,
  onCryptoSelect,
  onAddToPortfolio
}) => {
  const [sortField, setSortField] = useState<SortField>('market_cap_rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoData | null>(null);
  const [amount, setAmount] = useState('');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...cryptoData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleAddToPortfolio = () => {
    if (selectedCrypto && amount) {
      onAddToPortfolio(selectedCrypto, parseFloat(amount));
      setShowAddModal(false);
      setAmount('');
      setSelectedCrypto(null);
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Market Data
          </h2>
        </div>
        <div className="card-content">
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card animate-fade-in">
        <div className="card-header">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Market Data
          </h2>
        </div>
        <div className="card-content">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th 
                    className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
                    onClick={() => handleSort('market_cap_rank')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>#</span>
                      <SortIcon field="market_cap_rank" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600 dark:text-gray-400">
                    Name
                  </th>
                  <th 
                    className="text-right py-3 px-2 font-medium text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
                    onClick={() => handleSort('current_price')}
                  >
                    <div className="flex items-center justify-end space-x-1">
                      <span>Price</span>
                      <SortIcon field="current_price" />
                    </div>
                  </th>
                  <th 
                    className="text-right py-3 px-2 font-medium text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
                    onClick={() => handleSort('price_change_percentage_24h')}
                  >
                    <div className="flex items-center justify-end space-x-1">
                      <span>24h %</span>
                      <SortIcon field="price_change_percentage_24h" />
                    </div>
                  </th>
                  <th 
                    className="text-right py-3 px-2 font-medium text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors hidden md:table-cell"
                    onClick={() => handleSort('market_cap')}
                  >
                    <div className="flex items-center justify-end space-x-1">
                      <span>Market Cap</span>
                      <SortIcon field="market_cap" />
                    </div>
                  </th>
                  <th 
                    className="text-right py-3 px-2 font-medium text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors hidden lg:table-cell"
                    onClick={() => handleSort('total_volume')}
                  >
                    <div className="flex items-center justify-end space-x-1">
                      <span>Volume</span>
                      <SortIcon field="total_volume" />
                    </div>
                  </th>
                  <th className="text-center py-3 px-2 font-medium text-gray-600 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((crypto) => (
                  <tr 
                    key={crypto.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => onCryptoSelect(crypto)}
                  >
                    <td className="py-4 px-2 text-gray-600 dark:text-gray-400">
                      {crypto.market_cap_rank}
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={crypto.image} 
                          alt={crypto.name}
                          className="h-8 w-8 rounded-full"
                        />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {crypto.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 uppercase">
                            {crypto.symbol}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-right font-medium text-gray-900 dark:text-white">
                      {formatCurrency(crypto.current_price)}
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className={`flex items-center justify-end space-x-1 ${
                        crypto.price_change_percentage_24h >= 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {crypto.price_change_percentage_24h >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="font-medium">
                          {formatPercentage(crypto.price_change_percentage_24h)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-right text-gray-600 dark:text-gray-400 hidden md:table-cell">
                      {formatCurrency(crypto.market_cap)}
                    </td>
                    <td className="py-4 px-2 text-right text-gray-600 dark:text-gray-400 hidden lg:table-cell">
                      {formatNumber(crypto.total_volume)}
                    </td>
                    <td className="py-4 px-2 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCrypto(crypto);
                          setShowAddModal(true);
                        }}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                        title="Add to portfolio"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add to Portfolio Modal */}
      {showAddModal && selectedCrypto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Add {selectedCrypto.name} to Portfolio
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  step="0.00000001"
                  min="0"
                />
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Current price: {formatCurrency(selectedCrypto.current_price)}
              </div>
              
              {amount && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total value: {formatCurrency(parseFloat(amount) * selectedCrypto.current_price)}
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setAmount('');
                  setSelectedCrypto(null);
                }}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToPortfolio}
                disabled={!amount || parseFloat(amount) <= 0}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Portfolio
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};