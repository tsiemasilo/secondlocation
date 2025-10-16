import { Event } from "@/types/event";

const YELP_API_KEY = import.meta.env.VITE_YELP_API_KEY;
const BASE_URL = "https://api.yelp.com/v3";

interface YelpEvent {
  id: string;
  name: string;
  description?: string;
  category: string;
  is_free: boolean;
  cost?: number;
  cost_max?: number;
  event_site_url: string;
  image_url?: string;
  time_start: string;
  time_end?: string;
  location: {
    address1?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    display_address: string[];
  };
  latitude?: number;
  longitude?: number;
  attending_count?: number;
  interested_count?: number;
}

interface YelpEventsResponse {
  total: number;
  events: YelpEvent[];
}

const USD_TO_ZAR_RATE = 18.5;

function transformYelpEvent(yelpEvent: YelpEvent): Event {
  const location = yelpEvent.location.display_address.join(", ") || "Location TBA";

  const imageUrl = yelpEvent.image_url || 
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop";

  const price = yelpEvent.is_free 
    ? 0 
    : (yelpEvent.cost || 20) * USD_TO_ZAR_RATE;

  const description = yelpEvent.description || 
    `${yelpEvent.category} event. ${yelpEvent.attending_count ? `${yelpEvent.attending_count} attending` : 'Join the fun!'}`;

  return {
    id: `yelp_${yelpEvent.id}`,
    name: yelpEvent.name,
    description: description,
    location: location,
    price: Math.round(price),
    dateTime: yelpEvent.time_start,
    imageUrl: imageUrl,
    liked: false,
  };
}

export async function searchYelpEvents(params: {
  location?: string;
  latitude?: number;
  longitude?: number;
  categories?: string;
  limit?: number;
}): Promise<Event[]> {
  try {
    if (!YELP_API_KEY) {
      console.log("Yelp API key not configured");
      return [];
    }

    const { location, latitude, longitude, categories = "nightlife,music-and-nightlife", limit = 20 } = params;

    const queryParams = new URLSearchParams({
      categories: categories,
      limit: limit.toString(),
    });

    if (location) {
      queryParams.append("location", location);
    } else if (latitude && longitude) {
      queryParams.append("latitude", latitude.toString());
      queryParams.append("longitude", longitude.toString());
    }

    const url = `${BASE_URL}/events?${queryParams.toString()}`;

    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${YELP_API_KEY}`,
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Yelp API error: ${response.status}`);
    }

    const data: YelpEventsResponse = await response.json();

    if (!data.events || data.events.length === 0) {
      return [];
    }

    return data.events.map(transformYelpEvent);
  } catch (error) {
    console.error("Error fetching events from Yelp:", error);
    return [];
  }
}

export async function fetchSouthAfricanYelpEvents(): Promise<Event[]> {
  try {
    const cities = [
      "Cape Town, South Africa",
      "Johannesburg, South Africa",
      "Durban, South Africa",
    ];

    const allEvents: Event[] = [];

    for (const city of cities) {
      const events = await searchYelpEvents({
        location: city,
        limit: 10,
      });
      allEvents.push(...events);
    }

    const uniqueEvents = Array.from(
      new Map(allEvents.map(event => [event.name, event])).values()
    );

    console.log(`Found ${uniqueEvents.length} unique events from Yelp`);
    return uniqueEvents;
  } catch (error) {
    console.error("Error fetching Yelp events:", error);
    return [];
  }
}
