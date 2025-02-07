import request from 'supertest';
import { TokenService } from '../services/tokenService';
import  {startServer, stopServer } from '../index';
import { App } from 'supertest/types';
import LoggerService from '../services/loggerService';

let app: App;
beforeAll(() => {
  app = startServer(0); // Using port 0 lets the OS assign a random available port
});

afterAll(() => {
  stopServer();
});
describe('OAuth 2.0 API', () => {
  describe('Hello Endpoint', () => {
    it('should return a json with hello and the name given in parameters', async () => {
      const code = await TokenService.generateAuthorizationCode('upfirst', undefined);
      const token = await TokenService.generateTokenPair({
        clientId: 'upfirst',
        type: 'authorization_code',
        scopes: undefined
      });

 
      const response = await request(app)
        .post('/hello')
        .auth(
          (await token.accessToken).toString(),
          { type: 'bearer'}
        )
        .send({
          name: 'upfirst',
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');

    });
  });
});