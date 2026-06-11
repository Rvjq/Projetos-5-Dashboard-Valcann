// src/components/StatusPieChart.tsx
// Gráfico de pizza SVG puro — sem dependências externas
import type { ProjectWithIssues } from '../hooks/useJira';

interface Props {
  projects: ProjectWithIssues[];
}

export function StatusPieChart({ projects }: Props) {
  const totalTodo       = projects.reduce((a, p) => a + p.todo, 0);
  const totalInProgress = projects.reduce((a, p) => a + p.inProgress, 0);
  const totalDone       = projects.reduce((a, p) => a + p.done, 0);
  const total           = totalTodo + totalInProgress + totalDone;

  if (total === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-center h-40">
        <p className="text-sm text-gray-400">Sem issues para exibir</p>
      </div>
    );
  }

  const slices = [
    { label: 'Não iniciado', value: totalTodo,       color: '#e5e7eb', pct: totalTodo / total },
    { label: 'Em progresso', value: totalInProgress, color: '#60a5fa', pct: totalInProgress / total },
    { label: 'Concluído',    value: totalDone,        color: '#10b981', pct: totalDone / total },
  ].filter(s => s.value > 0);

  // Monta os paths do SVG manualmente
  const cx = 60, cy = 60, r = 52;
  let cumulative = 0;

  function polarToXY(pct: number) {
    const angle = pct * 2 * Math.PI - Math.PI / 2;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  }

  const paths = slices.map((slice) => {
    const start = cumulative;
    cumulative += slice.pct;
    const end = cumulative;

    const s = polarToXY(start);
    const e = polarToXY(end);
    const largeArc = slice.pct > 0.5 ? 1 : 0;

    // Fatia completa: círculo cheio
    if (slice.pct >= 0.9999) {
      return (
        <circle key={slice.label} cx={cx} cy={cy} r={r} fill={slice.color} />
      );
    }

    return (
      <path
        key={slice.label}
        d={`M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y} Z`}
        fill={slice.color}
      />
    );
  });

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Status das issues</h3>
      <div className="flex items-center gap-6">
        {/* Pizza */}
        <svg width="120" height="120" viewBox="0 0 120 120" className="flex-shrink-0">
          {paths}
          {/* Buraco central — transforma em donut */}
          <circle cx={cx} cy={cy} r={28} fill="white" />
          <text x={cx} y={cy - 4} textAnchor="middle" fontSize="11" fontWeight="600" fill="#111827">
            {total}
          </text>
          <text x={cx} y={cy + 10} textAnchor="middle" fontSize="8" fill="#9ca3af">
            issues
          </text>
        </svg>

        {/* Legenda */}
        <div className="flex flex-col gap-2.5 flex-1">
          {[
            { label: 'Não iniciado', value: totalTodo,       color: '#e5e7eb', textColor: 'text-gray-500' },
            { label: 'Em progresso', value: totalInProgress, color: '#60a5fa', textColor: 'text-blue-500'  },
            { label: 'Concluído',    value: totalDone,        color: '#10b981', textColor: 'text-emerald-600' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: item.color }}
                />
                <span className="text-xs text-gray-500">{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-semibold ${item.textColor}`}>{item.value}</span>
                <span className="text-[10px] text-gray-400">
                  {total > 0 ? `${Math.round((item.value / total) * 100)}%` : '0%'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
