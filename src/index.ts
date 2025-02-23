import express, { Request, Response } from 'express';
import cors from 'cors';
import { authorizeController } from './controllers/authController';
import { tokenController } from './controllers/tokenController';
import { rateLimitConfig } from './rateLimit';
import { errorHandler } from './services/errorHandler';
import { authMiddleware } from './middleware/authMiddleware';
import { helloController } from './controllers/helloController';
//import path from 'path';

const app = express();
let server: any;
const PORT = process.env.PORT || 8080;

app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/hello', authMiddleware, helloController);


// Apply rate limiting to token requests
app.use('/api/hello', rateLimitConfig.hello);
app.use('/api/oauth/token', rateLimitConfig.token); // Apply rate limiting to this specific route
app.use('/api/oauth/authorize', rateLimitConfig.auth);

// OAuth Endpoints
app.get('/api/oauth/authorize', authorizeController);
app.post('/api/oauth/token', tokenController);



// app.use(express.static(path.join(__dirname, '../')));
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'view.html'));
// });

// Error Handling Middleware (should come AFTER route definitions)
app.use(errorHandler);

if(process.env.ENVIRONNEMENT !== 'test')
{
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });


  if (process.env.ENABLE_REDIRECT_PROCESSING === 'true') {
    app.get('/process', (req: Request, res: Response) => {
      const { code, state } = req.query;
      if (code) {
          return res.send(`Authorization successful! Code: ${code} State: ${state || 'N/A'}`);
      } else {
          return res.status(400).send('Authorization failed : Invalid request parameters');
      }
    });
    app.listen(8081, () => {
      console.log(`Server 2 running on port 8081`);
    });
  }
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