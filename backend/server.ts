import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Database from './database';
import { ConfigModel } from './models/config.model';
import { TemplateModel } from './models/template.model';
import { MessageModel } from './models/message.model';
import { createConfigRoutes } from './routes/config.routes';
import { createWebhookRoutes } from './routes/webhook.routes';
import { createMessageRoutes } from './routes/message.routes';
import { createTemplateRoutes } from './routes/template.routes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = process.env.DATABASE_PATH || './greengate.db';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Initialize database
const database = new Database(DB_PATH);
const configModel = new ConfigModel(database);
const templateModel = new TemplateModel(database);
const messageModel = new MessageModel(database);

// Initialize database tables
database.initialize().catch(console.error);

// Routes
app.use('/api/config', createConfigRoutes(configModel));
app.use('/webhook', createWebhookRoutes(configModel, messageModel));
app.use('/api/messages', createMessageRoutes(messageModel, templateModel, configModel));
app.use('/api/templates', createTemplateRoutes(templateModel, configModel));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Greengate WhatsApp Business API',
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Greengate server running on port ${PORT}`);
  console.log(`📊 Database: ${DB_PATH}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Export for testing or external use
export { app, database, configModel, templateModel, messageModel };
