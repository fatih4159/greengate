import { Router, Request, Response } from 'express';
import { MessageModel } from '../models/message.model';
import { TemplateModel } from '../models/template.model';
import { ConfigModel } from '../models/config.model';
import { WhatsAppService } from '../services/whatsapp.service';

export function createMessageRoutes(
  messageModel: MessageModel,
  templateModel: TemplateModel,
  configModel: ConfigModel
): Router {
  const router = Router();
  const whatsappService = new WhatsAppService(configModel);

  // Get all messages
  router.get('/', async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const messages = await messageModel.findAll(limit);
      res.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });

  // Send a template message
  router.post('/send', async (req: Request, res: Response) => {
    try {
      const { to_number, template_name, components } = req.body;

      if (!to_number || !template_name) {
        return res.status(400).json({ 
          error: 'to_number and template_name are required' 
        });
      }

      // Get template from database
      const template = await templateModel.findByName(template_name);
      
      if (!template) {
        return res.status(404).json({ error: 'Template not found in database' });
      }

      // Send message via WhatsApp API
      const result = await whatsappService.sendTemplateMessage({
        to: to_number,
        templateName: template_name,
        languageCode: template.language_code,
        components: components || []
      });

      // Get phone number from config
      const config = await configModel.getWhatsAppConfig();

      // Save to database
      const messageData = {
        whatsapp_id: result.messages?.[0]?.id,
        to_number,
        from_number: config.phoneNumberId || '',
        template_name,
        direction: 'OUTBOUND' as const,
        status: 'SENT',
        body: `Template: ${template_name}`,
        timestamp: new Date().toISOString()
      };

      const messageId = await messageModel.create(messageData);

      res.json({
        success: true,
        message_id: messageId,
        whatsapp_id: result.messages?.[0]?.id,
        result
      });
    } catch (error: any) {
      console.error('Error sending message:', error);
      res.status(500).json({ 
        error: 'Failed to send message',
        details: error.message 
      });
    }
  });

  // Send a text message
  router.post('/send-text', async (req: Request, res: Response) => {
    try {
      const { to_number, text } = req.body;

      if (!to_number || !text) {
        return res.status(400).json({ 
          error: 'to_number and text are required' 
        });
      }

      // Send message via WhatsApp API
      const result = await whatsappService.sendTextMessage({
        to: to_number,
        text
      });

      // Get phone number from config
      const config = await configModel.getWhatsAppConfig();

      // Save to database
      const messageData = {
        whatsapp_id: result.messages?.[0]?.id,
        to_number,
        from_number: config.phoneNumberId || '',
        direction: 'OUTBOUND' as const,
        status: 'SENT',
        body: text,
        timestamp: new Date().toISOString()
      };

      const messageId = await messageModel.create(messageData);

      res.json({
        success: true,
        message_id: messageId,
        whatsapp_id: result.messages?.[0]?.id,
        result
      });
    } catch (error: any) {
      console.error('Error sending text message:', error);
      res.status(500).json({ 
        error: 'Failed to send text message',
        details: error.message 
      });
    }
  });

  // Get message by ID
  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const message = await messageModel.findById(id);

      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }

      res.json(message);
    } catch (error) {
      console.error('Error fetching message:', error);
      res.status(500).json({ error: 'Failed to fetch message' });
    }
  });

  return router;
}
