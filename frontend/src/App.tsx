import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { apiService } from './services/api';
import { SetupPage } from './pages/SetupPage';
import { DashboardPage } from './pages/DashboardPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { MessagesPage } from './pages/MessagesPage';
import { SendMessagePage } from './pages/SendMessagePage';
import { WebhookPage } from './pages/WebhookPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const checkConfiguration = async () => {
    try {
      const config = await apiService.getConfig();
      setIsConfigured(config.hasAccessToken && config.hasPhoneNumberId);
    } catch (error) {
      console.error('Failed to check configuration:', error);
      setIsConfigured(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConfiguration();
  }, []);

  const handleSetupComplete = () => {
    setIsConfigured(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading Greengate...</p>
        </div>
      </div>
    );
  }

  if (!isConfigured) {
    return <SetupPage onSetupComplete={handleSetupComplete} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/send" element={<SendMessagePage />} />
        <Route path="/webhooks" element={<WebhookPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
