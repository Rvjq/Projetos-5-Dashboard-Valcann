// src/hooks/useJira.ts
// Busca projetos e issues diretamente do Jira e mantém em memória (useState).
// Nenhum dado é persistido — tudo some ao recarregar a página.

import { useState, useEffect, useCallback } from 'react';
import { getProjects, getIssues, type JiraProject, type JiraIssue } from '../services/jiraApi';

export interface ProjectWithIssues extends JiraProject {
  issues: JiraIssue[];
  progress: number;       // % de issues concluídas
  blocked: number;        // issues com status "blocked" ou prioridade "highest"
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
          const done = issues.filter(
            (i) => i.fields.status.statusCategory.key === 'done'
          ).length;
          const blocked = issues.filter(
            (i) => i.fields.priority.name === 'Highest'
          ).length;
          const progress = issues.length > 0
            ? Math.round((done / issues.length) * 100)
            : 0;

          return { ...project, issues, progress, blocked };
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

  // Busca ao autenticar e a cada 5 minutos
  useEffect(() => {
    sync();
    const interval = setInterval(sync, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [sync]);

  return { projects, loading, error, lastSync, sync };
}
