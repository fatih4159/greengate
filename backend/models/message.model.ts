import Database from '../database';

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

export class MessageModel {
  constructor(private db: Database) {}

  async create(message: Message): Promise<number> {
    const result = await this.db.run(
      `INSERT INTO messages (whatsapp_id, to_number, from_number, template_name, direction, status, body, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        message.whatsapp_id || null,
        message.to_number,
        message.from_number,
        message.template_name || null,
        message.direction,
        message.status,
        message.body || null,
        message.timestamp || new Date().toISOString()
      ]
    );
    return result.lastID;
  }

  async findAll(limit: number = 50): Promise<Message[]> {
    return await this.db.all(
      'SELECT * FROM messages ORDER BY timestamp DESC LIMIT ?',
      [limit]
    );
  }

  async findById(id: number): Promise<Message | undefined> {
    return await this.db.get('SELECT * FROM messages WHERE id = ?', [id]);
  }

  async findByWhatsAppId(whatsappId: string): Promise<Message | undefined> {
    return await this.db.get('SELECT * FROM messages WHERE whatsapp_id = ?', [whatsappId]);
  }

  async updateStatus(whatsappId: string, status: string): Promise<void> {
    await this.db.run(
      'UPDATE messages SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE whatsapp_id = ?',
      [status, whatsappId]
    );
  }

  async updateStatusById(id: number, status: string): Promise<void> {
    await this.db.run(
      'UPDATE messages SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );
  }

  async delete(id: number): Promise<void> {
    await this.db.run('DELETE FROM messages WHERE id = ?', [id]);
  }
}
