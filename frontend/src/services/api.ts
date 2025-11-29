import axios from 'axios';

const API_BASE_URL = '/api';

export interface WhatsAppConfig {
  accessToken?: string;
  wabaId?: string;
  phoneNumberId?: string;
  verifyToken?: string;
}

export interface ConfigStatus {
  hasAccessToken: boolean;
  hasWabaId: boolean;
  hasPhoneNumberId: boolean;
  hasVerifyToken: boolean;
  phoneNumberId?: string;
  wabaId?: string;
}

export interface Template {
  id?: number;
  name: string;
  language_code: string;
  category: string;
  meta_template_id?: string;
  status: string;
  content_json: string;
  created_at?: string;
  updated_at?: string;
}

export interface Message {
  id?: number;
  whatsapp_id?: string;
  to_number: string;
  from_number: string;
  template_name?: string;
  direction: 'INBOUND' | 'OUTBOUND';
  status: string;
  body?: string;
  timestamp?: string;
  created_at?: string;
  updated_at?: string;
}

export interface WebhookInfo {
  webhookUrl: string;
  verifyToken: string;
  isConfigured: boolean;
}

export interface WebhookTestResult {
  success: boolean;
  message: string;
  verifyToken?: string;
  instructions?: string;
}

class ApiService {
  // Config endpoints
  async getConfig(): Promise<ConfigStatus> {
    const response = await axios.get(`${API_BASE_URL}/config`);
    return response.data;
  }

  async setWhatsAppConfig(config: WhatsAppConfig): Promise<void> {
    await axios.post(`${API_BASE_URL}/config/whatsapp`, config);
  }

  // Template endpoints
  async getTemplates(): Promise<Template[]> {
    const response = await axios.get(`${API_BASE_URL}/templates`);
    return response.data;
  }

  async getTemplate(id: number): Promise<Template> {
    const response = await axios.get(`${API_BASE_URL}/templates/${id}`);
    return response.data;
  }

  async syncTemplates(): Promise<{ success: boolean; synced_count: number; total_count: number }> {
    const response = await axios.post(`${API_BASE_URL}/templates/sync`);
    return response.data;
  }

  async createTemplate(template: {
    name: string;
    language_code: string;
    category: string;
    components: any[];
  }): Promise<any> {
    const response = await axios.post(`${API_BASE_URL}/templates`, template);
    return response.data;
  }

  async updateTemplate(id: number, template: Partial<Template>): Promise<void> {
    await axios.put(`${API_BASE_URL}/templates/${id}`, template);
  }

  async deleteTemplate(id: number): Promise<void> {
    await axios.delete(`${API_BASE_URL}/templates/${id}`);
  }

  // Message endpoints
  async getMessages(limit: number = 50): Promise<Message[]> {
    const response = await axios.get(`${API_BASE_URL}/messages?limit=${limit}`);
    return response.data;
  }

  async getMessage(id: number): Promise<Message> {
    const response = await axios.get(`${API_BASE_URL}/messages/${id}`);
    return response.data;
  }

  async sendTemplateMessage(data: {
    to_number: string;
    template_name: string;
    components?: any[];
  }): Promise<any> {
    const response = await axios.post(`${API_BASE_URL}/messages/send`, data);
    return response.data;
  }

  async sendTextMessage(data: {
    to_number: string;
    text: string;
  }): Promise<any> {
    const response = await axios.post(`${API_BASE_URL}/messages/send-text`, data);
    return response.data;
  }

  // Webhook endpoints
  async getWebhookInfo(): Promise<WebhookInfo> {
    const response = await axios.get(`${API_BASE_URL}/config/webhook/info`);
    return response.data;
  }

  async testWebhook(): Promise<WebhookTestResult> {
    const response = await axios.post(`${API_BASE_URL}/config/webhook/test`);
    return response.data;
  }
}

export const apiService = new ApiService();
