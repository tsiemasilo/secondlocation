import { pgTable, text, timestamp, uuid, jsonb, unique } from 'drizzle-orm/pg-core';

export const likedEvents = pgTable('liked_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: text('event_id').notNull(),
  eventData: jsonb('event_data').notNull(),
  likedAt: timestamp('liked_at').defaultNow().notNull(),
  sessionId: text('session_id').notNull(),
}, (table) => ({
  uniqueSessionEvent: unique().on(table.sessionId, table.eventId),
}));

export const userPreferences = pgTable('user_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: text('session_id').notNull().unique(),
  preferences: jsonb('preferences').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
