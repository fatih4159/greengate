import axios from 'axios';
import { ConfigModel } from '../models/config.model';

export interface SendTemplateMessageParams {
  to: string;
  templateName: string;
  languageCode?: string;
  components?: any[];
}

export interface SendTextMessageParams {
  to: string;
  text: string;
}

export class WhatsAppService {
  private readonly apiVersion = 'v18.0';
  private readonly baseUrl = 'https://graph.facebook.com';

  constructor(private configModel: ConfigModel) {}

  async sendTemplateMessage(params: SendTemplateMessageParams): Promise<any> {
    const config = await this.configModel.getWhatsAppConfig();

    if (!config.accessToken || !config.phoneNumberId) {
      throw new Error('WhatsApp configuration not set. Please configure access token and phone number ID.');
    }

    const url = `${this.baseUrl}/${this.apiVersion}/${config.phoneNumberId}/messages`;

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: params.to,
      type: 'template',
      template: {
        name: params.templateName,
        language: {
          code: params.languageCode || 'en'
        },
        components: params.components || []
      }
    };

    try {
      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error: any) {
      console.error('Error sending template message:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.error?.message || 
        'Failed to send template message'
      );
    }
  }

  async sendTextMessage(params: SendTextMessageParams): Promise<any> {
    const config = await this.configModel.getWhatsAppConfig();

    if (!config.accessToken || !config.phoneNumberId) {
      throw new Error('WhatsApp configuration not set. Please configure access token and phone number ID.');
    }

    const url = `${this.baseUrl}/${this.apiVersion}/${config.phoneNumberId}/messages`;

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: params.to,
      type: 'text',
      text: {
        preview_url: false,
        body: params.text
      }
    };

    try {
      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error: any) {
      console.error('Error sending text message:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.error?.message || 
        'Failed to send text message'
      );
    }
  }

  async getTemplates(): Promise<any[]> {
    const config = await this.configModel.getWhatsAppConfig();

    if (!config.accessToken || !config.wabaId) {
      throw new Error('WhatsApp configuration not set. Please configure access token and WABA ID.');
    }

    const url = `${this.baseUrl}/${this.apiVersion}/${config.wabaId}/message_templates`;

    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${config.accessToken}`
        }
      });

      return response.data.data || [];
    } catch (error: any) {
      console.error('Error fetching templates:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.error?.message || 
        'Failed to fetch templates'
      );
    }
  }

  async createTemplate(template: any): Promise<any> {
    const config = await this.configModel.getWhatsAppConfig();

    if (!config.accessToken || !config.wabaId) {
      throw new Error('WhatsApp configuration not set. Please configure access token and WABA ID.');
    }

    const url = `${this.baseUrl}/${this.apiVersion}/${config.wabaId}/message_templates`;

    try {
      const response = await axios.post(url, template, {
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error: any) {
      console.error('Error creating template:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.error?.message || 
        'Failed to create template'
      );
    }
  }

  async deleteTemplate(templateName: string): Promise<void> {
    const config = await this.configModel.getWhatsAppConfig();

    if (!config.accessToken || !config.wabaId) {
      throw new Error('WhatsApp configuration not set. Please configure access token and WABA ID.');
    }

    const url = `${this.baseUrl}/${this.apiVersion}/${config.wabaId}/message_templates`;

    try {
      await axios.delete(url, {
        headers: {
          'Authorization': `Bearer ${config.accessToken}`
        },
        params: {
          name: templateName
        }
      });
    } catch (error: any) {
      console.error('Error deleting template:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.error?.message || 
        'Failed to delete template'
      );
    }
  }
}
