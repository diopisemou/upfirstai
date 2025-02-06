import request from 'supertest';
import {startServer, stopServer } from '../index';
import { App } from 'supertest/types';

let app: App;
beforeAll(() => {
  app = startServer(0); // Using port 0 lets the OS assign a random available port
});


afterAll(() => {
  stopServer();
});

describe('OAuth Authorization Flow', () => {
  describe('GET /api/oauth/authorize', () => {
    it('should generate authorization code', async () => {
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

    it('should reject invalid client', async () => {
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
});