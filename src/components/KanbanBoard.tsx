// src/components/KanbanBoard.tsx
import { useState } from 'react';
import type { ProjectWithIssues, JiraIssue } from '../types';

interface Props {
  projects: ProjectWithIssues[];
}

type Column = { key: string; label: string; category: 'new' | 'indeterminate' | 'done' };

const COLUMNS: Column[] = [
  { key: 'todo',       label: 'A fazer',      category: 'new' },
  { key: 'inprogress', label: 'Em progresso', category: 'indeterminate' },
  { key: 'done',       label: 'Concluído',    category: 'done' },
];

const colAccent: Record<string, string> = {
  todo:       'text-gray-500',
  inprogress: 'text-blue-500',
  done:       'text-emerald-600',
};

const colBg: Record<string, string> = {
  todo:       'bg-gray-50',
  inprogress: 'bg-blue-50',
  done:       'bg-emerald-50',
};

export function KanbanBoard({ projects }: Props) {
  const [filter, setFilter] = useState<string | null>(null);

  const visibleProjects = filter ? projects.filter((p) => p.key === filter) : projects;

  const allIssues: Array<{ issue: JiraIssue; projectName: string; projectColor: string }> =
    visibleProjects.flatMap((p, idx) =>
      p.issues.map((issue) => ({
        issue,
        projectName: p.name,
        projectColor: PROJECT_COLORS[idx % PROJECT_COLORS.length],
      }))
    );

  const byCategory = (cat: Column['category']) =>
    allIssues.filter((i) => i.issue.fields.status.statusCategory.key === cat);

  return (
    <div>
      {/* Filter chips */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setFilter(null)}
          className={`text-xs px-3 py-1 rounded-full border transition-colors ${
            filter === null
              ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-medium'
              : 'border-gray-200 text-gray-500 hover:border-gray-300'
          }`}
        >
          Todos
        </button>
        {projects.map((p) => (
          <button
            key={p.key}
            onClick={() => setFilter(filter === p.key ? null : p.key)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              filter === p.key
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-medium'
                : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Columns */}
      <div className="grid grid-cols-3 gap-3">
        {COLUMNS.map((col) => {
          const items = byCategory(col.category);
          return (
            <div key={col.key}>
              <div className="flex items-center justify-between mb-2 px-1">
                <span className={`text-xs font-medium ${colAccent[col.key]}`}>
                  {col.label}
                </span>
                <span className="text-[10px] text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                  {items.length}
                </span>
              </div>
              <div className={`rounded-xl p-2 min-h-40 space-y-2 ${colBg[col.key]}`}>
                {items.map(({ issue, projectName, projectColor }) => (
                  <div
                    key={issue.id}
                    className="bg-white border border-gray-100 rounded-lg p-2.5 shadow-sm"
                  >
                    <p className="text-xs font-medium text-gray-800 leading-tight mb-2">
                      {issue.fields.summary}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                        style={{ background: projectColor + '22', color: projectColor }}
                      >
                        {projectName.split(' ')[0]}
                      </span>
                      {issue.fields.assignee ? (
                        <img
                          src={issue.fields.assignee.avatarUrls['24x24']}
                          alt={issue.fields.assignee.displayName}
                          title={issue.fields.assignee.displayName}
                          className="w-4 h-4 rounded-full"
                        />
                      ) : (
                        <span className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-[8px] text-gray-400">
                          ?
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {items.length === 0 && (
                  <p className="text-[11px] text-gray-400 text-center pt-6">
                    Nenhuma task
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const PROJECT_COLORS = [
  '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4',
];
