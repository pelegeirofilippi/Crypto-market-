import React, { useState } from 'react';
import { Plus, Trash2, Bell, BellOff } from 'lucide-react';
import { Alert, CryptoData } from '../types';
import { formatCurrency } from '../utils/formatters';

interface AlertsPanelProps {
  cryptoData: CryptoData[];
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ cryptoData }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [alertType, setAlertType] = useState<Alert['type']>('price_above');
  const [alertValue, setAlertValue] = useState('');

  const createAlert = () => {
    if (!selectedCrypto || !alertValue) return;

    const crypto = cryptoData.find(c => c.id === selectedCrypto);
    if (!crypto) return;

    const newAlert: Alert = {
      id: Date.now().toString(),
      cryptoId: crypto.id,
      symbol: crypto.symbol,
      name: crypto.name,
      type: alertType,
      value: parseFloat(alertValue),
      isActive: true,
      createdAt: new Date().toISOString()
    };

    setAlerts([...alerts, newAlert]);
    setShowCreateModal(false);
    setSelectedCrypto('');
    setAlertValue('');
  };

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const getAlertDescription = (alert: Alert) => {
    const crypto = cryptoData.find(c => c.id === alert.cryptoId);
    const currentPrice = crypto?.current_price || 0;
    
    switch (alert.type) {
      case 'price_above':
        return `Alert when ${alert.symbol.toUpperCase()} goes above ${formatCurrency(alert.value)}`;
      case 'price_below':
        return `Alert when ${alert.symbol.toUpperCase()} goes below ${formatCurrency(alert.value)}`;
      case 'change_above':
        return `Alert when ${alert.symbol.toUpperCase()} changes more than +${alert.value}%`;
      case 'change_below':
        return `Alert when ${alert.symbol.toUpperCase()} changes more than ${alert.value}%`;
      default:
        return '';
    }
  };

  const isAlertTriggered = (alert: Alert) => {
    const crypto = cryptoData.find(c => c.id === alert.cryptoId);
    if (!crypto) return false;

    switch (alert.type) {
      case 'price_above':
        return crypto.current_price > alert.value;
      case 'price_below':
        return crypto.current_price < alert.value;
      case 'change_above':
        return crypto.price_change_percentage_24h > alert.value;
      case 'change_below':
        return crypto.price_change_percentage_24h < alert.value;
      default:
        return false;
    }
  };

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Price Alerts
          </h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Alert</span>
          </button>
        </div>

        {alerts.length === 0 ? (
          <div className="card">
            <div className="card-content text-center py-12">
              <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Alerts Set
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create your first price alert to stay informed about market movements.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary"
              >
                Create Your First Alert
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {alerts.map((alert) => {
              const isTriggered = isAlertTriggered(alert);
              const crypto = cryptoData.find(c => c.id === alert.cryptoId);
              
              return (
                <div 
                  key={alert.id}
                  className={`card ${isTriggered ? 'ring-2 ring-orange-500 dark:ring-orange-400' : ''}`}
                >
                  <div className="card-content">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {crypto && (
                          <img 
                            src={crypto.image} 
                            alt={crypto.name}
                            className="h-10 w-10 rounded-full"
                          />
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {alert.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {getAlertDescription(alert)}
                          </p>
                          {crypto && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Current: {formatCurrency(crypto.current_price)} 
                              ({crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                              {crypto.price_change_percentage_24h.toFixed(2)}%)
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {isTriggered && (
                          <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs font-medium rounded-full">
                            Triggered
                          </span>
                        )}
                        
                        <button
                          onClick={() => toggleAlert(alert.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            alert.isActive
                              ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900'
                              : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                          title={alert.isActive ? 'Disable alert' : 'Enable alert'}
                        >
                          {alert.isActive ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                        </button>
                        
                        <button
                          onClick={() => deleteAlert(alert.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                          title="Delete alert"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Alert Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Create Price Alert
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cryptocurrency
                </label>
                <select
                  value={selectedCrypto}
                  onChange={(e) => setSelectedCrypto(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select a cryptocurrency</option>
                  {cryptoData.slice(0, 20).map((crypto) => (
                    <option key={crypto.id} value={crypto.id}>
                      {crypto.name} ({crypto.symbol.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Alert Type
                </label>
                <select
                  value={alertType}
                  onChange={(e) => setAlertType(e.target.value as Alert['type'])}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="price_above">Price goes above</option>
                  <option value="price_below">Price goes below</option>
                  <option value="change_above">24h change above (%)</option>
                  <option value="change_below">24h change below (%)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {alertType.includes('price') ? 'Price' : 'Percentage'} Value
                </label>
                <input
                  type="number"
                  value={alertValue}
                  onChange={(e) => setAlertValue(e.target.value)}
                  placeholder={alertType.includes('price') ? 'Enter price' : 'Enter percentage'}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  step={alertType.includes('price') ? '0.01' : '0.1'}
                  min="0"
                />
              </div>
              
              {selectedCrypto && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {(() => {
                    const crypto = cryptoData.find(c => c.id === selectedCrypto);
                    return crypto ? (
                      <div>
                        Current price: {formatCurrency(crypto.current_price)}<br />
                        24h change: {crypto.price_change_percentage_24h.toFixed(2)}%
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setSelectedCrypto('');
                  setAlertValue('');
                }}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={createAlert}
                disabled={!selectedCrypto || !alertValue}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};