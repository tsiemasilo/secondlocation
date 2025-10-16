import { Event } from "@/types/event";

const EVENTBRITE_API_KEY = import.meta.env.VITE_EVENTBRITE_API_KEY;
const BASE_URL = "https://www.eventbriteapi.com/v3";

interface EventbriteVenue {
  name: string;
  address?: {
    city?: string;
    region?: string;
    country?: string;
    localized_address_display?: string;
  };
}

interface EventbriteEvent {
  id: string;
  name: {
    text: string;
  };
  description: {
    text: string;
  };
  start: {
    local: string;
    utc: string;
  };
  logo?: {
    url: string;
  };
  ticket_availability?: {
    minimum_ticket_price?: {
      major_value: string;
      currency: string;
    };
  };
  venue?: EventbriteVenue;
}

interface EventbriteResponse {
  events: EventbriteEvent[];
  pagination: {
    object_count: number;
    page_number: number;
    page_size: number;
    page_count: number;
  };
}

const USD_TO_ZAR_RATE = 18.5;

function convertToZAR(usdPrice: number, currency: string): number {
  if (currency === "ZAR") return Math.round(usdPrice);
  return Math.round(usdPrice * USD_TO_ZAR_RATE);
}

function transformEventbriteEvent(ebEvent: EventbriteEvent): Event {
  const venue = ebEvent.venue;
  const location = venue?.address?.localized_address_display || 
    `${venue?.name || ""}${venue?.address?.city ? ", " + venue.address.city : ""}${venue?.address?.region ? ", " + venue.address.region : ""}` ||
    "Location TBA";

  const imageUrl = ebEvent.logo?.url || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop";

  const priceData = ebEvent.ticket_availability?.minimum_ticket_price;
  const basePrice = priceData ? parseFloat(priceData.major_value) : 50;
  const currency = priceData?.currency || "USD";
  
  const priceInZAR = convertToZAR(basePrice, currency);

  const description = ebEvent.description?.text?.substring(0, 200) || 
    `Experience ${ebEvent.name.text}! Get your tickets now for an unforgettable event.`;

  return {
    id: `eb_${ebEvent.id}`,
    name: ebEvent.name.text,
    description: description,
    location: location,
    price: Math.round(priceInZAR),
    dateTime: ebEvent.start.local,
    imageUrl: imageUrl,
    liked: false,
  };
}

export async function fetchEventbriteEvents(countryCode: string = "ZA"): Promise<Event[]> {
  try {
    if (!EVENTBRITE_API_KEY) {
      console.log("Eventbrite API key not configured");
      return [];
    }

    const url = `${BASE_URL}/users/me/owned_events/?expand=venue,ticket_availability&order_by=start_asc`;

    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${EVENTBRITE_API_KEY}`,
      },
    });

    if (!response.ok) {
      console.log(`Note: Eventbrite public event search was deprecated in 2020. The API can only retrieve events you own/organize.`);
      console.log(`To add Eventbrite events, you need to be the organizer of those events.`);
      return [];
    }

    const data: EventbriteResponse = await response.json();

    if (!data.events || data.events.length === 0) {
      console.log("No owned Eventbrite events found");
      return [];
    }

    console.log(`Found ${data.events.length} owned Eventbrite events`);
    return data.events.map(transformEventbriteEvent);
  } catch (error) {
    console.error("Error fetching events from Eventbrite:", error);
    return [];
  }
}

export async function fetchSouthAfricanEventbriteEvents(): Promise<Event[]> {
  try {
    const events = await fetchEventbriteEvents("South Africa");
    
    const uniqueByName = Array.from(
      new Map(events.map(event => [event.name, event])).values()
    );
    
    console.log(`Found ${uniqueByName.length} unique Eventbrite events in South Africa`);
    return uniqueByName;
  } catch (error) {
    console.error("Error fetching Eventbrite events:", error);
    return [];
  }
}
