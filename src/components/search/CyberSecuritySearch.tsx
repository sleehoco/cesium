
import { useState } from "react";
import { Search as SearchIcon, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchResult {
  title: string;
  url: string;
  source: string;
  description: string;
}

interface CyberSecuritySearchProps {
  onClose: () => void;
}

const CyberSecuritySearch = ({ onClose }: CyberSecuritySearchProps) => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    try {
      // In a real application, this would make an API call to backend
      // For demo purposes, we'll simulate a search with mock data
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock results based on search query
      const mockResults: SearchResult[] = [
        {
          title: `Latest ${query} Threats - BleepingComputer`,
          url: `https://www.bleepingcomputer.com/search/?q=${encodeURIComponent(query)}`,
          source: "bleepingcomputer.com",
          description: `Recent article about ${query} security threats and mitigation strategies.`
        },
        {
          title: `${query} Discussion - r/cybersecurity`,
          url: `https://old.reddit.com/r/cybersecurity/search/?q=${encodeURIComponent(query)}`,
          source: "old.reddit.com/r/cybersecurity",
          description: `Community discussion about ${query} vulnerabilities and protection methods.`
        },
        {
          title: `${query} Security Alert - BleepingComputer`,
          url: `https://www.bleepingcomputer.com/search/?q=${encodeURIComponent(query)}+alert`,
          source: "bleepingcomputer.com",
          description: `Security alert regarding ${query} affecting enterprise systems.`
        }
      ];
      
      setResults(mockResults);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for cybersecurity events..."
          className="bg-black/40 border-cesium/30 text-gray-200"
        />
        <Button 
          type="submit" 
          disabled={isSearching}
          className="bg-cesium hover:bg-cesium-dark text-cyber-dark"
        >
          {isSearching ? 'Searching...' : 'Search'}
          <SearchIcon className="ml-2 h-4 w-4" />
        </Button>
      </form>

      {isSearching && (
        <div className="py-10 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cesium"></div>
          <p className="mt-2 text-gray-300">Searching security resources...</p>
        </div>
      )}

      {!isSearching && results.length > 0 && (
        <div className="space-y-4 mt-4">
          <h3 className="text-gray-300 font-medium">Search Results</h3>
          <div className="border-t border-cesium/20 pt-2">
            {results.map((result, index) => (
              <div 
                key={index} 
                className="border border-cesium/10 rounded-md p-4 mb-3 bg-black/30 hover:border-cesium/30 transition-colors"
              >
                <h4 className="text-cesium font-medium">{result.title}</h4>
                <p className="text-gray-400 text-sm">{result.source}</p>
                <p className="text-gray-300 my-2">{result.description}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 border-cesium/20 text-cesium hover:bg-cesium/10"
                  onClick={() => openInNewTab(result.url)}
                >
                  Visit <ExternalLink className="ml-2 h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isSearching && query && results.length === 0 && (
        <div className="py-6 text-center text-gray-400">
          <p>No results found. Try a different search term.</p>
        </div>
      )}

      <div className="text-xs text-gray-500 mt-4">
        <p>Search powered by BleepingComputer and Reddit r/cybersecurity</p>
        <p>Note: This is a demonstration. In a production environment, this would connect to actual search APIs.</p>
      </div>
    </div>
  );
};

export default CyberSecuritySearch;
