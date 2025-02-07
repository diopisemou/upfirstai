import { Request, Response, NextFunction } from 'express';
import LoggerService from '../services/loggerService';
import { ProcessRequest } from '../types/oauth';
import { CodeStorage } from '../helpers/storage';
import { TokenService } from '../services/tokenService';

const codeStorage = new CodeStorage();
export const processController = 
  async (req: Request<{}, {}, {}, ProcessRequest>, res: Response, next: NextFunction) => {
    try {
      const { 
        code,
        state, 
        client_id, 
        redirect_uri, 
        scope,
      } = req.query;

      // Validate request parameters
    if (code !== undefined ) {
        return res.status(400).send('Invalid request parameters');
    }

     // Validate token
     const decodedToken = await TokenService.decodeToken(code);
     
      // Log and monitor
      LoggerService.info('Authorization code generated', { 
        clientId: client_id, 
      });
      // MonitoringService.getInstance().recordAuthRequest();

      // Redirect with authorization code
      const redirectUrl = new URL(redirect_uri as string);
      redirectUrl.searchParams.append('code', code);
      if (state) redirectUrl.searchParams.append('state', state as string);

      res.redirect(302, redirectUrl.toString());

    } catch (error) {
      next(error);
    }
  };