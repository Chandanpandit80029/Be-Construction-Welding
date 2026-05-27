import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['@babel/plugin-transform-runtime', { useESModules: true }]
        ]
      }
    }),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
      '@config': fileURLToPath(new URL('./src/config', import.meta.url)),
      '@constants': fileURLToPath(new URL('./src/constants', import.meta.url)),
      '@contexts': fileURLToPath(new URL('./src/contexts', import.meta.url)),
    }
  },

  build: {
    // Disable sourcemaps in production
    sourcemap: false,
    
    // Increase chunk warning limit to 1000 kB
    chunkSizeWarningLimit: 1000,
    
    // Enable CSS code splitting
    cssCodeSplit: true,
    
    // Minify options - esbuild
    minify: 'esbuild',
    target: 'es2020',
    
    // Rollup/rolldown options for chunk splitting
    rollupOptions: {
      output: {
        // manualChunks as a function (required by rolldown)
        manualChunks(id) {
          // React core vendor chunk
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react-router-dom/') ||
              id.includes('node_modules/react-router/')) {
            return 'vendor-react';
          }
          
          // Animations vendor chunk
          if (id.includes('node_modules/framer-motion/') ||
              id.includes('node_modules/motion/')) {
            return 'vendor-animations';
          }
          
          // Firebase vendor chunk
          if (id.includes('node_modules/firebase/')) {
            return 'vendor-firebase';
          }
          
          // Forms and icons vendor chunk
          if (id.includes('node_modules/react-hook-form/') ||
              id.includes('node_modules/react-icons/')) {
            return 'vendor-ui';
          }
        }
      }
    },
  },

  // Optimize dev server
  server: {
    port: 5173,
    open: false,
    cors: true,
  },

  // Pre-bundle dependencies for faster dev startup
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'framer-motion',
      'react-hook-form',
      'react-icons'
    ],
  },
})