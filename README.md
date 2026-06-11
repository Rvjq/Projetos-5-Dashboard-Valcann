# ◭ Prisma

> Dashboard integrado de projetos Jira — desenvolvido para a **Valcann Cloud Intelligence**.

---

## O que é

SPA (Single Page Application) leve que conecta diretamente à API do Jira e exibe todos os projetos da Valcann em um único painel. Sem banco de dados, sem servidor próprio — tudo roda no navegador.

---

## Como funciona

```
Usuário abre o Prisma
       │
       ▼
  [Login Jira]  ──►  OAuth 2.0 Atlassian  ──►  Token na sessionStorage
       │
       ▼
  [useJira hook]  ──►  Jira Cloud REST API  ──►  Dados em memória (useState)
       │
       ▼
  [Dashboard / Kanban]  ──►  Exibe em tempo real, sync a cada 5 min
```

Ao fechar o navegador, o token e os dados somem. Nada é armazenado fora do Jira.

---

## Stack

| O quê        | Tecnologia                  |
|--------------|-----------------------------|
| Interface    | React 18 + TypeScript       |
| Build        | Vite 5                      |
| Estilo       | Tailwind CSS 3              |
| Autenticação | OAuth 2.0 — Atlassian       |
| Dados        | Jira Cloud REST API v3      |
| Persistência | Nenhuma                     |

---

## Estrutura

```
prisma/
├── src/
│   ├── components/
│   │   ├── KanbanBoard.tsx       # Kanban unificado, filtrável por projeto
│   │   ├── ProjectCard.tsx       # Card com progresso, saúde e bloqueios
│   │   ├── MetricsRow.tsx        # 4 métricas consolidadas no topo
│   │   ├── ImpedimentsList.tsx   # Issues de prioridade Highest sinalizadas
│   │   └── Sidebar.tsx           # Navegação + lista de projetos + logout
│   ├── pages/
│   │   ├── Dashboard.tsx         # Orquestra visão geral / kanban / detalhe
│   │   └── LoginPage.tsx         # Tela de entrada com botão OAuth Jira
│   ├── hooks/
│   │   ├── useAuth.ts            # Fluxo OAuth, token na sessionStorage
│   │   └── useJira.ts            # Busca projetos + issues, sync periódico
│   ├── services/
│   │   └── jiraApi.ts            # Chamadas REST diretas ao Jira Cloud
│   ├── types/
│   │   └── index.ts              # Tipos TypeScript + helpers (getHealth, getInitials)
│   ├── App.tsx                   # Raiz: auth → sidebar + dashboard
│   ├── main.tsx                  # Entry point React
│   └── index.css                 # Tailwind base
├── public/
│   └── index.html
├── .env.example                  # Credenciais do app Atlassian
├── .gitignore
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Configuração

### 1. Clone e instale

```bash
git clone https://github.com/valcann/prisma.git
cd prisma
npm install
```

### 2. Crie o app no Atlassian

Acesse [developer.atlassian.com](https://developer.atlassian.com/console/myapps/) → **Create app** → OAuth 2.0 (3LO).

Permissões necessárias:
- `read:jira-work`
- `read:jira-user`

Callback URL: `http://localhost:5173/auth/callback`

### 3. Configure o `.env`

```bash
cp .env.example .env
```

```env
VITE_JIRA_CLIENT_ID=seu_client_id_aqui
VITE_JIRA_CLOUD_ID=id_da_instancia_valcann
VITE_JIRA_BASE_URL=https://valcann.atlassian.net
```

### 4. Rode

```bash
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173), clique em **Entrar com Jira** e autorize.

---

## Scripts

```bash
npm run dev      # Dev com hot reload
npm run build    # Build estático em /dist
npm run preview  # Preview do build local
npm run lint     # Lint TypeScript
```

---

## Fluxo de dados

```
useAuth.ts
  └── login()  →  redireciona para Atlassian OAuth
  └── callback →  troca code por token  →  sessionStorage

useJira.ts
  └── ao autenticar  →  getProjects()
  └── por projeto    →  getIssues(key)
  └── agrega         →  progress, blocked (em memória, useState)
  └── a cada 5 min   →  re-sync automático

jiraApi.ts
  └── getProjects()   →  GET /rest/api/3/project/search
  └── getIssues(key)  →  GET /rest/api/3/search?jql=project={key}
  └── getActiveSprint →  GET /rest/agile/1.0/board/{id}/sprint
```

---

## Segurança

- Token OAuth fica apenas na `sessionStorage` (morre ao fechar a aba)
- Nenhum dado de projeto trafega fora do Jira
- `.env` está no `.gitignore` — nunca commitar credenciais
- Acesso de leitura apenas (`read:jira-work`, `read:jira-user`)

---

*Valcann Cloud Intelligence · 2025*
