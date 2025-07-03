import React, { useState, useEffect } from 'react';
import { ExternalLink, Clock } from 'lucide-react';
import { NewsItem } from '../types';

export const NewsSection: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate mock news data
    const mockNews: NewsItem[] = [
      {
        id: '1',
        title: 'Bitcoin Reaches New All-Time High Amid Institutional Adoption',
        description: 'Major corporations continue to add Bitcoin to their treasury reserves, driving unprecedented demand.',
        url: '#',
        source: 'CryptoNews',
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        image: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: '2',
        title: 'Ethereum 2.0 Staking Rewards Attract More Validators',
        description: 'The network sees increased participation as staking rewards remain attractive to investors.',
        url: '#',
        source: 'BlockchainDaily',
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        image: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: '3',
        title: 'DeFi Protocol Launches Revolutionary Yield Farming Strategy',
        description: 'New automated market maker promises higher yields with reduced impermanent loss risks.',
        url: '#',
        source: 'DeFi Weekly',
        publishedAt: new Date(Date.now() - 10800000).toISOString(),
        image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: '4',
        title: 'Central Bank Digital Currencies Gain Momentum Globally',
        description: 'Multiple countries announce pilot programs for their digital currency initiatives.',
        url: '#',
        source: 'Financial Times',
        publishedAt: new Date(Date.now() - 14400000).toISOString(),
        image: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: '5',
        title: 'NFT Market Shows Signs of Recovery After Recent Downturn',
        description: 'Trading volumes increase as new utility-focused projects enter the market.',
        url: '#',
        source: 'NFT Insider',
        publishedAt: new Date(Date.now() - 18000000).toISOString(),
        image: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=400'
      }
    ];

    setTimeout(() => {
      setNews(mockNews);
      setLoading(false);
    }, 1000);
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Latest News
          </h3>
        </div>
        <div className="card-content">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex space-x-3">
                  <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card animate-fade-in">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Latest News
        </h3>
      </div>
      <div className="card-content">
        <div className="space-y-4">
          {news.map((article) => (
            <article 
              key={article.id}
              className="group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors"
            >
              <div className="flex space-x-3">
                {article.image && (
                  <img 
                    src={article.image}
                    alt={article.title}
                    className="h-16 w-16 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {article.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{article.source}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimeAgo(article.publishedAt)}</span>
                      </div>
                    </div>
                    <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};