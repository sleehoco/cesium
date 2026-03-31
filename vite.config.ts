
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const htmlInputs = {
  main: path.resolve(__dirname, "index.html"),
  services: path.resolve(__dirname, "services/index.html"),
  contact: path.resolve(__dirname, "contact/index.html"),
  podcast: path.resolve(__dirname, "podcast/index.html"),
  founders: path.resolve(__dirname, "founders/index.html"),
  blog: path.resolve(__dirname, "blog/index.html"),
  m365SecurityAssessment: path.resolve(__dirname, "m365-security-assessment/index.html"),
  shannonPlusPlus: path.resolve(__dirname, "shannon-plus-plus/index.html"),
  auth: path.resolve(__dirname, "auth/index.html"),
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'es2015',
    cssCodeSplit: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      input: htmlInputs,
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['/src/components/ui/button', '/src/components/ui/card', '/src/components/ui/input']
        },
        // Optimize CSS and JS loading
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    // CSS optimization
    cssMinify: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  }
}));
