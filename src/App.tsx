// src/App.tsx
import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useJira } from './hooks/useJira';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { Sidebar } from './components/Sidebar';

export default function App() {
  const { isAuthenticated, login, logout } = useAuth();
  const { projects, loading, error, lastSync, sync } = useJira(isAuthenticated);
  const [activeProject, setActiveProject] = useState<string | null>(null);

  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />;
  }

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      <Sidebar
        projects={projects}
        activeProject={activeProject}
        onSelect={setActiveProject}
        onLogout={logout}
        lastSync={lastSync}
      />
      <Dashboard
        projects={projects}
        loading={loading}
        error={error}
        activeProject={activeProject}
        onSelectProject={setActiveProject}
        onSync={sync}
      />
    </div>
  );
}
