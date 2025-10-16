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

function determineVenueCategory(type: string): string {
  const lowerType = type.toLowerCase();
  
  if (lowerType.includes('night_club') || lowerType.includes('nightclub')) return 'night_club';
  if (lowerType.includes('bar')) return 'bar';
  if (lowerType.includes('restaurant')) return 'restaurant';
  if (lowerType.includes('cafe') || lowerType.includes('coffee')) return 'cafe';
  
  return 'venue';
}

function estimateCoverCharge(category: string, rating: number): number {
  const basePrice = {
    'night_club': 150,
    'bar': 50,
    'restaurant': 0,
    'cafe': 0,
    'venue': 100,
  }[category] || 0;
  
  const ratingMultiplier = 1 + (rating - 3) * 0.2;
  return Math.round(basePrice * ratingMultiplier);
}

function transformGooglePlace(place: GooglePlace): Event {
  const nextWeekend = new Date();
  nextWeekend.setDate(nextWeekend.getDate() + ((6 - nextWeekend.getDay()) % 7));
  nextWeekend.setHours(21, 0, 0, 0);

  const imageUrl = place.photoReference
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photoReference}&key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}`
    : 'https://via.placeholder.com/400x300?text=Club';

  const category = determineVenueCategory(place.type);
  const price = estimateCoverCharge(category, place.rating);

  return {
    id: place.id,
    name: place.name,
    dateTime: nextWeekend.toISOString(),
    location: place.location,
    imageUrl,
    description: `Popular ${category} in South Africa. Rating: ${place.rating}/5 (${place.totalRatings} reviews)`,
    price,
    liked: false,
    category,
    popularity: place.rating,
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
