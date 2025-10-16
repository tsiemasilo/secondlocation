import express from 'express';
import * as cheerio from 'cheerio';
import { Client } from '@googlemaps/google-maps-services-js';
import * as storage from './storage';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, x-session-id');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.get('/api/computicket-events', async (req, res) => {
  try {
    const url = 'https://computicket.com/event';
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      return res.json({ events: [] });
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const events: any[] = [];

    $('[class*="feature"], [class*="card"]').each((_, element) => {
      const $el = $(element);
      const title = $el.find('h1, h2, h3, h4, .title').first().text().trim();
      const location = $el.find('[class*="location"], [class*="venue"]').first().text().trim();
      const date = $el.find('[class*="date"]').first().text().trim();
      const image = $el.find('img').first().attr('src') || '';
      const link = $el.find('a').first().attr('href') || '';

      if (title && title.length > 3) {
        events.push({
          id: `computicket-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          name: title,
          location: location || 'South Africa',
          date: date || 'TBA',
          imageUrl: image.startsWith('http') ? image : `https://computicket.com${image}`,
          url: link.startsWith('http') ? link : `https://computicket.com${link}`,
          source: 'Computicket',
          price: 'R0',
          category: 'Entertainment',
        });
      }
    });

    const uniqueEvents = Array.from(
      new Map(events.map(event => [event.id, event])).values()
    );

    console.log(`Found ${uniqueEvents.length} events from Computicket`);
    res.json({ events: uniqueEvents.slice(0, 50) });
  } catch (error) {
    console.error('Computicket scraping error:', error);
    res.json({ events: [] });
  }
});

app.get('/api/google-places', async (req, res) => {
  try {
    const apiKey = process.env.VITE_GOOGLE_PLACES_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'Google Places API key not configured' });
    }

    const client = new Client({});
    const cities = [
      { name: 'Cape Town', location: { lat: -33.9249, lng: 18.4241 } },
      { name: 'Johannesburg', location: { lat: -26.2041, lng: 28.0473 } },
      { name: 'Durban', location: { lat: -29.8587, lng: 31.0218 } },
      { name: 'Pretoria', location: { lat: -25.7479, lng: 28.2293 } },
    ];

    const placeTypes = [
      { type: 'night_club', category: 'night_club' },
      { type: 'bar', category: 'bar' },
      { type: 'restaurant', category: 'restaurant' },
    ];

    const allPlaces: any[] = [];

    for (const city of cities) {
      for (const placeType of placeTypes) {
        const searchResponse = await client.placesNearby({
          params: {
            location: city.location,
            radius: 15000,
            type: placeType.type as any,
            key: apiKey,
          },
          timeout: 5000,
        });

        if (searchResponse.data.results) {
          console.log(`Found ${searchResponse.data.results.length} ${placeType.type}s in ${city.name}`);
          
          for (const place of searchResponse.data.results.slice(0, 5)) {
            allPlaces.push({
              id: `google-${place.place_id}`,
              name: place.name || 'Unknown',
              location: `${place.vicinity || city.name}, South Africa`,
              address: place.vicinity || city.name,
              rating: place.rating || 0,
              totalRatings: place.user_ratings_total || 0,
              placeId: place.place_id,
              type: placeType.category,
              photoReference: place.photos?.[0]?.photo_reference || null,
              source: 'Google Places',
            });
          }
        }
      }
    }

    const uniquePlaces = Array.from(
      new Map(allPlaces.map(place => [place.placeId, place])).values()
    );

    console.log(`Total places found: ${uniquePlaces.length}`);
    res.json({ places: uniquePlaces });
  } catch (error) {
    console.error('Google Places API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/liked-events', async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] as string;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID required' });
    }

    const likedEvents = await storage.getLikedEventsBySession(sessionId);
    res.json(likedEvents);
  } catch (error) {
    console.error('Error fetching liked events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/liked-events', async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] as string;
    const { eventId, eventData } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID required' });
    }

    if (!eventId || !eventData) {
      return res.status(400).json({ error: 'Event ID and data required' });
    }

    const result = await storage.addLikedEvent(sessionId, eventId, eventData);
    res.json(result[0]);
  } catch (error) {
    console.error('Error adding liked event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/liked-events/:eventId', async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] as string;
    const { eventId } = req.params;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID required' });
    }

    await storage.removeLikedEvent(sessionId, eventId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error removing liked event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
