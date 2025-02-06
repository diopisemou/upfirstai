import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/tokenService';
import { ClientService } from '../services/clientService';
import { rateLimitConfig } from '../rateLimit';
import LoggerService from '../services/loggerService';
import { MonitoringService } from '../services/monitoringService';
import { createOAuthError } from '../services/errorHandler';
import { OAuthTokenRequest, OAuthTokenResponse } from '../types/oauth';
import { CodeStorage } from '../helpers/storage';
const codeStorage = new CodeStorage();

export const tokenController = [
  rateLimitConfig.token,
  async (req: Request<{}, {}, OAuthTokenRequest>, res: Response<OAuthTokenResponse>, next: NextFunction) => {
    try {
      const { 
        grant_type, 
        code, 
        client_id, 
        redirect_uri,
        refresh_token 
      } = req.body;

      // Validate client
      const client = ClientService.validateClient(client_id);
      
      // Validate grant type
      ClientService.validateGrantType(client, grant_type);

      let tokenPayload;

      switch (grant_type) {
        case 'authorization_code':
          // Validate redirect URI
          if(!redirect_uri)
            throw createOAuthError.invalidRequest('Missing redirect URI');

          ClientService.validateRedirectUri(client, redirect_uri);
          
          // Verify authorization code
          if(!code)
            throw createOAuthError.invalidRequest('Missing code');
          tokenPayload = await TokenService.verifyAuthorizationCode(code);
          break;

        case 'refresh_token':
          // Verify refresh token
          if(!refresh_token)
            throw createOAuthError.invalidRequest('Missing refresh_token');
          tokenPayload = await TokenService.verifyRefreshToken(refresh_token);
          break;

        default:
          throw createOAuthError.unsupportedResponseType('Unsupported grant type');
      }

      // Generate new token pair
      const { accessToken, refreshToken } = TokenService.generateTokenPair(tokenPayload);
      codeStorage.delete(code as string);
      // Log and monitor
      LoggerService.info('Token issued', { 
        clientId: client_id,
        grantType: grant_type 
      });
      MonitoringService.getInstance().recordTokenIssue();

      res.json({
        access_token: await accessToken,
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: await refreshToken
      });
    } catch (error) {
      next(error);
    }
  }
];