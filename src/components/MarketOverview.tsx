import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { CryptoData } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface MarketOverviewProps {
  cryptoData: CryptoData[];
  loading: boolean;
}

export const MarketOverview: React.FC<MarketOverviewProps> = ({ cryptoData, loading }) => {
  const calculateMarketStats = () => {
    if (!cryptoData.length) return null;
    
    const totalMarketCap = cryptoData.reduce((sum, crypto) => sum + crypto.market_cap, 0);
    const totalVolume = cryptoData.reduce((sum, crypto) => sum + crypto.total_volume, 0);
    const gainers = cryptoData.filter(crypto => crypto.price_change_percentage_24h > 0).length;
    const losers = cryptoData.filter(crypto => crypto.price_change_percentage_24h < 0).length;
    
    return {
      totalMarketCap,
      totalVolume,
      gainers,
      losers,
      totalCoins: cryptoData.length
    };
  };

  const stats = calculateMarketStats();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="card-content">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
      <div className="card hover:shadow-xl transition-shadow duration-300">
        <div className="card-content">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Market Cap
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats.totalMarketCap)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="card hover:shadow-xl transition-shadow duration-300">
        <div className="card-content">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                24h Volume
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats.totalVolume)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <Activity className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="card hover:shadow-xl transition-shadow duration-300">
        <div className="card-content">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Gainers
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.gainers}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatPercentage((stats.gainers / stats.totalCoins) * 100)} of total
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="card hover:shadow-xl transition-shadow duration-300">
        <div className="card-content">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Losers
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {stats.losers}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatPercentage((stats.losers / stats.totalCoins) * 100)} of total
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
              <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};