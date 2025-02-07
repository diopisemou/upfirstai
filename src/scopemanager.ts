export enum PermissionScope {

    PUBLIC_READ = 'public:read',
    PUBLIC_WRITE = 'public:write',

    // User-level scopes
    PROFILE_READ = 'profile:read',
    PROFILE_WRITE = 'profile:write',
    
    // Resource-level scopes
    USERS_READ = 'users:read',
    USERS_WRITE = 'users:write',
    
    // System-level scopes
    ADMIN_ACCESS = 'admin:access',
    SYSTEM_MANAGE = 'system:manage'
  }
  
  export interface ClientPermissions {
    clientId: string;
    allowedScopes: PermissionScope[];
  }
  
  export class ScopeManager {
    private static readonly clientPermissions: Record<string, ClientPermissions> = {
      'upfirst': {
        clientId: 'upfirst',
        allowedScopes: [
          PermissionScope.PUBLIC_READ,
          PermissionScope.PUBLIC_WRITE,
          PermissionScope.PROFILE_READ,
          PermissionScope.PROFILE_WRITE
        ]
      },
      'admin-client': {
        clientId: 'admin-client',
        allowedScopes: [
          PermissionScope.ADMIN_ACCESS,
          PermissionScope.SYSTEM_MANAGE
        ]
      }
    };
  
    static validateScopes(
      clientId: string, 
      requestedScopes: PermissionScope[]
    ): boolean {
      const clientConfig = this.clientPermissions[clientId];
      if (!clientConfig) return false;
  
      return requestedScopes.every(scope => 
        clientConfig.allowedScopes.includes(scope)
      );
    }
  
    static getDefaultScopes(clientId: string): PermissionScope[] {
      return this.clientPermissions[clientId]?.allowedScopes || [];
    }
  }