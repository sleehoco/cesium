
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { StrictMode, ErrorBoundary } from 'react'

// Simple error boundary component
class ErrorFallback extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error("Application error:", error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          fontFamily: 'sans-serif', 
          padding: '20px', 
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto' 
        }}>
          <h2>Something went wrong</h2>
          <p>The application encountered an error. Please try refreshing the page.</p>
          <pre style={{ 
            textAlign: 'left', 
            background: '#f5f5f5', 
            padding: '10px', 
            borderRadius: '4px',
            maxHeight: '200px',
            overflow: 'auto' 
          }}>
            {this.state.error?.toString()}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              marginTop: '20px',
              padding: '8px 16px',
              background: '#4ad9db',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    console.error("Failed to find the root element");
  } else {
    try {
      const root = createRoot(rootElement);
      
      // Log when rendering starts
      console.log("Starting to render React application");
      
      root.render(
        <ErrorFallback>
          <StrictMode>
            <App />
          </StrictMode>
        </ErrorFallback>
      );
      
      console.log("React application rendered successfully");
    } catch (error) {
      console.error("Error rendering the application:", error);
      // Display fallback error UI
      rootElement.innerHTML = `
        <div style="font-family: sans-serif; padding: 20px; text-align: center;">
          <h2>Something went wrong</h2>
          <p>The application failed to load. Please check your console for details.</p>
          <p>${error?.message || 'Unknown error'}</p>
          <button onclick="window.location.reload()" style="margin-top: 20px; padding: 8px 16px;">
            Refresh Page
          </button>
        </div>
      `;
    }
  }
});
