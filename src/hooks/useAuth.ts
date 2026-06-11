// src/hooks/useAuth.ts
// Gerencia o fluxo OAuth 2.0 com o Atlassian.
// O token fica apenas na sessionStorage — some ao fechar o navegador.

import { useState, useEffect, useRef } from 'react';

const CLIENT_ID = import.meta.env.VITE_JIRA_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_JIRA_CLIENT_SECRET;
const REDIRECT_URI = `${window.location.origin}/auth/callback`;
const SCOPES = 'read:jira-work read:jira-user offline_access';

export function useAuth() {
  const [token, setToken] = useState<string | null>(
    () => sessionStorage.getItem('jira_access_token')
  );

  // Processa o callback OAuth (code na URL) ao montar
  // O ref evita double-invoke do StrictMode (que monta o componente 2x em dev)
  const exchanging = useRef(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code && !token && !exchanging.current) {
      exchanging.current = true;
      // Remove o code da URL antes de chamar, para não reprocessar
      window.history.replaceState({}, '', '/');
      exchangeCode(code);
    }
  }, []);

  async function exchangeCode(code: string) {
    try {
      const res = await fetch(
        '/atlassian-auth/oauth/token',  // proxy local → evita CORS
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code,
            redirect_uri: REDIRECT_URI,
          }),
        }
      );

      const data = await res.json();

      console.log('Resposta OAuth:', data);

      if (!res.ok) {
        throw new Error(
          data.error_description || data.error
        );
      }

      sessionStorage.setItem(
        'jira_access_token',
        data.access_token
      );

      setToken(data.access_token);

      window.history.replaceState({}, '', '/');
    } catch (err) {
      console.error('OAuth Error:', err);
    }
  }

  function login() {
    const url = new URL('https://auth.atlassian.com/authorize');
    url.searchParams.set('audience', 'api.atlassian.com');
    url.searchParams.set('client_id', CLIENT_ID);
    url.searchParams.set('scope', SCOPES);
    url.searchParams.set('redirect_uri', REDIRECT_URI);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('prompt', 'consent');
    window.location.href = url.toString();
  }

  function logout() {
    sessionStorage.removeItem('jira_access_token');
    setToken(null);
  }

  return { token, isAuthenticated: !!token, login, logout };
}