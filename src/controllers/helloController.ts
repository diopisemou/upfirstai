import { Request, Response, NextFunction } from 'express';
import { rateLimitConfig } from '../rateLimit';
import { HelloRequest, HelloResponse } from '../types/oauth';


export const helloController = [
  rateLimitConfig.token,
  async (req: Request<{}, {}, HelloRequest>, res: Response<HelloResponse>, next: NextFunction) => {
    try {
      const { 
        name
      } = req.body;

      res.json({
        message: `Hello ${name}`,
        client_id: req.user?.clientId as string,
        token_expiry_time: req.user?.token_expiry_time as number
      });



    } catch (error) {
      next(error);
    }
  }
];