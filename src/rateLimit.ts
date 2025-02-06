import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import LoggerService from './services/loggerService';

export const rateLimitConfig = {
  auth: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many authentication attempts',
    handler: (req: Request, res: Response, next: NextFunction, options) => {
      LoggerService.warn('Rate limit exceeded', {
        ip: req.ip,
        path: req.path
      });
      res.status(429).json({
        error: options.message,
        retryAfter: Math.ceil(options.windowMs / 1000 / 60)
      });
    }
  }),
  token: rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 50, // Limit token requests
    message: 'Too many token requests'
  })
};