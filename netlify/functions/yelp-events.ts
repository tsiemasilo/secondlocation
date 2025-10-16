import { Handler } from '@netlify/functions';

const YELP_API_KEY = process.env.VITE_YELP_API_KEY;
const BASE_URL = "https://api.yelp.com/v3";

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
    if (!YELP_API_KEY || YELP_API_KEY === 'na') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ events: [] }),
      };
    }

    const cities = [
      "Cape Town, South Africa",
      "Johannesburg, South Africa",
      "Durban, South Africa",
    ];

    const allEvents: any[] = [];

    for (const city of cities) {
      const queryParams = new URLSearchParams({
        location: city,
        categories: "nightlife,music-and-nightlife",
        limit: "10",
      });

      const url = `${BASE_URL}/events?${queryParams.toString()}`;

      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${YELP_API_KEY}`,
          "Accept": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.events) {
          allEvents.push(...data.events);
        }
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ events: allEvents }),
    };
  } catch (error) {
    console.error('Yelp API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
