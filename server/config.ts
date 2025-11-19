import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables first
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

// Validate required environment variables
if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in server/.env');
}

if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not defined, using default (not secure for production)');
}

export const config = {
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  port: process.env.PORT || 3001,
};
