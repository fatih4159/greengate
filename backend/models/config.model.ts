import Database from '../database';

export interface Config {
  key: string;
  value: string;
  created_at?: string;
  updated_at?: string;
}

export class ConfigModel {
  constructor(private db: Database) {}

  async set(key: string, value: string): Promise<void> {
    const existing = await this.get(key);
    if (existing) {
      await this.db.run(
        'UPDATE config SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?',
        [value, key]
      );
    } else {
      await this.db.run(
        'INSERT INTO config (key, value) VALUES (?, ?)',
        [key, value]
      );
    }
  }

  async get(key: string): Promise<string | undefined> {
    const result = await this.db.get('SELECT value FROM config WHERE key = ?', [key]);
    return result?.value;
  }

  async getAll(): Promise<Config[]> {
    return await this.db.all('SELECT * FROM config');
  }

  async delete(key: string): Promise<void> {
    await this.db.run('DELETE FROM config WHERE key = ?', [key]);
  }

  async getWhatsAppConfig(): Promise<{
    accessToken?: string;
    wabaId?: string;
    phoneNumberId?: string;
    verifyToken?: string;
  }> {
    const accessToken = await this.get('meta_access_token');
    const wabaId = await this.get('waba_id');
    const phoneNumberId = await this.get('phone_number_id');
    const verifyToken = await this.get('webhook_verify_token');

    return {
      accessToken,
      wabaId,
      phoneNumberId,
      verifyToken
    };
  }

  async setWhatsAppConfig(config: {
    accessToken?: string;
    wabaId?: string;
    phoneNumberId?: string;
    verifyToken?: string;
  }): Promise<void> {
    if (config.accessToken) await this.set('meta_access_token', config.accessToken);
    if (config.wabaId) await this.set('waba_id', config.wabaId);
    if (config.phoneNumberId) await this.set('phone_number_id', config.phoneNumberId);
    if (config.verifyToken) await this.set('webhook_verify_token', config.verifyToken);
  }
}
