import express from 'express';
import cors from 'cors';
import { authorizeController } from './controllers/authController';
import { tokenController } from './controllers/tokenController';
import { processController } from './controllers/processController';
import { rateLimitConfig } from './rateLimit';
import { errorHandler } from './services/errorHandler';
import { authMiddleware } from './middleware/authMiddleware';

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
app.post('/api/oauth/token', authMiddleware, tokenController);

app.post('/process', processController);

// Error Handling Middleware (should come AFTER route definitions)
app.use(errorHandler);

if(process.env.ENVIRONNEMENT !== 'test')
{
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  app.listen(8081, () => {
    console.log(`Server 2 running on port 8081`);
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