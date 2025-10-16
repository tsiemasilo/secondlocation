import { Event } from '@/types/event';
import { getSessionId } from '@/lib/session';

const API_BASE = import.meta.env.PROD ? '/.netlify/functions' : '/api';

export async function getLikedEvents(): Promise<Event[]> {
  try {
    const response = await fetch(`${API_BASE}/liked-events`, {
      headers: {
        'x-session-id': getSessionId(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch liked events');
    }

    const data = await response.json();
    return data.map((item: any) => item.eventData);
  } catch (error) {
    console.error('Error fetching liked events:', error);
    return [];
  }
}

export async function addLikedEvent(event: Event): Promise<void> {
  try {
    await fetch(`${API_BASE}/liked-events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': getSessionId(),
      },
      body: JSON.stringify({
        eventId: event.id,
        eventData: event,
      }),
    });
  } catch (error) {
    console.error('Error adding liked event:', error);
    throw error;
  }
}

export async function removeLikedEvent(eventId: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/liked-events/${eventId}`, {
      method: 'DELETE',
      headers: {
        'x-session-id': getSessionId(),
      },
    });
  } catch (error) {
    console.error('Error removing liked event:', error);
    throw error;
  }
}
