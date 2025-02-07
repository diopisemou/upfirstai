import { PermissionScope } from '../services/scopeManager';


// Token Payload Interfaces
export interface TokenPayload {
    clientId: string;
    scopes: PermissionScope[] | undefined;
    type: 'authorization_code' | 'access_token' | 'refresh_token';
    exp?: number;
}
    
// Base OAuth Request Types
export interface OAuthAuthorizationRequest {
  response_type: string;
  client_id: string;
  redirect_uri: string;
  scope?: string;
  state?: string;
}

export interface OAuthTokenRequest {
  grant_type: 'authorization_code' | 'refresh_token';
  code?: string;
  refresh_token?: string;
  client_id: string;
  redirect_uri?: string;
}

// Token Response Interface
export interface OAuthTokenResponse {
    access_token: string;
    token_type: 'bearer';
    expires_in: number;
    refresh_token?: string;
    scope?: string;
}

// Client Configuration Interface
export interface OAuthClientConfig {
  clientId: string;
  clientSecret?: string;
  redirectUris: string[];
  allowedScopes?: PermissionScope[] | undefined;
  allowedGrantTypes: string[];
}

// Base OAuth Request Types
export interface ProcessRequest {
  code: string;
  state: string;
  client_id: string;
  redirect_uri: string;
  scope: string;
}

export interface HelloRequest {
  name: string;
}

// Token Response Interface
export interface HelloResponse {
    message: string;
    client_id: string;
    token_expiry_time: number;
}


// Extended Request Interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        clientId: string;
        scopes: PermissionScope[] | undefined;
        token_expiry_time: number | undefined;
      };
    }
  }
}