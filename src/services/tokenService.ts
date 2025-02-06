import * as jose from 'jose';
import { createOAuthError } from './errorHandler';
import ConfigManager from '../configmanager';
import LoggerService from './loggerService';
import { PermissionScope } from '../scopemanager';
import { TokenPayload } from '../types/oauth';

export class TokenService {
 

  static async decodeToken(token: string): Promise<jose.JWTPayload> {
    try {
      const secretKey = new TextEncoder().encode(ConfigManager.get('JWT_SECRET'));
      const { payload } = await jose.jwtVerify(token, secretKey);
      return payload;
    } catch (error) {
      LoggerService.error('Token decoding failed', error as Error);
      throw createOAuthError.accessDenied('Cannot decode token');
    }
  }

  private static getSecretKey() {
    return new TextEncoder().encode(ConfigManager.get('JWT_SECRET'));
  }

  static async verifyAuthorizationCode(code: string) {
    try {
      const { payload } = await jose.jwtVerify(code, this.getSecretKey());
      
      if (payload.type !== 'authorization_code') {
        throw createOAuthError.accessDenied('Invalid code type');
      }

      let resultPayload: TokenPayload = {
        clientId: payload.clientId as string,
        scopes: payload.scopes as PermissionScope[] | undefined,
        type: payload.type
      };
      return resultPayload;

    } catch (error) {
      throw createOAuthError.accessDenied('Invalid or expired authorization code');
    }
  }

  static async verifyRefreshToken(refreshToken: string) {
    try {
      const { payload } = await jose.jwtVerify(refreshToken, this.getSecretKey());
      
      if (payload.type !== 'refresh_token') {
        throw createOAuthError.accessDenied('Invalid refresh token');
      }

      let resultPayload: TokenPayload = {
        clientId: payload.clientId as string,
        scopes: payload.scopes as PermissionScope[] | undefined,
        type: payload.type
      };
      return resultPayload;
    } catch (error) {
      throw createOAuthError.accessDenied('Invalid or expired refresh token');
    }
  }

  static generateTokenPair(tokenPayload: TokenPayload) {
    const accessToken = this.generateAccessToken(tokenPayload);
    const refreshToken = this.generateRefreshToken(tokenPayload);

    return { accessToken, refreshToken };
  }

  static async generateAuthorizationCode(
    clientId: string, 
    scopes: PermissionScope[] | undefined
  ): Promise<string> {

    const payload: TokenPayload = {
        clientId, 
        scopes,
        type: 'authorization_code'
      };

      
    return await new jose.SignJWT({ ...payload })
      .setIssuedAt()
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('10m')
      .sign(this.getSecretKey());
  }

  private static async generateAccessToken(tokenPayload: TokenPayload): Promise<string> {
    return await new jose.SignJWT({ 
      ...tokenPayload, 
      type: 'access_token' 
    })
      .setIssuedAt()
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(this.getSecretKey());
  }

  private static async generateRefreshToken(tokenPayload: TokenPayload): Promise<string> {
    return await new jose.SignJWT({ 
      ...tokenPayload, 
      type: 'refresh_token' 
    })
      .setIssuedAt()
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('30d')
      .sign(this.getSecretKey());
  }
}