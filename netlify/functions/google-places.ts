import { Handler } from '@netlify/functions';
import { Client } from '@googlemaps/google-maps-services-js';

const GOOGLE_PLACES_API_KEY = process.env.VITE_GOOGLE_PLACES_API_KEY;

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    if (!GOOGLE_PLACES_API_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Google Places API key not configured' }),
      };
    }

    const client = new Client({});
    const cities = [
      { name: 'Cape Town', location: { lat: -33.9249, lng: 18.4241 } },
      { name: 'Johannesburg', location: { lat: -26.2041, lng: 28.0473 } },
      { name: 'Durban', location: { lat: -29.8587, lng: 31.0218 } },
      { name: 'Pretoria', location: { lat: -25.7479, lng: 28.2293 } },
    ];

    const allPlaces: any[] = [];

    for (const city of cities) {
      const searchResponse = await client.placesNearby({
        params: {
          location: city.location,
          radius: 15000,
          type: 'night_club',
          key: GOOGLE_PLACES_API_KEY,
        },
        timeout: 5000,
      });

      if (searchResponse.data.results) {
        console.log(`Found ${searchResponse.data.results.length} clubs in ${city.name}`);
        
        for (const place of searchResponse.data.results.slice(0, 10)) {
          allPlaces.push({
            id: `google-${place.place_id}`,
            name: place.name || 'Unknown',
            location: `${place.vicinity || city.name}, South Africa`,
            address: place.vicinity || city.name,
            rating: place.rating || 0,
            totalRatings: place.user_ratings_total || 0,
            placeId: place.place_id,
            type: place.types?.[0] || 'night_club',
            photoReference: place.photos?.[0]?.photo_reference || null,
            source: 'Google Places',
          });
        }
      }
    }

    const uniquePlaces = Array.from(
      new Map(allPlaces.map(place => [place.placeId, place])).values()
    );

    console.log(`Total clubs found: ${uniquePlaces.length}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ places: uniquePlaces }),
    };
  } catch (error) {
    console.error('Google Places API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
