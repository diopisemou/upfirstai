import request from 'supertest';
import { TokenService } from '../services/tokenService';
import  {startServer, stopServer } from '../index';
import { App } from 'supertest/types';

let app: App;
beforeAll(() => {
  app = startServer(0); // Using port 0 lets the OS assign a random available port
});

afterAll(() => {
  stopServer();
});
describe('OAuth 2.0 API', () => {
  describe('Authorization Endpoint', () => {
    it('should return authorization code for valid request', async () => {
      const response = await request(app)
        .get('/api/oauth/authorize')
        .query({
          response_type: 'code',
          client_id: 'upfirst',
          redirect_uri: 'http://localhost:8081/process'
        });

      expect(response.status).toBe(302);
      expect(response.headers.location).toMatch(/^http:\/\/localhost:8081\/process\?code=/);
    });

    it('should reject request with invalid client', async () => {
      const response = await request(app)
        .get('/api/oauth/authorize')
        .query({
          response_type: 'code',
          client_id: 'invalid_client',
          redirect_uri: 'http://localhost:8081/process'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('Token Endpoint', () => {
    it('should issue access token for valid authorization code', async () => {
      const code = await TokenService.generateAuthorizationCode('upfirst', undefined);
      
      const response = await request(app)
        .post('/api/oauth/token')
        .send({
          grant_type: 'authorization_code',
          code: code,
          client_id: 'upfirst',
          redirect_uri: 'http://localhost:8081/process'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('token_type', 'bearer');
    });

    it('should fail for invalid authorization code', async () => {
        const code = await TokenService.generateAuthorizationCode('code', undefined);
        
        const response = await request(app)
          .post('/api/oauth/token')
          .send({
            grant_type: 'authorization_code',
            code: code,
            client_id: 'code',
            redirect_uri: 'http://localhost:8081/process'
          });
  
        expect(response.status).toBe(401);
        expect(response.body).not.toHaveProperty('access_token');
        expect(response.body).not.toHaveProperty('token_type', 'bearer');
      });
  });
});