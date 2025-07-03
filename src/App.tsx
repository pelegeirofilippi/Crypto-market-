import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MarketOverview } from './components/MarketOverview';
import { CryptoTable } from './components/CryptoTable';
import { Portfolio } from './components/Portfolio';
import { TradingChart } from './components/TradingChart';
import { NewsSection } from './components/NewsSection';
import { AlertsPanel } from './components/AlertsPanel';
import { useCryptoData } from './hooks/useCryptoData';
import { usePortfolio } from './hooks/usePortfolio';
import { CryptoData, PortfolioItem } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'portfolio' | 'alerts'>('dashboard');
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoData | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  
  const { cryptoData, loading, error, refreshData } = useCryptoData();
  const { portfolio, addToPortfolio, removeFromPortfolio, updatePortfolioItem } = usePortfolio();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleCryptoSelect = (crypto: CryptoData) => {
    setSelectedCrypto(crypto);
  };

  const handleAddToPortfolio = (crypto: CryptoData, amount: number) => {
    const portfolioItem: PortfolioItem = {
      id: crypto.id,
      symbol: crypto.symbol,
      name: crypto.name,
      amount,
      purchasePrice: crypto.current_price,
      currentPrice: crypto.current_price,
      image: crypto.image
    };
    addToPortfolio(portfolioItem);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Error Loading Data
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button 
            onClick={refreshData}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>
      <Header 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onRefresh={refreshData}
      />
      
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <MarketOverview cryptoData={cryptoData} loading={loading} />
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 space-y-8">
                <CryptoTable 
                  cryptoData={cryptoData}
                  loading={loading}
                  onCryptoSelect={handleCryptoSelect}
                  onAddToPortfolio={handleAddToPortfolio}
                />
                
                {selectedCrypto && (
                  <TradingChart crypto={selectedCrypto} />
                )}
              </div>
              
              <div className="space-y-8">
                <NewsSection />
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'portfolio' && (
          <Portfolio 
            portfolio={portfolio}
            cryptoData={cryptoData}
            onRemoveItem={removeFromPortfolio}
            onUpdateItem={updatePortfolioItem}
          />
        )}
        
        {activeTab === 'alerts' && (
          <AlertsPanel cryptoData={cryptoData} />
        )}
      </main>
    </div>
  );
}

export default App;