import React, { useEffect, useState } from 'react';
import { apiService, Template } from '../services/api';
import { Layout } from '../components/Layout';

export const SendMessagePage: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Template message form
  const [toNumber, setToNumber] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [parameters, setParameters] = useState<string[]>(['']);

  // Text message form
  const [textToNumber, setTextToNumber] = useState('');
  const [textMessage, setTextMessage] = useState('');

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await apiService.getTemplates();
      // Filter only approved templates
      const approved = data.filter(t => t.status.toUpperCase() === 'APPROVED');
      setTemplates(approved);
    } catch (err) {
      console.error('Failed to load templates:', err);
    }
  };

  const handleAddParameter = () => {
    setParameters([...parameters, '']);
  };

  const handleRemoveParameter = (index: number) => {
    setParameters(parameters.filter((_, i) => i !== index));
  };

  const handleParameterChange = (index: number, value: string) => {
    const newParams = [...parameters];
    newParams[index] = value;
    setParameters(newParams);
  };

  const handleSendTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Build components array for parameters
      const components = [];
      if (parameters.length > 0 && parameters.some(p => p.trim())) {
        const validParams = parameters.filter(p => p.trim());
        if (validParams.length > 0) {
          components.push({
            type: 'body',
            parameters: validParams.map(p => ({
              type: 'text',
              text: p
            }))
          });
        }
      }

      await apiService.sendTemplateMessage({
        to_number: toNumber,
        template_name: selectedTemplate,
        components: components.length > 0 ? components : undefined
      });

      setSuccess(`Template message sent successfully to ${toNumber}`);
      setToNumber('');
      setSelectedTemplate('');
      setParameters(['']);
    } catch (err: any) {
      setError(err.response?.data?.details || err.response?.data?.error || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleSendText = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await apiService.sendTextMessage({
        to_number: textToNumber,
        text: textMessage
      });

      setSuccess(`Text message sent successfully to ${textToNumber}`);
      setTextToNumber('');
      setTextMessage('');
    } catch (err: any) {
      setError(err.response?.data?.details || err.response?.data?.error || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Send Message</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Template Message Form */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">📝 Send Template Message</h3>
            
            <form onSubmit={handleSendTemplate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  className="input"
                  value={toNumber}
                  onChange={(e) => setToNumber(e.target.value)}
                  placeholder="491234567890 (with country code, no +)"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Include country code without + symbol (e.g., 491234567890)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template <span className="text-red-500">*</span>
                </label>
                <select
                  className="input"
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  required
                >
                  <option value="">Select a template</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.name}>
                      {template.name} ({template.language_code})
                    </option>
                  ))}
                </select>
                {templates.length === 0 && (
                  <p className="text-xs text-orange-600 mt-1">
                    No approved templates available. Sync templates first.
                  </p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Parameters (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddParameter}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    + Add Parameter
                  </button>
                </div>
                {parameters.map((param, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      className="input"
                      value={param}
                      onChange={(e) => handleParameterChange(index, e.target.value)}
                      placeholder={`Parameter ${index + 1}`}
                    />
                    {parameters.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveParameter(index)}
                        className="btn btn-danger"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <p className="text-xs text-gray-500 mt-1">
                  For templates with variables like {`{{1}}`}, {`{{2}}`}, etc.
                </p>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading || !selectedTemplate}
              >
                {loading ? 'Sending...' : '📤 Send Template Message'}
              </button>
            </form>
          </div>

          {/* Text Message Form */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">💬 Send Text Message</h3>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                ⚠️ Text messages can only be sent within 24 hours of receiving a message from the user.
              </p>
            </div>

            <form onSubmit={handleSendText} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  className="input"
                  value={textToNumber}
                  onChange={(e) => setTextToNumber(e.target.value)}
                  placeholder="491234567890 (with country code, no +)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="input"
                  rows={6}
                  value={textMessage}
                  onChange={(e) => setTextMessage(e.target.value)}
                  placeholder="Type your message here..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {textMessage.length} characters
                </p>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? 'Sending...' : '📤 Send Text Message'}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Message Types</h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li><strong>Template Messages:</strong> Can be sent anytime to any number. Must be pre-approved by Meta.</li>
            <li><strong>Text Messages:</strong> Can only be sent within 24 hours after receiving a message from the user.</li>
            <li>Phone numbers must include country code without the + symbol (e.g., 491234567890 for Germany).</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};
