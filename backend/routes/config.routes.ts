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

  return router;
}
