import { useState } from 'react';
import { AppContext } from '@/store';
import type { Route } from '@/store';
import { currentUser } from '@/data/mock';
import AppLayout from '@/components/AppLayout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Cases from '@/pages/Cases';
import CaseDetails from '@/pages/CaseDetails';
import Documents from '@/pages/Documents';
import DocumentDetails from '@/pages/DocumentDetails';
import Upload from '@/pages/Upload';
import AIAssistant from '@/pages/AIAssistant';
import AuditTrail from '@/pages/AuditTrail';
import SecurityAlerts from '@/pages/SecurityAlerts';
import Settings from '@/pages/Settings';

export default function App() {
  const [route, setRoute] = useState<Route>({ name: 'login' });

  const navigate = (r: Route) => setRoute(r);
  const logout = () => setRoute({ name: 'login' });

  const ctx = { route, navigate, user: currentUser, logout };

  if (route.name === 'login') {
    return (
      <AppContext.Provider value={ctx}>
        <Login />
      </AppContext.Provider>
    );
  }

  const renderPage = () => {
    switch (route.name) {
      case 'dashboard': return <Dashboard />;
      case 'cases': return <Cases />;
      case 'case-details': return <CaseDetails />;
      case 'documents': return <Documents />;
      case 'document-details': return <DocumentDetails />;
      case 'upload': return <Upload />;
      case 'ai-assistant': return <AIAssistant />;
      case 'audit': return <AuditTrail />;
      case 'security': return <SecurityAlerts />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <AppContext.Provider value={ctx}>
      <AppLayout>{renderPage()}</AppLayout>
    </AppContext.Provider>
  );
}
