import { Request, Response, NextFunction } from 'express';
import LoggerService from '../services/loggerService';
import { ProcessRequest } from '../types/oauth';
import { TokenService } from '../services/tokenService';

export const processController = 
  async (req: Request<{}, {}, {}, ProcessRequest>, res: Response, next: NextFunction) => {
    try {
      const { 
        code,
        state
      } = req.query;

      // Validate request parameters
    if (code !== undefined ) {
        return res.status(400).send('Invalid request parameters');
    }

     // Validate token
     const decodedToken = await TokenService.decodeToken(code);
     
      // Log and monitor
      LoggerService.info('Authorization code generated', { 
        clientId: decodedToken.aud, 
        state: state
      });
      // MonitoringService.getInstance().recordAuthRequest(); 

      res.redirect(200, '/');

    } catch (error) {
      next(error);
    }
  };