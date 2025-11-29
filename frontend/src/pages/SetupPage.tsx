import React, { useState } from 'react';
import { apiService } from '../services/api';

interface SetupPageProps {
  onSetupComplete: () => void;
}

export const SetupPage: React.FC<SetupPageProps> = ({ onSetupComplete }) => {
  const [accessToken, setAccessToken] = useState('');
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [wabaId, setWabaId] = useState('');
  const [verifyToken, setVerifyToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiService.setWhatsAppConfig({
        accessToken,
        phoneNumberId,
        wabaId: wabaId || undefined,
        verifyToken: verifyToken || undefined
      });

      onSetupComplete();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save configuration');
      console.error('Setup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="card max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-700 mb-2">🌿 Greengate</h1>
          <p className="text-gray-600">WhatsApp Business Management Platform</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">⚙️ Initial Setup</h3>
          <p className="text-sm text-blue-800">
            To get started, please configure your WhatsApp Business API credentials.
            You can find these in your Meta Business Manager.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Access Token <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="input"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="EAAxxxxxxxxxxxxx"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Your Meta API access token
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="input"
              value={phoneNumberId}
              onChange={(e) => setPhoneNumberId(e.target.value)}
              placeholder="123456789012345"
              required
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
              type="text"
              className="input"
              value={verifyToken}
              onChange={(e) => setVerifyToken(e.target.value)}
              placeholder="my_secure_verify_token"
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional: Will be auto-generated if not provided
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Configuration'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Need help? Check the documentation for setup instructions.</p>
        </div>
      </div>
    </div>
  );
};
