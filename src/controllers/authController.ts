import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/tokenService';
import { ClientService } from '../services/clientService';
import { ScopeManager, PermissionScope } from '../scopemanager';
import LoggerService from '../services/loggerService';
import { MonitoringService } from '../services/monitoringService';
import { OAuthAuthorizationRequest } from '../types/oauth';
import { CodeStorage } from '../helpers/storage';

const codeStorage = new CodeStorage();
export const authorizeController = 
  async (req: Request<{}, {}, {}, OAuthAuthorizationRequest>, res: Response, next: NextFunction) => {
    try {
      const { 
        response_type, 
        client_id, 
        redirect_uri, 
        scope,
        state 
      } = req.query;

      // Validate request parameters
    if (response_type !== 'code' ) {
        return res.status(400).send('Invalid request parameters');
    }

      // Validate client
      const client = ClientService.validateClient(client_id as string);
      
      // Validate redirect URI
      ClientService.validateRedirectUri(client, redirect_uri as string);

      // Parse and validate scopes
      const requestedScopes = scope 
        ? (scope as string).split(' ').map(s => s as PermissionScope)
        : ScopeManager.getDefaultScopes(client_id);

      // Validate scopes for client
      if (!ScopeManager.validateScopes(client_id, requestedScopes)) {
        return res.status(403).json({ error: 'Invalid scopes' });
      }

      // Generate authorization code
      const code = await TokenService.generateAuthorizationCode(
        client_id as string, 
        requestedScopes
      );
      codeStorage.save(code, client_id as string, redirect_uri as string);
      // Log and monitor
      LoggerService.info('Authorization code generated', { 
        clientId: client_id,
        scopes: requestedScopes 
      });
      MonitoringService.getInstance().recordAuthRequest();

      // Redirect with authorization code
      const redirectUrl = new URL(redirect_uri as string);
      redirectUrl.searchParams.append('code', code);
      if (state) redirectUrl.searchParams.append('state', state as string);

      res.redirect(302, redirectUrl.toString());

    } catch (error) {
      next(error);
    }
  };