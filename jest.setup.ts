import dotenv from 'dotenv';
import path from 'path';

// Load test environment variables
dotenv.config({ 
  path: path.resolve(__dirname, '../.env.test') 
});