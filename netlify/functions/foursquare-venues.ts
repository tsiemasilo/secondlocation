import { Handler } from '@netlify/functions';

const FOURSQUARE_API_KEY = process.env.VITE_FOURSQUARE_API_KEY;
const BASE_URL = "https://api.foursquare.com/v3/places";

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
    if (!FOURSQUARE_API_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Foursquare API key not configured' }),
      };
    }

    const queryParams = new URLSearchParams({
      categories: "4bf58dd8d48988d11f941735,4bf58dd8d48988d116941735,4bf58dd8d48988d121941735,4bf58dd8d48988d11e941735",
      limit: "50",
    });

    const cities = [
      { name: 'Cape Town', lat: -33.9249, lng: 18.4241, radius: 15000 },
      { name: 'Johannesburg', lat: -26.2041, lng: 28.0473, radius: 15000 },
      { name: 'Durban', lat: -29.8587, lng: 31.0218, radius: 15000 },
      { name: 'Pretoria', lat: -25.7479, lng: 28.2293, radius: 15000 },
    ];

    const allVenues: any[] = [];

    for (const city of cities) {
      const params = new URLSearchParams(queryParams);
      params.append("ll", `${city.lat},${city.lng}`);
      params.append("radius", city.radius.toString());

      const url = `${BASE_URL}/search?${params.toString()}`;

      console.log(`Searching Foursquare in ${city.name}...`);

      const response = await fetch(url, {
        headers: {
          "Accept": "application/json",
          "Authorization": FOURSQUARE_API_KEY,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`Found ${data.results?.length || 0} venues in ${city.name}`);
        if (data.results) {
          allVenues.push(...data.results);
        }
      } else {
        const errorText = await response.text();
        console.error(`Foursquare API error for ${city.name}:`, response.status, errorText);
      }
    }

    console.log(`Total venues found: ${allVenues.length}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ results: allVenues }),
    };
  } catch (error) {
    console.error('Foursquare API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
