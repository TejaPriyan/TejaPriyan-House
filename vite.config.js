import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' makes the build work on Vercel, Netlify and GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-three': ['three'],
          'vendor-react': ['react', 'react-dom'],
          'vendor-r3f': ['@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
        },
      },
    },
  },
})
