import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync, existsSync } from 'fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-htaccess',
      closeBundle() {
        const htaccessSource = '.github/workflows/.htaccess';
        const htaccessDest = 'dist/.htaccess';
        
        if (existsSync(htaccessSource)) {
          try {
            copyFileSync(htaccessSource, htaccessDest);
            console.log('✅ .htaccess copied to dist folder');
          } catch (err) {
            console.warn('⚠️  Could not copy .htaccess:', err);
          }
        }
      }
    }
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'markdown-vendor': ['react-markdown', 'rehype-raw', 'rehype-sanitize'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild',
    target: 'esnext',
    cssCodeSplit: true,
  },
});
