import { Router, Request, Response } from 'express';
import { TemplateModel } from '../models/template.model';
import { ConfigModel } from '../models/config.model';
import { WhatsAppService } from '../services/whatsapp.service';

export function createTemplateRoutes(
  templateModel: TemplateModel,
  configModel: ConfigModel
): Router {
  const router = Router();
  const whatsappService = new WhatsAppService(configModel);

  // Get all templates
  router.get('/', async (req: Request, res: Response) => {
    try {
      const templates = await templateModel.findAll();
      res.json(templates);
    } catch (error) {
      console.error('Error fetching templates:', error);
      res.status(500).json({ error: 'Failed to fetch templates' });
    }
  });

  // Get template by ID
  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const template = await templateModel.findById(id);

      if (!template) {
        return res.status(404).json({ error: 'Template not found' });
      }

      res.json(template);
    } catch (error) {
      console.error('Error fetching template:', error);
      res.status(500).json({ error: 'Failed to fetch template' });
    }
  });

  // Sync templates from Meta API
  router.post('/sync', async (req: Request, res: Response) => {
    try {
      console.log('Starting template sync from Meta API...');
      
      const metaTemplates = await whatsappService.getTemplates();
      
      console.log(`Found ${metaTemplates.length} templates from Meta API`);

      let syncedCount = 0;
      for (const metaTemplate of metaTemplates) {
        try {
          const templateData = {
            name: metaTemplate.name,
            language_code: metaTemplate.language || 'en',
            category: metaTemplate.category || 'UTILITY',
            meta_template_id: metaTemplate.id,
            status: metaTemplate.status || 'UNKNOWN',
            content_json: JSON.stringify(metaTemplate)
          };

          await templateModel.upsertByName(templateData);
          syncedCount++;
        } catch (err) {
          console.error(`Error syncing template ${metaTemplate.name}:`, err);
        }
      }

      console.log(`Successfully synced ${syncedCount} templates`);

      res.json({
        success: true,
        synced_count: syncedCount,
        total_count: metaTemplates.length
      });
    } catch (error: any) {
      console.error('Error syncing templates:', error);
      res.status(500).json({ 
        error: 'Failed to sync templates',
        details: error.message 
      });
    }
  });

  // Create a new template
  router.post('/', async (req: Request, res: Response) => {
    try {
      const { name, language_code, category, components } = req.body;

      if (!name || !language_code || !category || !components) {
        return res.status(400).json({ 
          error: 'name, language_code, category, and components are required' 
        });
      }

      // Create template via Meta API
      const metaTemplate = {
        name,
        language: language_code,
        category,
        components
      };

      const result = await whatsappService.createTemplate(metaTemplate);

      // Save to database
      const templateData = {
        name,
        language_code,
        category,
        meta_template_id: result.id,
        status: result.status || 'PENDING',
        content_json: JSON.stringify(result)
      };

      const templateId = await templateModel.create(templateData);

      res.json({
        success: true,
        template_id: templateId,
        meta_template: result
      });
    } catch (error: any) {
      console.error('Error creating template:', error);
      res.status(500).json({ 
        error: 'Failed to create template',
        details: error.message 
      });
    }
  });

  // Update a template
  router.put('/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;

      const existing = await templateModel.findById(id);
      if (!existing) {
        return res.status(404).json({ error: 'Template not found' });
      }

      await templateModel.update(id, updateData);

      res.json({
        success: true,
        message: 'Template updated successfully'
      });
    } catch (error: any) {
      console.error('Error updating template:', error);
      res.status(500).json({ 
        error: 'Failed to update template',
        details: error.message 
      });
    }
  });

  // Delete a template
  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);

      const template = await templateModel.findById(id);
      if (!template) {
        return res.status(404).json({ error: 'Template not found' });
      }

      // Delete from Meta API
      try {
        await whatsappService.deleteTemplate(template.name);
      } catch (error) {
        console.error('Error deleting from Meta API:', error);
        // Continue to delete from local database even if Meta API fails
      }

      // Delete from database
      await templateModel.delete(id);

      res.json({
        success: true,
        message: 'Template deleted successfully'
      });
    } catch (error: any) {
      console.error('Error deleting template:', error);
      res.status(500).json({ 
        error: 'Failed to delete template',
        details: error.message 
      });
    }
  });

  return router;
}
