import { Event } from '@/types/event';

interface ComputicketEvent {
  id: string;
  name: string;
  location: string;
  date: string;
  imageUrl: string;
  url: string;
  source: string;
  price: string;
  category: string;
}

interface ComputicketResponse {
  events: ComputicketEvent[];
}

function transformComputicketEvent(event: ComputicketEvent): Event {
  const parsedDate = parseComputicketDate(event.date);
  
  return {
    id: event.id,
    name: event.name,
    dateTime: parsedDate.toISOString(),
    location: event.location,
    imageUrl: event.imageUrl || 'https://via.placeholder.com/400x300?text=Event',
    description: `${event.name} - ${event.category}`,
    price: 0,
    liked: false,
  };
}

function parseComputicketDate(dateStr: string): Date {
  const now = new Date();
  
  if (!dateStr || dateStr === 'TBA') {
    return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  }

  const datePattern = /(\d{1,2})\s+(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s+(\d{4})/i;
  const match = dateStr.match(datePattern);
  
  if (match) {
    const day = parseInt(match[1]);
    const monthStr = match[2].toUpperCase();
    const year = parseInt(match[3]);
    
    const months: { [key: string]: number } = {
      JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
      JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11
    };
    
    const month = months[monthStr];
    return new Date(year, month, day, 18, 0, 0);
  }

  return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
}

export async function fetchComputicketEvents(): Promise<Event[]> {
  try {
    const API_BASE = import.meta.env.PROD ? '/.netlify/functions' : '/api';
    const url = `${API_BASE}/computicket-events`;

    const response = await fetch(url);

    if (!response.ok) {
      console.log("Computicket API not available");
      return [];
    }

    const data: ComputicketResponse = await response.json();

    if (!data.events || data.events.length === 0) {
      console.log("No Computicket events found");
      return [];
    }

    const events = data.events.map(transformComputicketEvent);
    const uniqueEvents = Array.from(
      new Map(events.map(event => [event.name, event])).values()
    );

    console.log(`Found ${uniqueEvents.length} unique events from Computicket`);
    return uniqueEvents;
  } catch (error) {
    console.error("Error fetching Computicket events:", error);
    return [];
  }
}
