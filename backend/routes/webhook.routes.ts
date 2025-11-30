import { Router, Request, Response } from 'express';
import { ConfigModel } from '../models/config.model';
import { MessageModel } from '../models/message.model';

export function createWebhookRoutes(
  configModel: ConfigModel,
  messageModel: MessageModel
): Router {
  const router = Router();

  // Webhook verification (GET request from Meta)
  router.get('/', async (req: Request, res: Response) => {
    try {
      const mode = req.query['hub.mode'];
      const token = req.query['hub.verify_token'];
      const challenge = req.query['hub.challenge'];

      console.log('Webhook verification request received');
      console.log('Query params:', req.query);
      console.log('Mode:', mode, 'Token:', token, 'Challenge:', challenge);

      if (mode === 'subscribe') {
        // Get verify token from config
        const verifyToken = await configModel.get('webhook_verify_token');

        if (token === verifyToken) {
          console.log('Webhook verified successfully');
          res.status(200).send(challenge);
        } else {
          console.error('Webhook verification failed: token mismatch');
          res.status(403).json({ error: 'Verification token mismatch' });
        }
      } else {
        console.error('Webhook verification failed: invalid mode');
        res.status(400).json({ error: 'Invalid mode' });
      }
    } catch (error) {
      console.error('Error in webhook verification:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Webhook for receiving messages and status updates (POST request from Meta)
  router.post('/', async (req: Request, res: Response) => {
    try {
      const body = req.body;

      console.log('Webhook POST received:', JSON.stringify(body, null, 2));

      // Acknowledge receipt immediately
      res.status(200).send('EVENT_RECEIVED');

      // Process webhook data asynchronously
      if (body.object === 'whatsapp_business_account') {
        const entries = body.entry || [];

        for (const entry of entries) {
          const changes = entry.changes || [];

          for (const change of changes) {
            const value = change.value;

            if (!value) continue;

            // Get phone number from metadata
            const phoneNumberId = value.metadata?.phone_number_id;
            const displayPhoneNumber = value.metadata?.display_phone_number;

            // Process messages
            if (value.messages && value.messages.length > 0) {
              for (const message of value.messages) {
                await processInboundMessage(
                  message,
                  displayPhoneNumber,
                  messageModel
                );
              }
            }

            // Process message status updates
            if (value.statuses && value.statuses.length > 0) {
              for (const status of value.statuses) {
                await processStatusUpdate(status, messageModel);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error processing webhook:', error);
      // Don't send error to Meta - we already sent 200 OK
    }
  });

  return router;
}

// Helper function to process inbound messages
async function processInboundMessage(
  message: any,
  fromNumber: string,
  messageModel: MessageModel
): Promise<void> {
  try {
    const messageData = {
      whatsapp_id: message.id,
      to_number: fromNumber, // Our business number
      from_number: message.from,
      direction: 'INBOUND' as const,
      status: 'RECEIVED',
      body: extractMessageBody(message),
      timestamp: new Date(parseInt(message.timestamp) * 1000).toISOString()
    };

    // Check if message already exists
    const existing = await messageModel.findByWhatsAppId(message.id);
    if (!existing) {
      await messageModel.create(messageData);
      console.log('Saved inbound message:', message.id);
    } else {
      console.log('Message already exists:', message.id);
    }
  } catch (error) {
    console.error('Error processing inbound message:', error);
  }
}

// Helper function to extract message body based on type
function extractMessageBody(message: any): string {
  if (message.type === 'text') {
    return message.text?.body || '';
  } else if (message.type === 'image') {
    return `[Image: ${message.image?.caption || 'No caption'}]`;
  } else if (message.type === 'video') {
    return `[Video: ${message.video?.caption || 'No caption'}]`;
  } else if (message.type === 'audio') {
    return '[Audio message]';
  } else if (message.type === 'document') {
    return `[Document: ${message.document?.filename || 'Unknown'}]`;
  } else if (message.type === 'location') {
    return `[Location: ${message.location?.latitude}, ${message.location?.longitude}]`;
  } else if (message.type === 'contacts') {
    return '[Contact card]';
  } else {
    return `[${message.type || 'Unknown message type'}]`;
  }
}

// Helper function to process status updates
async function processStatusUpdate(
  status: any,
  messageModel: MessageModel
): Promise<void> {
  try {
    const messageId = status.id;
    const newStatus = status.status?.toUpperCase() || 'UNKNOWN';

    console.log(`Status update for message ${messageId}: ${newStatus}`);

    // Update message status in database
    const existing = await messageModel.findByWhatsAppId(messageId);
    if (existing) {
      await messageModel.updateStatus(messageId, newStatus);
      console.log(`Updated message ${messageId} status to ${newStatus}`);
    } else {
      console.log(`Message ${messageId} not found in database`);
    }
  } catch (error) {
    console.error('Error processing status update:', error);
  }
}
