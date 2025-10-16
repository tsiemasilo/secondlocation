import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const getDatabaseUrl = () => {
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_NETLIFY_DATABASE_URL || import.meta.env.VITE_DATABASE_URL;
  }
  return import.meta.env.VITE_DATABASE_URL;
};

const connectionString = getDatabaseUrl();

if (!connectionString) {
  throw new Error('Database URL is not configured');
}

const client = postgres(connectionString, {
  max: 1,
  ssl: connectionString.includes('sslmode=require') ? 'require' : false,
});

export const db = drizzle(client, { schema });
