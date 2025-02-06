import winston from 'winston';
import ConfigManager from '../configmanager';

class LoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: ConfigManager.get('LOG_LEVEL'),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ 
          filename: 'logs/upfirstai_api_ts.log',
          maxsize: 5242880, // 5MB
          maxFiles: 5
        })
      ]
    });
  }

  info(message: string, meta?: any) {
    this.logger.info(message, meta);
  }

  error(message: string, error?: Error) {
    this.logger.error(message, { 
      error: error?.message,
      stack: error?.stack
    });
  }

  warn(message: string, meta?: any) {
    this.logger.warn(message, meta);
  }
}

export default new LoggerService();