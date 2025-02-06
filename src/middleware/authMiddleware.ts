import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/tokenService';
import { createOAuthError } from '../services/errorHandler';
import LoggerService from '../services/loggerService';
import { PermissionScope } from '../scopemanager';

export const authMiddleware = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw createOAuthError.accessDenied('No authorization token');
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw createOAuthError.accessDenied('Invalid token format');
    }

    // Validate token
    const decodedToken = await TokenService.decodeToken(token);

    // Optional: Check specific permissions
    if (decodedToken.scopes) {
      req.user = {
        clientId: decodedToken.clientId as string,
        scopes: decodedToken.scopes as PermissionScope[]
      };
    }

    // Log successful authentication
    LoggerService.info('Token validated', { 
      clientId: decodedToken.clientId 
    });

    next();
  } catch (error) {
    LoggerService.error('Authentication failed', error as Error);
    next(error);
  }
};

// Middleware to check specific scopes
export const checkScopes = (requiredScopes: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userScopes = req.user?.scopes || [];
    
    const hasRequiredScopes = requiredScopes.every(scope => 
      userScopes.includes(scope)
    );

    if (!hasRequiredScopes) {
      return next(createOAuthError.accessDenied('Insufficient permissions'));
    }

    next();
  };
};