import React, { useEffect, useState } from 'react';
import { apiService, Message } from '../services/api';
import { Layout } from '../components/Layout';

export const MessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [limit, setLimit] = useState(50);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await apiService.getMessages(limit);
      setMessages(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [limit]);

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'sent') return 'bg-blue-100 text-blue-800';
    if (statusLower === 'delivered') return 'bg-green-100 text-green-800';
    if (statusLower === 'read') return 'bg-purple-100 text-purple-800';
    if (statusLower === 'received') return 'bg-yellow-100 text-yellow-800';
    if (statusLower === 'failed') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getDirectionIcon = (direction: string) => {
    return direction === 'OUTBOUND' ? '↑' : '↓';
  };

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Message History</h2>
          <div className="flex items-center space-x-4">
            <select
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
              className="input"
            >
              <option value={10}>Last 10</option>
              <option value={25}>Last 25</option>
              <option value={50}>Last 50</option>
              <option value={100}>Last 100</option>
            </select>
            <button
              onClick={loadMessages}
              className="btn btn-secondary"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="card">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-2 text-gray-500">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No messages</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start sending messages or wait for incoming messages
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`border rounded-lg p-4 ${
                    message.direction === 'OUTBOUND' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg ${message.direction === 'OUTBOUND' ? 'text-blue-600' : 'text-green-600'}`}>
                        {getDirectionIcon(message.direction)}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {message.direction === 'OUTBOUND' ? `To: ${message.to_number}` : `From: ${message.from_number}`}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(message.status)}`}>
                        {message.status}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {message.timestamp ? new Date(message.timestamp).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                  
                  {message.template_name && (
                    <div className="text-xs text-gray-600 mb-1">
                      📝 Template: <span className="font-mono">{message.template_name}</span>
                    </div>
                  )}
                  
                  {message.body && (
                    <div className="mt-2 text-gray-800 bg-white rounded p-3 border">
                      {message.body}
                    </div>
                  )}
                  
                  {message.whatsapp_id && (
                    <div className="mt-2 text-xs text-gray-500">
                      Message ID: {message.whatsapp_id}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
