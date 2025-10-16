import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq, and } from 'drizzle-orm';
import { likedEvents, userPreferences } from '../src/db/schema';

const connectionString = process.env.DATABASE_URL || '';
const client = postgres(connectionString);
export const db = drizzle(client);

export async function getLikedEventsBySession(sessionId: string) {
  return await db
    .select()
    .from(likedEvents)
    .where(eq(likedEvents.sessionId, sessionId));
}

export async function addLikedEvent(sessionId: string, eventId: string, eventData: any) {
  return await db
    .insert(likedEvents)
    .values({
      sessionId,
      eventId,
      eventData,
    })
    .returning();
}

export async function removeLikedEvent(sessionId: string, eventId: string) {
  return await db
    .delete(likedEvents)
    .where(
      and(
        eq(likedEvents.sessionId, sessionId),
        eq(likedEvents.eventId, eventId)
      )
    )
    .returning();
}

export async function getUserPreferences(sessionId: string) {
  const result = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.sessionId, sessionId));
  
  return result[0] || null;
}

export async function saveUserPreferences(sessionId: string, preferences: any) {
  const existing = await getUserPreferences(sessionId);
  
  if (existing) {
    return await db
      .update(userPreferences)
      .set({
        preferences,
        updatedAt: new Date(),
      })
      .where(eq(userPreferences.sessionId, sessionId))
      .returning();
  } else {
    return await db
      .insert(userPreferences)
      .values({
        sessionId,
        preferences,
      })
      .returning();
  }
}
