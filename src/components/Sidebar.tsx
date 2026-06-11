// src/components/Sidebar.tsx
import type { ProjectWithIssues } from '../types';
import { getProjectHealth } from '../types';

interface Props {
  projects: ProjectWithIssues[];
  activeProject: string | null;
  onSelect: (key: string | null) => void;
  onLogout: () => void;
  lastSync: Date | null;
}

const healthDot: Record<string, string> = {
  ok: 'bg-emerald-400',
  warn: 'bg-amber-400',
  block: 'bg-red-400',
};

export function Sidebar({ projects, activeProject, onSelect, onLogout, lastSync }: Props) {
  const syncLabel = lastSync
    ? `Sync ${lastSync.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
    : 'Sincronizando…';

  return (
    <aside className="w-52 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <polygon points="7,1 13,12 1,12" stroke="white" strokeWidth="1.4" strokeLinejoin="round" fill="none"/>
              <line x1="7" y1="1" x2="7" y2="12" stroke="white" strokeWidth="0.8" opacity="0.6"/>
              <line x1="4" y1="7.5" x2="10" y2="7.5" stroke="white" strokeWidth="0.8" opacity="0.6"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-none">Prisma</p>
            <p className="text-[10px] text-gray-400 leading-none mt-0.5">Valcann</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide px-2 mb-2">
          Geral
        </p>
        <button
          onClick={() => onSelect(null)}
          className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors ${
            activeProject === null
              ? 'bg-emerald-50 text-emerald-700 font-medium'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <span className="text-base leading-none">⊞</span>
          Visão geral
        </button>
        <button
          onClick={() => onSelect('kanban')}
          className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors ${
            activeProject === 'kanban'
              ? 'bg-emerald-50 text-emerald-700 font-medium'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <span className="text-base leading-none">⋮⋮</span>
          Kanban unificado
        </button>

        <div className="pt-3">
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide px-2 mb-2">
            Projetos ({projects.length})
          </p>
          {projects.map((p) => {
            const health = getProjectHealth(p);
            return (
              <button
                key={p.key}
                onClick={() => onSelect(p.key)}
                className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors ${
                  activeProject === p.key
                    ? 'bg-emerald-50 text-emerald-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${healthDot[health]}`} />
                <span className="truncate">{p.name}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-gray-100 space-y-1">
        <p className="text-[10px] text-gray-400 px-1">{syncLabel}</p>
        <button
          onClick={onLogout}
          className="w-full text-left text-xs text-gray-400 hover:text-gray-600 px-1 py-0.5 transition-colors"
        >
          Sair da conta
        </button>
      </div>
    </aside>
  );
}
