// src/components/ProjectCard.tsx
import type { ProjectWithIssues, StatusHealth } from '../types';
import { getProjectHealth } from '../types';

interface Props {
  project: ProjectWithIssues;
  onClick: () => void;
}

const healthLabel: Record<StatusHealth, string> = {
  ok: 'No prazo',
  warn: 'Atenção',
  block: 'Bloqueado',
};

const healthClass: Record<StatusHealth, string> = {
  ok: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warn: 'bg-amber-50 text-amber-700 border-amber-200',
  block: 'bg-red-50 text-red-700 border-red-200',
};

const barColor: Record<StatusHealth, string> = {
  ok: 'bg-emerald-500',
  warn: 'bg-amber-400',
  block: 'bg-red-400',
};

export function ProjectCard({ project, onClick }: Props) {
  const health = getProjectHealth(project);
  const done = project.issues.filter(
    (i) => i.fields.status.statusCategory.key === 'done'
  ).length;

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 hover:shadow-sm transition-all duration-150 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={project.avatarUrls['48x48']}
            alt={project.name}
            className="w-7 h-7 rounded-md flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate leading-tight">
              {project.name}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {project.sprint?.name ?? 'Sem sprint ativo'} · {project.key}
            </p>
          </div>
        </div>
        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded-full border flex-shrink-0 ml-2 ${healthClass[health]}`}
        >
          {healthLabel[health]}
        </span>
      </div>

      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-400">Progresso</span>
          <span className="text-xs font-medium text-gray-700">
            {project.progress}%
          </span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${barColor[health]}`}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>
          {done}/{project.issues.length} tasks
        </span>
        {project.blocked > 0 && (
          <span className="text-red-500 font-medium">
            ⚠ {project.blocked} bloqueio{project.blocked > 1 ? 's' : ''}
          </span>
        )}
      </div>
    </button>
  );
}
