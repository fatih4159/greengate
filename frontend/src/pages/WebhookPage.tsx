import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { apiService } from '../services/api';

interface WebhookInfo {
  webhookUrl: string;
  verifyToken: string;
  isConfigured: boolean;
}

export const WebhookPage: React.FC = () => {
  const [webhookInfo, setWebhookInfo] = useState<WebhookInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [testing, setTesting] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    loadWebhookInfo();
  }, []);

  const loadWebhookInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const info = await apiService.getWebhookInfo();
      setWebhookInfo(info);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load webhook information');
    } finally {
      setLoading(false);
    }
  };

  const testWebhook = async () => {
    if (!webhookInfo) return;

    try {
      setTesting(true);
      setTestResult(null);
      const result = await apiService.testWebhook();
      setTestResult({
        success: true,
        message: result.message || 'Webhook is configured correctly!'
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.response?.data?.error || 'Webhook test failed'
      });
    } finally {
      setTesting(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading webhook information...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-xl mb-2">⚠️ Error</div>
          <p className="text-red-700">{error}</p>
          <button
            onClick={loadWebhookInfo}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </Layout>
    );
  }

  if (!webhookInfo) {
    return (
      <Layout>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <div className="text-yellow-600 text-xl mb-2">⚠️ No Configuration</div>
          <p className="text-yellow-700">Please configure your WhatsApp credentials first.</p>
        </div>
      </Layout>
    );
  }

  const metaConfigUrl = 'https://developers.facebook.com/apps';

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Webhook Configuration</h1>
            <p className="mt-2 text-gray-600">
              Configure Meta webhooks to receive incoming messages and status updates
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {webhookInfo.isConfigured && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                ✓ Configured
              </span>
            )}
          </div>
        </div>

        {/* Status Banner */}
        {!webhookInfo.isConfigured && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Webhook Not Configured</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Your webhook needs to be configured in Meta to receive messages. Follow the steps below.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Setup Instructions */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🔧 Setup Instructions</h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-primary-500 pl-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Step 1: Copy Your Webhook Credentials</h3>
              <p className="text-gray-600 mb-4">
                Use these credentials when configuring webhooks in Meta Business Suite.
              </p>

              {/* Webhook URL */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Webhook URL (Callback URL)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={webhookInfo.webhookUrl}
                    readOnly
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 font-mono text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(webhookInfo.webhookUrl, 'url')}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 whitespace-nowrap"
                  >
                    {copied === 'url' ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  ⚠️ This URL must be publicly accessible via HTTPS. Use ngrok for local testing.
                </p>
              </div>

              {/* Verify Token */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verify Token
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={webhookInfo.verifyToken}
                    readOnly
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 font-mono text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(webhookInfo.verifyToken, 'token')}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 whitespace-nowrap"
                  >
                    {copied === 'token' ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  This token is used by Meta to verify your webhook endpoint.
                </p>
              </div>
            </div>

            <div className="border-l-4 border-primary-500 pl-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Step 2: Configure in Meta Business Suite</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>
                  Go to{' '}
                  <a
                    href={metaConfigUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 underline"
                  >
                    Meta for Developers
                  </a>
                </li>
                <li>Select your app → WhatsApp → Configuration</li>
                <li>Under "Webhook", click "Edit"</li>
                <li>Paste the <strong>Webhook URL</strong> in the "Callback URL" field</li>
                <li>Paste the <strong>Verify Token</strong> in the "Verify Token" field</li>
                <li>Click "Verify and Save"</li>
              </ol>
            </div>

            <div className="border-l-4 border-primary-500 pl-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Step 3: Subscribe to Webhook Fields</h3>
              <p className="text-gray-600 mb-2">
                After verification, subscribe to these webhook fields:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li><code className="px-2 py-1 bg-gray-100 rounded text-sm">messages</code> - Receive incoming messages</li>
                <li><code className="px-2 py-1 bg-gray-100 rounded text-sm">message_status</code> - Get delivery and read receipts</li>
                <li><code className="px-2 py-1 bg-gray-100 rounded text-sm">message_template_status_update</code> - Template approval status</li>
              </ul>
            </div>

            <div className="border-l-4 border-primary-500 pl-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Step 4: Test Your Webhook</h3>
              <p className="text-gray-600 mb-4">
                After configuration, test your webhook to ensure it's working correctly.
              </p>
              <button
                onClick={testWebhook}
                disabled={testing}
                className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {testing ? 'Testing...' : '🧪 Test Webhook'}
              </button>

              {testResult && (
                <div
                  className={`mt-4 p-4 rounded-md ${
                    testResult.success
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <p
                    className={`text-sm ${
                      testResult.success ? 'text-green-800' : 'text-red-800'
                    }`}
                  >
                    {testResult.success ? '✓' : '✗'} {testResult.message}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🔍 Troubleshooting</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Webhook Verification Failed?</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 text-sm">
                <li>Ensure your webhook URL is publicly accessible via HTTPS</li>
                <li>Check that the verify token matches exactly (case-sensitive)</li>
                <li>Make sure your backend server is running</li>
                <li>For local testing, use ngrok: <code className="px-2 py-1 bg-gray-100 rounded text-xs">ngrok http 3000</code></li>
                <li>Check firewall settings and security groups</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Not Receiving Messages?</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 text-sm">
                <li>Verify webhook is configured and subscribed to "messages" field</li>
                <li>Check that your backend is accessible from the internet</li>
                <li>Review backend logs for webhook POST requests</li>
                <li>Ensure database is writable</li>
                <li>Check the Messages page to see if messages are stored</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Testing Locally with ngrok</h3>
              <div className="bg-gray-50 rounded-md p-3 font-mono text-sm">
                <p className="text-gray-600 mb-2"># Install ngrok</p>
                <p className="text-gray-900">ngrok http 3000</p>
                <p className="text-gray-600 mt-3 mb-2"># Use the HTTPS URL provided (e.g., https://abc123.ngrok.io)</p>
                <p className="text-gray-900">Webhook URL: https://abc123.ngrok.io/webhook</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Need More Help?</h3>
              <p className="text-gray-700 text-sm">
                See the{' '}
                <a
                  href="https://developers.facebook.com/docs/whatsapp/webhooks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 underline"
                >
                  Meta Webhooks Documentation
                </a>
                {' '}or check the META_SETUP_GUIDE.md file for detailed instructions.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">📚 Quick Links</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <a
              href="https://developers.facebook.com/docs/whatsapp/webhooks"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-800 underline"
            >
              Webhooks Documentation
            </a>
            <a
              href="https://developers.facebook.com/apps"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-800 underline"
            >
              Meta for Developers
            </a>
            <a
              href="https://ngrok.com/download"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-800 underline"
            >
              Download ngrok
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};
