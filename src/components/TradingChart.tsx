import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CryptoData, ChartData } from '../types';
import { formatCurrency } from '../utils/formatters';

interface TradingChartProps {
  crypto: CryptoData;
}

export const TradingChart: React.FC<TradingChartProps> = ({ crypto }) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [timeframe, setTimeframe] = useState<'1D' | '7D' | '30D'>('7D');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateMockChartData();
  }, [crypto, timeframe]);

  const generateMockChartData = () => {
    setLoading(true);
    
    // Generate mock historical data based on current price and timeframe
    const dataPoints = timeframe === '1D' ? 24 : timeframe === '7D' ? 168 : 720;
    const basePrice = crypto.current_price;
    const volatility = 0.05; // 5% volatility
    
    const data: ChartData[] = [];
    const now = Date.now();
    const interval = timeframe === '1D' ? 3600000 : timeframe === '7D' ? 3600000 : 3600000; // 1 hour intervals
    
    for (let i = dataPoints; i >= 0; i--) {
      const timestamp = now - (i * interval);
      const randomChange = (Math.random() - 0.5) * volatility;
      const price = basePrice * (1 + randomChange * (i / dataPoints));
      const volume = Math.random() * 1000000000; // Random volume
      
      data.push({
        timestamp,
        price: Math.max(price, 0.01), // Ensure price is positive
        volume
      });
    }
    
    setChartData(data);
    setLoading(false);
  };

  const formatXAxis = (timestamp: number) => {
    const date = new Date(timestamp);
    if (timeframe === '1D') {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {new Date(label).toLocaleString()}
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatCurrency(data.price)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Volume: {(data.volume / 1000000).toFixed(2)}M
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {crypto.name} Price Chart
          </h3>
        </div>
        <div className="card-content">
          <div className="h-80 flex items-center justify-center">
            <div className="animate-pulse text-gray-500 dark:text-gray-400">
              Loading chart data...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card animate-fade-in">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {crypto.name} Price Chart
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Current: {formatCurrency(crypto.current_price)}
            </p>
          </div>
          
          <div className="flex space-x-2">
            {(['1D', '7D', '30D'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  timeframe === tf
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="card-content">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="timestamp"
                tickFormatter={formatXAxis}
                axisLine={false}
                tickLine={false}
                className="text-xs text-gray-600 dark:text-gray-400"
              />
              <YAxis 
                tickFormatter={(value) => `$${value.toFixed(2)}`}
                axisLine={false}
                tickLine={false}
                className="text-xs text-gray-600 dark:text-gray-400"
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#3B82F6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};