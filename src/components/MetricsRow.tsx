// src/components/MetricsRow.tsx
import type { ProjectWithIssues } from '../types';
import { getProjectHealth } from '../types';

interface Props {
  projects: ProjectWithIssues[];
}

export function MetricsRow({ projects }: Props) {
  const totalIssues = projects.reduce((a, p) => a + p.issues.length, 0);
  const totalDone = projects.reduce(
    (a, p) => a + p.issues.filter((i) => i.fields.status.statusCategory.key === 'done').length,
    0
  );
  const totalBlocked = projects.reduce((a, p) => a + p.blocked, 0);
  const onTrack = projects.filter((p) => getProjectHealth(p) === 'ok').length;

  const metrics = [
    {
      label: 'Projetos ativos',
      value: projects.length,
      sub: 'sincronizados com Jira',
      icon: '◫',
      color: 'text-gray-700',
    },
    {
      label: 'Tasks concluídas',
      value: totalDone,
      sub: `de ${totalIssues} no total`,
      icon: '✓',
      color: 'text-emerald-600',
    },
    {
      label: 'Impedimentos',
      value: totalBlocked,
      sub: totalBlocked > 0 ? 'requer atenção' : 'tudo limpo',
      icon: '⚠',
      color: totalBlocked > 0 ? 'text-red-500' : 'text-gray-400',
    },
    {
      label: 'No prazo',
      value: `${onTrack}/${projects.length}`,
      sub: 'projetos saudáveis',
      icon: '◎',
      color: 'text-emerald-600',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="bg-white border border-gray-100 rounded-xl px-4 py-3"
        >
          <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide mb-1">
            {m.label}
          </p>
          <p className={`text-2xl font-semibold leading-none mb-1 ${m.color}`}>
            {m.value}
          </p>
          <p className="text-[11px] text-gray-400">{m.sub}</p>
        </div>
      ))}
    </div>
  );
}
