import Database from '../database';

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

export class TemplateModel {
  constructor(private db: Database) {}

  async create(template: Template): Promise<number> {
    const result = await this.db.run(
      `INSERT INTO templates (name, language_code, category, meta_template_id, status, content_json)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        template.name,
        template.language_code,
        template.category,
        template.meta_template_id || null,
        template.status,
        template.content_json
      ]
    );
    return result.lastID;
  }

  async findAll(): Promise<Template[]> {
    return await this.db.all('SELECT * FROM templates ORDER BY created_at DESC');
  }

  async findByName(name: string): Promise<Template | undefined> {
    return await this.db.get('SELECT * FROM templates WHERE name = ?', [name]);
  }

  async findById(id: number): Promise<Template | undefined> {
    return await this.db.get('SELECT * FROM templates WHERE id = ?', [id]);
  }

  async update(id: number, template: Partial<Template>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    if (template.name) {
      fields.push('name = ?');
      values.push(template.name);
    }
    if (template.language_code) {
      fields.push('language_code = ?');
      values.push(template.language_code);
    }
    if (template.category) {
      fields.push('category = ?');
      values.push(template.category);
    }
    if (template.meta_template_id) {
      fields.push('meta_template_id = ?');
      values.push(template.meta_template_id);
    }
    if (template.status) {
      fields.push('status = ?');
      values.push(template.status);
    }
    if (template.content_json) {
      fields.push('content_json = ?');
      values.push(template.content_json);
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    await this.db.run(
      `UPDATE templates SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }

  async delete(id: number): Promise<void> {
    await this.db.run('DELETE FROM templates WHERE id = ?', [id]);
  }

  async upsertByName(template: Template): Promise<void> {
    const existing = await this.findByName(template.name);
    if (existing) {
      await this.update(existing.id!, template);
    } else {
      await this.create(template);
    }
  }
}
