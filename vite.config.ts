import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  // Ensure VITE_API_URL is available for the build
  // Use the value from .env or a fallback if not found
  process.env.VITE_API_URL = env.VITE_API_URL || 'https://myhometo.onrender.com';

  return {
    server: {
      host: "::",
      port: 8080,
      proxy: {
        '/api': {
          target: 'https://admin.shillongteerground.com/teer/api',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    build: {
      outDir: 'frontend-deploy',
      assetsDir: 'assets',
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
