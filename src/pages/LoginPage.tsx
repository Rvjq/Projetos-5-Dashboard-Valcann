// src/pages/LoginPage.tsx

interface Props {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white border border-gray-100 rounded-2xl p-10 w-full max-w-sm text-center shadow-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <polygon points="9,2 16,15 2,15" stroke="white" strokeWidth="1.6" strokeLinejoin="round" fill="none"/>
              <line x1="9" y1="2" x2="9" y2="15" stroke="white" strokeWidth="0.9" opacity="0.6"/>
              <line x1="5.5" y1="10" x2="12.5" y2="10" stroke="white" strokeWidth="0.9" opacity="0.6"/>
            </svg>
          </div>
          <div className="text-left">
            <p className="text-base font-semibold text-gray-900 leading-none">Prisma</p>
            <p className="text-xs text-gray-400 leading-none mt-0.5">Valcann Cloud Intelligence</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Visibilidade unificada de todos os projetos Jira em um único painel.
        </p>

        <button
          onClick={onLogin}
          className="w-full flex items-center justify-center gap-2.5 bg-[#0052CC] hover:bg-[#0047B3] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M7.95 0C3.56 0 0 3.56 0 7.95c0 4.39 3.56 7.95 7.95 7.95s7.95-3.56 7.95-7.95C15.9 3.56 12.34 0 7.95 0zm-1.4 11.2L3.1 7.75l1.25-1.25 2.2 2.2 5.1-5.1 1.25 1.25-6.35 6.35z" fill="white"/>
          </svg>
          Entrar com Jira
        </button>

        <p className="text-[11px] text-gray-400 mt-4">
          Seus dados ficam apenas no Jira. O Prisma não armazena nada.
        </p>
      </div>
    </div>
  );
}
