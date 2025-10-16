import { Event } from "@/types/event";

const FOURSQUARE_API_KEY = import.meta.env.VITE_FOURSQUARE_API_KEY;
const BASE_URL = "https://places-api.foursquare.com/places";

interface FoursquareVenue {
  fsq_id: string;
  name: string;
  description?: string;
  location: {
    formatted_address: string;
    locality?: string;
    region?: string;
    country?: string;
  };
  geocodes: {
    main: {
      latitude: number;
      longitude: number;
    };
  };
  categories: Array<{
    id: number;
    name: string;
  }>;
  photos?: Array<{
    prefix: string;
    suffix: string;
    width: number;
    height: number;
  }>;
  hours?: {
    display: string;
  };
  price?: number;
}

interface FoursquareResponse {
  results: FoursquareVenue[];
}

const USD_TO_ZAR_RATE = 18.5;

interface FoursquareVenueNew {
  fsq_place_id?: string;
  fsq_id?: string;
  name: string;
  description?: string;
  location: {
    formatted_address: string;
    locality?: string;
    region?: string;
    country?: string;
  };
  latitude?: number;
  longitude?: number;
  geocodes?: {
    main: {
      latitude: number;
      longitude: number;
    };
  };
  categories: Array<{
    id: number | string;
    name: string;
  }>;
  photos?: Array<{
    prefix: string;
    suffix: string;
    width: number;
    height: number;
  }>;
  hours?: {
    display: string;
  };
  price?: number;
}

function transformFoursquareVenue(venue: FoursquareVenue | FoursquareVenueNew): Event {
  const location = venue.location.formatted_address || 
    `${venue.location.locality || ''}${venue.location.region ? ', ' + venue.location.region : ''}`;

  const photo = venue.photos?.[0];
  const imageUrl = photo 
    ? `${photo.prefix}${photo.width}x${photo.height}${photo.suffix}`
    : "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop";

  const estimatedPrice = venue.price ? venue.price * 100 * USD_TO_ZAR_RATE : 150;

  const categoryName = venue.categories[0]?.name || "Nightlife";
  const description = venue.description || 
    `${categoryName} venue in ${venue.location.locality || 'the area'}. ${venue.hours?.display || 'Check venue for hours.'}`;

  const dateTime = new Date();
  dateTime.setDate(dateTime.getDate() + 1);
  dateTime.setHours(21, 0, 0, 0);

  const venueId = (venue as any).fsq_place_id || (venue as any).fsq_id || 'unknown';
  
  return {
    id: `fsq_${venueId}`,
    name: venue.name,
    description: description,
    location: location,
    price: Math.round(estimatedPrice),
    dateTime: dateTime.toISOString(),
    imageUrl: imageUrl,
    liked: false,
  };
}

export async function searchNightlifeVenues(params: {
  latitude?: number;
  longitude?: number;
  city?: string;
  limit?: number;
}): Promise<Event[]> {
  try {
    if (!FOURSQUARE_API_KEY) {
      console.log("Foursquare API key not configured");
      return [];
    }

    const { latitude, longitude, city, limit = 20 } = params;

    const queryParams = new URLSearchParams({
      categories: "13032,13033,13035,13037", // Nightlife categories: bars, nightclubs, lounges, dance clubs
      limit: limit.toString(),
    });

    if (latitude && longitude) {
      queryParams.append("ll", `${latitude},${longitude}`);
      queryParams.append("radius", "10000");
    } else if (city) {
      queryParams.append("near", city);
    }

    const url = `${BASE_URL}/search?${queryParams.toString()}`;

    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${FOURSQUARE_API_KEY}`,
        "Fsq-Api-Version": "2025-01-01",
      },
    });

    if (!response.ok) {
      throw new Error(`Foursquare API error: ${response.status}`);
    }

    const data: FoursquareResponse = await response.json();

    if (!data.results || data.results.length === 0) {
      return [];
    }

    return data.results.map(transformFoursquareVenue);
  } catch (error) {
    console.error("Error fetching venues from Foursquare:", error);
    return [];
  }
}

export async function fetchSouthAfricanNightlifeVenues(): Promise<Event[]> {
  try {
    const API_BASE = import.meta.env.PROD ? '/.netlify/functions' : '/api';
    const url = `${API_BASE}/foursquare-venues`;

    const response = await fetch(url);

    if (!response.ok) {
      console.log("Foursquare API not available");
      return [];
    }

    const data: FoursquareResponse = await response.json();

    if (!data.results || data.results.length === 0) {
      console.log("No Foursquare venues found");
      return [];
    }

    const venues = data.results.map(transformFoursquareVenue);
    const uniqueVenues = Array.from(
      new Map(venues.map(venue => [venue.name, venue])).values()
    );

    console.log(`Found ${uniqueVenues.length} unique nightlife venues from Foursquare`);
    return uniqueVenues.slice(0, 20);
  } catch (error) {
    console.error("Error fetching Foursquare venues:", error);
    return [];
  }
}
