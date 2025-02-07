import { Request, Response, NextFunction } from 'express';

class OAuthError extends Error {
  status: number | undefined;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
      this.status = status;
      this.code = code;
  }
}

export const errorHandler = (
  err: Error | OAuthError, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  console.error(err);

  const status = err instanceof OAuthError ? err.status : 500;
  const errorResponse = {
    error: err.message,
    ...(err instanceof OAuthError && err.code ? { error_code: err.code } : {})
  };

  res.status(status as number).json(errorResponse);
};

export const createOAuthError = {
  invalidRequest: (message = 'Invalid request') => 
    new OAuthError(message, 400, 'invalid_request'),
  
  unauthorizedClient: (message = 'Unauthorized client') => 
    new OAuthError(message, 401, 'unauthorized_client'),
  
  accessDenied: (message = 'Access denied') => 
    new OAuthError(message, 403, 'access_denied'),
  
  unsupportedResponseType: (message = 'Unsupported response type') => 
    new OAuthError(message, 400, 'unsupported_response_type'),
  
  serverError: (message = 'Internal server error') => 
    new OAuthError(message, 500, 'server_error')
};