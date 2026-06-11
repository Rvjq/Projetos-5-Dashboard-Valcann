import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      port: 5173,
      historyApiFallback: true,
      proxy: {
        // A Jira Cloud API OAuth exige api.atlassian.com/ex/jira/{cloudId}/rest/...
        // NÃO aceita chamadas diretas para valcann.atlassian.net com token OAuth
        '/jira-api': {
          target: `https://api.atlassian.com/ex/jira/${env.VITE_JIRA_CLOUD_ID}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/jira-api/, ''),
          secure: true,
        },
        '/atlassian-auth': {
          target: 'https://auth.atlassian.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/atlassian-auth/, ''),
          secure: true,
        },
      },
    },
  };
});