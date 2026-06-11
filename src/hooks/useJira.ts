// src/hooks/useJira.ts
import { useState, useEffect, useCallback } from 'react';
import { getProjects, getIssues } from '../services/jiraApi';
import type { JiraProject, JiraIssue } from '../services/jiraApi';

export interface ProjectWithIssues extends JiraProject {
  issues: JiraIssue[];
  progress: number;
  blocked: number;
  todo: number;
  inProgress: number;
  done: number;
}

export function useJira(isAuthenticated: boolean) {
  const [projects, setProjects] = useState<ProjectWithIssues[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const sync = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const rawProjects = await getProjects();

      const withIssues = await Promise.all(
        rawProjects.map(async (project) => {
          const issues = await getIssues(project.key);

          const todo       = issues.filter(i => i.fields.status.statusCategory.key === 'new').length;
          const inProgress = issues.filter(i => i.fields.status.statusCategory.key === 'indeterminate').length;
          const done       = issues.filter(i => i.fields.status.statusCategory.key === 'done').length;

          // Impedimentos: prioridade Highest OU status com nome de bloqueio
          const blocked = issues.filter(i =>
            i.fields.priority.name === 'Highest' ||
            i.fields.status.name.toLowerCase().includes('impediment') ||
            i.fields.status.name.toLowerCase().includes('bloqueado') ||
            i.fields.status.name.toLowerCase().includes('blocked')
          ).length;

          const progress = issues.length > 0
            ? Math.round((done / issues.length) * 100)
            : 0;

          return { ...project, issues, progress, blocked, todo, inProgress, done };
        })
      );

      setProjects(withIssues);
      setLastSync(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar dados do Jira');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    sync();
    const interval = setInterval(sync, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [sync]);

  return { projects, loading, error, lastSync, sync };
}