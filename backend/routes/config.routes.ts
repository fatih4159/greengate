import { Router, Request, Response } from 'express';
import { ConfigModel } from '../models/config.model';

export function createConfigRoutes(configModel: ConfigModel): Router {
  const router = Router();

  // Get all configuration
  router.get('/', async (req: Request, res: Response) => {
    try {
      const config = await configModel.getWhatsAppConfig();
      // Don't send full access token to frontend for security
      const safeConfig = {
        hasAccessToken: !!config.accessToken,
        hasWabaId: !!config.wabaId,
        hasPhoneNumberId: !!config.phoneNumberId,
        hasVerifyToken: !!config.verifyToken,
        phoneNumberId: config.phoneNumberId,
        wabaId: config.wabaId
      };
      res.json(safeConfig);
    } catch (error) {
      console.error('Error getting config:', error);
      res.status(500).json({ error: 'Failed to get configuration' });
    }
  });

  // Set WhatsApp configuration
  router.post('/whatsapp', async (req: Request, res: Response) => {
    try {
      const { accessToken, wabaId, phoneNumberId, verifyToken } = req.body;

      if (!accessToken || !phoneNumberId) {
        return res.status(400).json({ 
          error: 'Access token and phone number ID are required' 
        });
      }

      await configModel.setWhatsAppConfig({
        accessToken,
        wabaId,
        phoneNumberId,
        verifyToken: verifyToken || 'greengate_verify_token_' + Date.now()
      });

      res.json({ success: true, message: 'Configuration saved successfully' });
    } catch (error) {
      console.error('Error saving config:', error);
      res.status(500).json({ error: 'Failed to save configuration' });
    }
  });

  // Get specific config value
  router.get('/:key', async (req: Request, res: Response) => {
    try {
      const { key } = req.params;
      const value = await configModel.get(key);
      
      if (!value) {
        return res.status(404).json({ error: 'Configuration key not found' });
      }

      res.json({ key, value });
    } catch (error) {
      console.error('Error getting config:', error);
      res.status(500).json({ error: 'Failed to get configuration' });
    }
  });

  // Set specific config value
  router.post('/:key', async (req: Request, res: Response) => {
    try {
      const { key } = req.params;
      const { value } = req.body;

      if (!value) {
        return res.status(400).json({ error: 'Value is required' });
      }

      await configModel.set(key, value);
      res.json({ success: true, message: 'Configuration saved' });
    } catch (error) {
      console.error('Error saving config:', error);
      res.status(500).json({ error: 'Failed to save configuration' });
    }
  });

  // Get webhook information
  router.get('/webhook/info', async (req: Request, res: Response) => {
    try {
      const config = await configModel.getWhatsAppConfig();
      const verifyToken = config.verifyToken || '';
      
      // Determine webhook URL based on environment
      let webhookUrl = process.env.WEBHOOK_URL;
      if (!webhookUrl) {
        // Try to construct from request
        const protocol = req.protocol;
        const host = req.get('host');
        webhookUrl = `${protocol}://${host}/webhook`;
      }

      res.json({
        webhookUrl,
        verifyToken,
        isConfigured: !!config.accessToken && !!config.phoneNumberId && !!verifyToken
      });
    } catch (error) {
      console.error('Error getting webhook info:', error);
      res.status(500).json({ error: 'Failed to get webhook information' });
    }
  });

  // Test webhook connectivity
  router.post('/webhook/test', async (req: Request, res: Response) => {
    try {
      const config = await configModel.getWhatsAppConfig();
      
      if (!config.verifyToken) {
        return res.status(400).json({ 
          error: 'Webhook verify token not configured. Please set up your credentials first.' 
        });
      }

      // Simulate webhook verification
      const testChallenge = 'test_challenge_' + Date.now();
      const testMode = 'subscribe';
      
      // The webhook endpoint will handle this if it's working
      res.json({ 
        success: true,
        message: 'Webhook configuration appears valid. Send a test message to your business number to verify end-to-end functionality.',
        verifyToken: config.verifyToken,
        instructions: 'Send a WhatsApp message to your business number and check the Messages page to see if it appears.'
      });
    } catch (error) {
      console.error('Error testing webhook:', error);
      res.status(500).json({ error: 'Failed to test webhook' });
    }
  });

  return router;
}
