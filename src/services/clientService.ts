import { createOAuthError } from './errorHandler';
import { OAuthClientConfig } from '../types/oauth';

interface ClientConfig {
  clientId: string;
  redirectUris: string[];
  allowedGrantTypes: string[];
}

export class ClientService {
  private static readonly clients: Record<string, OAuthClientConfig> = {
    'upfirst': {
      clientId: 'upfirst',
      redirectUris: ['http://localhost:8081/process'],
      allowedGrantTypes: ['authorization_code', 'refresh_token']
    }
  };

  static validateClient(clientId: string): ClientConfig {
    const client = this.clients[clientId];
    if (!client) {
      throw createOAuthError.unauthorizedClient('Unknown client');
    }
    return client;
  }

  static validateRedirectUri(client: ClientConfig, redirectUri: string): void {
    if (!client.redirectUris.includes(redirectUri)) {
      throw createOAuthError.invalidRequest('Invalid redirect URI');
    }
  }

  static validateGrantType(client: ClientConfig, grantType: string): void {
    if (!client.allowedGrantTypes.includes(grantType)) {
      throw createOAuthError.unsupportedResponseType('Unsupported grant type');
    }
  }
}