import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { searchStocks } from '../services/api';

interface StockSearchProps {
  onStockSelect: (symbol: string) => void;
  loading: boolean;
}

const StockSearch = ({ onStockSelect, loading }: StockSearchProps) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearching(true);
    try {
      const results = await searchStocks(query);
      setSearchResults(results.symbols || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSelect = (symbol: string) => {
    onStockSelect(symbol);
    setQuery('');
    setSearchResults([]);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value.toUpperCase())}
            placeholder="输入股票代码 (例如: AAPL, GOOGL, MSFT)"
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-lg placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {searching ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              '搜索'
            )}
          </button>
        </div>
      </form>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {searchResults.map((stock) => (
            <button
              key={stock.symbol}
              onClick={() => handleSelect(stock.symbol)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700 last:border-b-0"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {stock.symbol}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stock.name}
                  </div>
                </div>
                <div className="text-primary-600 dark:text-primary-400">
                  →
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
        <p>支持美股代码：AAPL (苹果), GOOGL (谷歌), MSFT (微软), TSLA (特斯拉) 等</p>
      </div>
    </div>
  );
};

export default StockSearch;