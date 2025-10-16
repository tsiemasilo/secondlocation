import { Event } from '@/types/event';

interface GooglePlace {
  id: string;
  name: string;
  location: string;
  address: string;
  rating: number;
  totalRatings: number;
  placeId: string;
  type: string;
  photoReference: string | null;
  source: string;
}

interface GooglePlacesResponse {
  places: GooglePlace[];
}

function transformGooglePlace(place: GooglePlace): Event {
  const nextWeekend = new Date();
  nextWeekend.setDate(nextWeekend.getDate() + ((6 - nextWeekend.getDay()) % 7));
  nextWeekend.setHours(21, 0, 0, 0);

  const imageUrl = place.photoReference
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photoReference}&key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}`
    : 'https://via.placeholder.com/400x300?text=Club';

  return {
    id: place.id,
    name: place.name,
    dateTime: nextWeekend.toISOString(),
    location: place.location,
    imageUrl,
    description: `Popular nightlife venue in South Africa. Rating: ${place.rating}/5 (${place.totalRatings} reviews)`,
    price: 0,
    liked: false,
  };
}

export async function fetchGooglePlaces(): Promise<Event[]> {
  try {
    const API_BASE = import.meta.env.PROD ? '/.netlify/functions' : '/api';
    const url = `${API_BASE}/google-places`;

    const response = await fetch(url);

    if (!response.ok) {
      console.log("Google Places API not available");
      return [];
    }

    const data: GooglePlacesResponse = await response.json();

    if (!data.places || data.places.length === 0) {
      console.log("No Google Places found");
      return [];
    }

    const places = data.places.map(transformGooglePlace);
    const uniquePlaces = Array.from(
      new Map(places.map(place => [place.id, place])).values()
    );

    console.log(`Found ${uniquePlaces.length} unique clubs from Google Places`);
    return uniquePlaces;
  } catch (error) {
    console.error("Error fetching Google Places:", error);
    return [];
  }
}
