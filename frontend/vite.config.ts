import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    allowedHosts: [
      'experimental-greengate.hnyxm9.easypanel.host',
      '.hnyxm9.easypanel.host',  // allows all subdomains
      '.easypanel.host',          // allows all EasyPanel subdomains (if you control them)
      '.cynefa.com',          // allows all EasyPanel subdomains (if you control them)
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/webhook': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
});
