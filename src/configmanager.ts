import dotenv from 'dotenv';
import fs from 'fs';

class ConfigManager {
  private static instance: ConfigManager;
  private config: Record<string, string> = {};

  private constructor() {
    this.loadConfig();
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private loadConfig() {
    const envFile = process.env.NODE_ENV 
      ? `.env.${process.env.NODE_ENV}` 
      : '.env';

    if (fs.existsSync(envFile)) {
      dotenv.config({ path: envFile });
    }

    this.config = {
      PORT: process.env.PORT || '8080',
      JWT_SECRET: process.env.JWT_SECRET || this.generateFallbackSecret(),
      TOKEN_EXPIRY: process.env.TOKEN_EXPIRY || '3600',
      LOG_LEVEL: process.env.LOG_LEVEL || 'info',
      ENVIRONNEMENT: process.env.ENVIRONNEMENT || 'prod'
      
    };
  }

  private generateFallbackSecret(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  get(key: string): string {
    return this.config[key];
  }
}

export default ConfigManager.getInstance();