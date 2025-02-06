export class CodeStorage {
    private readonly codes = new Map<string, { clientId: string; redirectUri: string }>();
  
    save(code: string, clientId: string, redirectUri: string) {
      this.codes.set(code, { clientId, redirectUri });
      setTimeout(() => this.delete(code), 60000); // 1 minute expiration
    }
  
    isValid(code: string, clientId: string, redirectUri: string) {
      const entry = this.codes.get(code);
      return entry && 
             entry.clientId === clientId && 
             entry.redirectUri === redirectUri;
    }
  
    delete(code: string) {
      this.codes.delete(code);
    }
  }