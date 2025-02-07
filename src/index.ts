import express from 'express';
import cors from 'cors';
import { authorizeController } from './controllers/authController';
import { tokenController } from './controllers/tokenController';
import { rateLimitConfig } from './rateLimit';
import { errorHandler } from './services/errorHandler';

const app = express();
let server: any;
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to token requests
app.use('/api/oauth/token', rateLimitConfig.token); // Apply rate limiting to this specific route
app.use('/api/oauth/authorize', rateLimitConfig.auth);

// OAuth Endpoints
app.get('/api/oauth/authorize', authorizeController);
app.post('/api/oauth/token', tokenController);

// Error Handling Middleware (should come AFTER route definitions)
app.use(errorHandler);

if(process.env.ENVIRONNEMENT !== 'test')
{
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export const startServer = (port: number) => {
  server = app.listen(port);
  return server;
};

export const stopServer = () => {
  if (server) {
    server.close();
  }
};

export default app;