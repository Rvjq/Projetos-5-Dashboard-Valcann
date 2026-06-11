// src/services/jiraApi.ts
// As chamadas vão para /jira-api/* que o Vite redireciona para o Jira.
// Isso evita o bloqueio de CORS — o browser fala com localhost,
// e o Vite faz a chamada real para o Jira server-side.

function getToken(): string {
  const token = sessionStorage.getItem('jira_access_token');
  if (!token) throw new Error('Usuário não autenticado');
  return token;
}

async function jiraFetch<T>(path: string): Promise<T> {
  const res = await fetch(`/jira-api${path}`, {   // ← proxy local, não o Jira direto
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Jira API ${res.status}: ${body}`);
  }
  return res.json();
}

// ── Projetos ──────────────────────────────────────────────

export async function getProjects() {
  const data = await jiraFetch<{ values: JiraProject[] }>(
    '/rest/api/3/project/search?maxResults=50&orderBy=name'
  );
  return data.values;
}

// ── Issues de um projeto ──────────────────────────────────

export async function getIssues(projectKey: string) {
  const jql = encodeURIComponent(
    `project = ${projectKey} AND sprint in openSprints() ORDER BY updated DESC`
  );
  const data = await jiraFetch<{ issues: JiraIssue[] }>(
    `/rest/api/3/search/jql?jql=${jql}&maxResults=100&fields=summary,status,assignee,priority,issuetype`
  );
  return data.issues;
}

// ── Sprints ativos de um board ────────────────────────────

export async function getActiveSprint(boardId: number) {
  const data = await jiraFetch<{ values: JiraSprint[] }>(
    `/rest/agile/1.0/board/${boardId}/sprint?state=active`
  );
  return data.values[0] ?? null;
}

// ── Tipos ─────────────────────────────────────────────────

export interface JiraProject {
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
  avatarUrls: { '48x48': string };
}

export interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    status: { name: string; statusCategory: { key: string } };
    assignee: { displayName: string; avatarUrls: { '24x24': string } } | null;
    priority: { name: string };
    issuetype: { name: string; iconUrl: string };
  };
}

export interface JiraSprint {
  id: number;
  name: string;
  state: string;
  startDate: string;
  endDate: string;
}