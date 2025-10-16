import { Event } from "@/types/event";

const TICKETMASTER_API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY;
const BASE_URL = "https://app.ticketmaster.com/discovery/v2";

interface TicketmasterEvent {
  id: string;
  name: string;
  info?: string;
  description?: string;
  url: string;
  images: Array<{ url: string; width: number; height: number }>;
  dates: {
    start: {
      localDate: string;
      localTime?: string;
      dateTime?: string;
    };
  };
  priceRanges?: Array<{
    min: number;
    max: number;
    currency: string;
  }>;
  _embedded?: {
    venues: Array<{
      name: string;
      city?: { name: string };
      state?: { name: string };
      country?: { name: string };
    }>;
  };
}

interface TicketmasterResponse {
  _embedded?: {
    events: TicketmasterEvent[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

const USD_TO_ZAR_RATE = 18.5;

function convertToZAR(usdPrice: number): number {
  return Math.round(usdPrice * USD_TO_ZAR_RATE);
}

function transformTicketmasterEvent(tmEvent: TicketmasterEvent): Event {
  const venue = tmEvent._embedded?.venues?.[0];
  const location = venue
    ? `${venue.name}${venue.city ? ", " + venue.city.name : ""}${venue.state ? ", " + venue.state.name : ""}`
    : "Location TBA";

  const image = tmEvent.images?.find((img) => img.width >= 640) || tmEvent.images?.[0];
  const imageUrl = image?.url || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop";

  const dateTime = tmEvent.dates.start.dateTime || 
    `${tmEvent.dates.start.localDate}T${tmEvent.dates.start.localTime || "19:00:00"}`;

  const priceRange = tmEvent.priceRanges?.[0];
  const currency = priceRange?.currency || "USD";
  const basePrice = priceRange?.min || 50;
  
  const priceInZAR = currency === "USD" ? convertToZAR(basePrice) : basePrice;

  const description = tmEvent.info || tmEvent.description || `Experience ${tmEvent.name}! Get your tickets now for an unforgettable event.`;

  return {
    id: tmEvent.id,
    name: tmEvent.name,
    description: description,
    location: location,
    price: Math.round(priceInZAR),
    dateTime: dateTime,
    imageUrl: imageUrl,
    liked: false,
  };
}

export async function fetchEvents(params: {
  keyword?: string;
  city?: string;
  countryCode?: string;
  size?: number;
}): Promise<Event[]> {
  try {
    const { keyword = "", city = "", countryCode = "ZA", size = 20 } = params;

    const queryParams = new URLSearchParams({
      apikey: TICKETMASTER_API_KEY || "",
      size: size.toString(),
      sort: "date,asc",
    });

    if (keyword) queryParams.append("keyword", keyword);
    if (city) queryParams.append("city", city);
    if (countryCode) queryParams.append("countryCode", countryCode);

    const url = `${BASE_URL}/events.json?${queryParams.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Ticketmaster API error: ${response.status}`);
    }

    const data: TicketmasterResponse = await response.json();

    if (!data._embedded?.events || data._embedded.events.length === 0) {
      return [];
    }

    return data._embedded.events.map(transformTicketmasterEvent);
  } catch (error) {
    console.error("Error fetching events from Ticketmaster:", error);
    throw error;
  }
}

export async function fetchSouthAfricanEvents(): Promise<Event[]> {
  try {
    const zaEvents = await fetchEvents({
      countryCode: "ZA",
      size: 20,
    });
    
    const uniqueByNameAndDate = Array.from(
      new Map(zaEvents.map(event => [`${event.name}|${event.dateTime}`, event])).values()
    );
    
    const uniqueByName = Array.from(
      new Map(uniqueByNameAndDate.map(event => [event.name, event])).values()
    );
    
    console.log(`Found ${uniqueByName.length} unique events in South Africa (${zaEvents.length} total showtimes)`);
    console.log("Unique events:", uniqueByName.map(e => e.name));
    
    if (uniqueByName.length > 0) {
      if (uniqueByName.length < 10) {
        console.log("Limited unique events in South Africa, fetching additional global events...");
        const globalEvents = await fetchEvents({
          countryCode: "US",
          size: 50,
        });
        
        console.log(`Fetched ${globalEvents.length} global events`);
        
        const uniqueGlobalByNameAndDate = Array.from(
          new Map(globalEvents.map(event => [`${event.name}|${event.dateTime}`, event])).values()
        );
        
        const uniqueGlobalByName = Array.from(
          new Map(uniqueGlobalByNameAndDate.map(event => [event.name, event])).values()
        );
        
        console.log(`${uniqueGlobalByName.length} unique global events`);
        
        const combinedEvents = [...uniqueByName, ...uniqueGlobalByName];
        const allUniqueEvents = Array.from(
          new Map(combinedEvents.map(event => [event.name, event])).values()
        );
        
        console.log(`Returning ${allUniqueEvents.length} total unique events (${uniqueByName.length} from ZA, ${allUniqueEvents.length - uniqueByName.length} new from global)`);
        return allUniqueEvents.slice(0, 20);
      }
      
      return uniqueByName;
    }
    
    console.log("No events found in South Africa, fetching global events...");
    const globalEvents = await fetchEvents({
      size: 20,
    });
    const uniqueGlobalEvents = Array.from(
      new Map(globalEvents.map(event => [event.name, event])).values()
    );
    
    console.log(`Found ${uniqueGlobalEvents.length} unique global events`);
    return uniqueGlobalEvents;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}
