// src/types/index.ts

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
    status: {
      name: string;
      statusCategory: { key: 'new' | 'indeterminate' | 'done' };
    };
    assignee: {
      displayName: string;
      avatarUrls: { '24x24': string };
    } | null;
    priority: { name: 'Highest' | 'High' | 'Medium' | 'Low' | 'Lowest' };
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

export interface ProjectWithIssues extends JiraProject {
  issues: JiraIssue[];
  progress: number;
  blocked: number;
  sprint: JiraSprint | null;
}

export type StatusHealth = 'ok' | 'warn' | 'block';

export function getProjectHealth(p: ProjectWithIssues): StatusHealth {
  if (p.blocked >= 3) return 'block';
  if (p.blocked >= 1 || p.progress < 30) return 'warn';
  return 'ok';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}
