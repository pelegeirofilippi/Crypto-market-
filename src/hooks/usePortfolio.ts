import { useState, useEffect } from 'react';
import { PortfolioItem } from '../types';

export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);

  // Load portfolio from localStorage on mount
  useEffect(() => {
    const savedPortfolio = localStorage.getItem('cryptoPortfolio');
    if (savedPortfolio) {
      try {
        setPortfolio(JSON.parse(savedPortfolio));
      } catch (error) {
        console.error('Error loading portfolio from localStorage:', error);
      }
    }
  }, []);

  // Save portfolio to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cryptoPortfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  const addToPortfolio = (item: PortfolioItem) => {
    setPortfolio(prev => {
      const existingIndex = prev.findIndex(p => p.id === item.id);
      
      if (existingIndex >= 0) {
        // If item already exists, update the amount and average the purchase price
        const existing = prev[existingIndex];
        const totalAmount = existing.amount + item.amount;
        const totalValue = (existing.amount * existing.purchasePrice) + (item.amount * item.purchasePrice);
        const averagePrice = totalValue / totalAmount;
        
        const updated = [...prev];
        updated[existingIndex] = {
          ...existing,
          amount: totalAmount,
          purchasePrice: averagePrice
        };
        return updated;
      } else {
        // Add new item
        return [...prev, item];
      }
    });
  };

  const removeFromPortfolio = (id: string) => {
    setPortfolio(prev => prev.filter(item => item.id !== id));
  };

  const updatePortfolioItem = (id: string, updates: Partial<PortfolioItem>) => {
    setPortfolio(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const clearPortfolio = () => {
    setPortfolio([]);
  };

  return {
    portfolio,
    addToPortfolio,
    removeFromPortfolio,
    updatePortfolioItem,
    clearPortfolio
  };
};