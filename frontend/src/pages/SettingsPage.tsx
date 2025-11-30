import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { apiService, ConfigStatus } from '../services/api';

export const SettingsPage: React.FC = () => {
  const [accessToken, setAccessToken] = useState('');
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [wabaId, setWabaId] = useState('');
  const [verifyToken, setVerifyToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentConfig, setCurrentConfig] = useState<ConfigStatus | null>(null);

  const loadConfig = async () => {
    try {
      setLoadingConfig(true);
      const config = await apiService.getConfig();
      setCurrentConfig(config);
      
      // Pre-fill fields that are visible
      if (config.phoneNumberId) {
        setPhoneNumberId(config.phoneNumberId);
      }
      if (config.wabaId) {
        setWabaId(config.wabaId);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load configuration');
      console.error('Config load error:', err);
    } finally {
      setLoadingConfig(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await apiService.setWhatsAppConfig({
        accessToken: accessToken || undefined,
        phoneNumberId: phoneNumberId || undefined,
        wabaId: wabaId || undefined,
        verifyToken: verifyToken || undefined
      });

      setSuccess('Configuration updated successfully!');
      
      // Clear sensitive fields after successful update
      setAccessToken('');
      setVerifyToken('');
      
      // Reload config to show updated status
      await loadConfig();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update configuration');
      console.error('Settings update error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingConfig) {
    return (
      <Layout>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-500">Loading configuration...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600 mb-6">Update your WhatsApp Business API configuration</p>

        {/* Current Configuration Status */}
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Configuration Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Access Token</span>
              {currentConfig?.hasAccessToken ? (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">✓ Configured</span>
              ) : (
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-semibold">✗ Not Set</span>
              )}
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Phone Number ID</span>
              {currentConfig?.hasPhoneNumberId ? (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">✓ Configured</span>
              ) : (
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-semibold">✗ Not Set</span>
              )}
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">WABA ID</span>
              {currentConfig?.hasWabaId ? (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">✓ Configured</span>
              ) : (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-semibold">Optional</span>
              )}
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Webhook Verify Token</span>
              {currentConfig?.hasVerifyToken ? (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">✓ Configured</span>
              ) : (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-semibold">Optional</span>
              )}
            </div>
          </div>

          {currentConfig?.phoneNumberId && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Current Phone Number ID:</span> {currentConfig.phoneNumberId}
              </p>
            </div>
          )}

          {currentConfig?.wabaId && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Current WABA ID:</span> {currentConfig.wabaId}
              </p>
            </div>
          )}
        </div>

        {/* Update Configuration Form */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Configuration</h3>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Important Notes</h4>
            <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
              <li>Only fill in fields you want to update</li>
              <li>Empty fields will keep their current values</li>
              <li>Access token and verify token are sensitive and never displayed</li>
              <li>Changing credentials may affect active integrations</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Access Token
              </label>
              <input
                type="password"
                className="input"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="Enter new access token to update"
              />
              <p className="text-xs text-gray-500 mt-1">
                Your Meta API access token (leave empty to keep current)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number ID
              </label>
              <input
                type="text"
                className="input"
                value={phoneNumberId}
                onChange={(e) => setPhoneNumberId(e.target.value)}
                placeholder="123456789012345"
              />
              <p className="text-xs text-gray-500 mt-1">
                Your WhatsApp Business phone number ID
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp Business Account ID (WABA)
              </label>
              <input
                type="text"
                className="input"
                value={wabaId}
                onChange={(e) => setWabaId(e.target.value)}
                placeholder="123456789012345"
              />
              <p className="text-xs text-gray-500 mt-1">
                Optional: Required for template management
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook Verify Token
              </label>
              <input
                type="password"
                className="input"
                value={verifyToken}
                onChange={(e) => setVerifyToken(e.target.value)}
                placeholder="Enter new verify token to update"
              />
              <p className="text-xs text-gray-500 mt-1">
                Optional: Used to verify webhook connections (leave empty to keep current)
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Configuration'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setAccessToken('');
                  setPhoneNumberId(currentConfig?.phoneNumberId || '');
                  setWabaId(currentConfig?.wabaId || '');
                  setVerifyToken('');
                  setError('');
                  setSuccess('');
                }}
                disabled={loading}
              >
                Reset Form
              </button>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="card mt-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">📚 Need Help?</h3>
          <p className="text-sm text-blue-800 mb-2">
            To find your WhatsApp Business API credentials:
          </p>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside ml-2">
            <li>Go to <a href="https://business.facebook.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Meta Business Manager</a></li>
            <li>Navigate to your WhatsApp Business Account</li>
            <li>Find your Phone Number ID and WABA ID in the account settings</li>
            <li>Generate or copy your Access Token from the API settings</li>
          </ol>
        </div>
      </div>
    </Layout>
  );
};
