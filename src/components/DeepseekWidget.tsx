
import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

const DeepseekWidget = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    
    if (!apiKey.trim()) {
      toast.error("Please enter your Deepseek API key");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to get response from Deepseek API");
      }
      
      const data = await response.json();
      setResponse(data.choices[0]?.message?.content || "No response received");
      
      // Save API key to localStorage if successful
      localStorage.setItem("deepseekApiKey", apiKey);
      setShowApiKeyInput(false);
      
    } catch (error) {
      console.error("Error calling Deepseek API:", error);
      toast.error(error instanceof Error ? error.message : "Failed to get response from Deepseek API");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check for saved API key on component mount
  useState(() => {
    const savedApiKey = localStorage.getItem("deepseekApiKey");
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setShowApiKeyInput(false);
    }
  });
  
  const resetApiKey = () => {
    localStorage.removeItem("deepseekApiKey");
    setApiKey("");
    setShowApiKeyInput(true);
  };

  return (
    <div className="bg-cyber-dark rounded-lg border border-cesium/20 p-6 md:p-8">
      <h3 className="text-2xl font-semibold text-white mb-4">Deepseek R1 AI</h3>
      <p className="text-gray-400 mb-6">
        Ask a question to the Deepseek R1 large language model and get an instant response.
      </p>
      
      <form onSubmit={handleSubmit}>
        {showApiKeyInput && (
          <div className="mb-4">
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-1">
              Deepseek API Key
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-cyber border border-cesium/30 text-white focus:border-cesium focus:ring-1 focus:ring-cesium outline-none transition-colors"
              placeholder="Enter your Deepseek API key"
            />
            <p className="text-xs text-gray-500 mt-1">
              Your API key is stored locally and never sent to our servers.
            </p>
          </div>
        )}
        
        {!showApiKeyInput && (
          <div className="mb-4 flex justify-between items-center">
            <span className="text-sm text-gray-300">API Key saved</span>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={resetApiKey}
              className="text-xs"
            >
              Reset API Key
            </Button>
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-1">
            Your Prompt
          </label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full px-4 py-3 rounded-md bg-cyber border border-cesium/30 text-white focus:border-cesium focus:ring-1 focus:ring-cesium outline-none transition-colors"
            placeholder="Enter your question or prompt here..."
            rows={4}
          />
        </div>
        
        <Button
          type="submit"
          className="w-full bg-cesium hover:bg-cesium-dark text-cyber-dark font-medium px-4 py-3 rounded-md transition-colors flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Submit to Deepseek
              <Send className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
      
      {response && (
        <div className="mt-6">
          <h4 className="text-lg font-medium text-white mb-2">Response:</h4>
          <div className="bg-cyber p-4 rounded border border-cesium/20 text-gray-300 whitespace-pre-wrap">
            {response}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeepseekWidget;
