// src/components/ImpedimentsList.tsx
import type { ProjectWithIssues } from '../types';

interface Props {
  projects: ProjectWithIssues[];
}

export function ImpedimentsList({ projects }: Props) {
  const impediments = projects.flatMap((p) =>
    p.issues
      .filter((i) => i.fields.priority.name === 'Highest')
      .map((i) => ({ issue: i, projectName: p.name, projectKey: p.key }))
  );

  if (impediments.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Impedimentos ativos</h3>
        <p className="text-sm text-gray-400 text-center py-4">
          Nenhum bloqueio no momento ✓
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">Impedimentos ativos</h3>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
          {impediments.length} bloqueio{impediments.length > 1 ? 's' : ''}
        </span>
      </div>
      <div className="space-y-2">
        {impediments.map(({ issue, projectName }) => (
          <div
            key={issue.id}
            className="flex gap-3 items-start p-2.5 rounded-lg bg-red-50 border border-red-100"
          >
            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-red-500 text-[10px]">!</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-800 leading-tight truncate">
                {issue.fields.summary}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {projectName} · {issue.key}
              </p>
            </div>
            {issue.fields.assignee && (
              <img
                src={issue.fields.assignee.avatarUrls['24x24']}
                alt={issue.fields.assignee.displayName}
                title={issue.fields.assignee.displayName}
                className="w-5 h-5 rounded-full flex-shrink-0"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
