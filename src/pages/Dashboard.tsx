// src/pages/Dashboard.tsx
import { MetricsRow } from '../components/MetricsRow';
import { ProjectCard } from '../components/ProjectCard';
import { ImpedimentsList } from '../components/ImpedimentsList';
import { KanbanBoard } from '../components/KanbanBoard';
import type { ProjectWithIssues } from '../types';

interface Props {
  projects: ProjectWithIssues[];
  loading: boolean;
  error: string | null;
  activeProject: string | null;
  onSelectProject: (key: string) => void;
  onSync: () => void;
}

export function Dashboard({
  projects,
  loading,
  error,
  activeProject,
  onSelectProject,
  onSync,
}: Props) {
  if (loading && projects.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Carregando projetos do Jira…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-sm">
          <p className="text-sm font-medium text-gray-700 mb-1">Erro ao conectar ao Jira</p>
          <p className="text-xs text-gray-400 mb-4">{error}</p>
          <button
            onClick={onSync}
            className="text-xs text-emerald-600 hover:text-emerald-700 underline"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // Visão Kanban
  if (activeProject === 'kanban') {
    return (
      <main className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Kanban unificado</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {projects.reduce((a, p) => a + p.issues.length, 0)} tasks · todos os projetos
            </p>
          </div>
          <button
            onClick={onSync}
            disabled={loading}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Atualizando…' : '↺ Sincronizar'}
          </button>
        </div>
        <KanbanBoard projects={projects} />
      </main>
    );
  }

  // Detalhe de projeto específico
  if (activeProject && activeProject !== 'kanban') {
    const project = projects.find((p) => p.key === activeProject);
    if (project) {
      return (
        <main className="flex-1 overflow-auto p-6">
          <div className="flex items-center gap-3 mb-5">
            <img src={project.avatarUrls['48x48']} alt={project.name} className="w-8 h-8 rounded-lg" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{project.name}</h1>
              <p className="text-xs text-gray-400">{project.sprint?.name ?? 'Sem sprint'} · {project.issues.length} tasks</p>
            </div>
          </div>
          <KanbanBoard projects={[project]} />
        </main>
      );
    }
  }

  // Visão geral (default)
  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Visão geral</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Valcann Cloud Intelligence · {projects.length} projetos ativos
          </p>
        </div>
        <button
          onClick={onSync}
          disabled={loading}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Atualizando…' : '↺ Sincronizar'}
        </button>
      </div>

      <MetricsRow projects={projects} />

      <div className="grid grid-cols-3 gap-3 mb-5">
        {projects.map((p) => (
          <ProjectCard key={p.key} project={p} onClick={() => onSelectProject(p.key)} />
        ))}
      </div>

      <ImpedimentsList projects={projects} />
    </main>
  );
}
