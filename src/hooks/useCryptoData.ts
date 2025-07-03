import { useState, useEffect } from 'react';
import { CryptoData } from '../types';

export const useCryptoData = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateMockData = (): CryptoData[] => {
    const cryptos = [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
      { id: 'ethereum', name: 'Ethereum', symbol: 'eth', image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
      { id: 'binancecoin', name: 'BNB', symbol: 'bnb', image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png' },
      { id: 'solana', name: 'Solana', symbol: 'sol', image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
      { id: 'cardano', name: 'Cardano', symbol: 'ada', image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png' },
      { id: 'ripple', name: 'XRP', symbol: 'xrp', image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png' },
      { id: 'polkadot', name: 'Polkadot', symbol: 'dot', image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png' },
      { id: 'dogecoin', name: 'Dogecoin', symbol: 'doge', image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png' },
      { id: 'avalanche-2', name: 'Avalanche', symbol: 'avax', image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png' },
      { id: 'chainlink', name: 'Chainlink', symbol: 'link', image: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png' },
      { id: 'polygon', name: 'Polygon', symbol: 'matic', image: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png' },
      { id: 'litecoin', name: 'Litecoin', symbol: 'ltc', image: 'https://assets.coingecko.com/coins/images/2/large/litecoin.png' },
      { id: 'uniswap', name: 'Uniswap', symbol: 'uni', image: 'https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png' },
      { id: 'stellar', name: 'Stellar', symbol: 'xlm', image: 'https://assets.coingecko.com/coins/images/100/large/Stellar_symbol_black_RGB.png' },
      { id: 'vechain', name: 'VeChain', symbol: 'vet', image: 'https://assets.coingecko.com/coins/images/1167/large/VeChain-Logo-768x725.png' }
    ];

    return cryptos.map((crypto, index) => {
      const basePrice = Math.random() * 50000 + 100;
      const change24h = (Math.random() - 0.5) * 20;
      const marketCap = basePrice * (Math.random() * 1000000000 + 100000000);
      
      return {
        ...crypto,
        current_price: basePrice,
        market_cap: marketCap,
        market_cap_rank: index + 1,
        fully_diluted_valuation: marketCap * 1.2,
        total_volume: marketCap * 0.1,
        high_24h: basePrice * 1.05,
        low_24h: basePrice * 0.95,
        price_change_24h: (basePrice * change24h) / 100,
        price_change_percentage_24h: change24h,
        market_cap_change_24h: (marketCap * change24h) / 100,
        market_cap_change_percentage_24h: change24h,
        circulating_supply: marketCap / basePrice,
        total_supply: (marketCap / basePrice) * 1.1,
        max_supply: (marketCap / basePrice) * 1.2,
        ath: basePrice * (1 + Math.random()),
        ath_change_percentage: -Math.random() * 50,
        ath_date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        atl: basePrice * Math.random() * 0.1,
        atl_change_percentage: Math.random() * 1000,
        atl_date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        roi: null,
        last_updated: new Date().toISOString(),
        sparkline_in_7d: {
          price: Array.from({ length: 168 }, () => basePrice * (0.9 + Math.random() * 0.2))
        }
      };
    });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = generateMockData();
      setCryptoData(mockData);
    } catch (err) {
      setError('Failed to fetch cryptocurrency data');
      console.error('Error fetching crypto data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    cryptoData,
    loading,
    error,
    refreshData
  };
};