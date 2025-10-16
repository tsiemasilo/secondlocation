import { Handler } from '@netlify/functions';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { likedEvents } from '../../src/db/schema';
import { eq } from 'drizzle-orm';

const getDatabaseUrl = () => {
  return process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
};

const getDb = () => {
  const connectionString = getDatabaseUrl();
  if (!connectionString) {
    throw new Error('Database URL is not configured');
  }
  
  const client = postgres(connectionString, {
    max: 1,
    ssl: connectionString.includes('sslmode=require') ? 'require' : false,
  });
  
  return drizzle(client);
};

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const db = getDb();
    const sessionId = event.headers['x-session-id'] || 'anonymous';

    if (event.httpMethod === 'GET') {
      const liked = await db.select().from(likedEvents).where(eq(likedEvents.sessionId, sessionId));
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(liked),
      };
    }

    if (event.httpMethod === 'POST') {
      const { eventId, eventData } = JSON.parse(event.body || '{}');
      
      const existing = await db.select().from(likedEvents).where(eq(likedEvents.eventId, eventId));
      
      if (existing.length > 0) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(existing[0]),
        };
      }

      const [inserted] = await db.insert(likedEvents).values({
        eventId,
        eventData,
        sessionId,
      }).returning();

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(inserted),
      };
    }

    if (event.httpMethod === 'DELETE') {
      const eventId = event.path.split('/').pop();
      
      await db.delete(likedEvents).where(eq(likedEvents.eventId, eventId!));

      return {
        statusCode: 204,
        headers,
        body: '',
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('Database error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
