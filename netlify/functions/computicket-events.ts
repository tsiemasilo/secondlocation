import { Handler } from '@netlify/functions';
import * as cheerio from 'cheerio';

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
    const url = 'https://computicket.com/event';
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      console.error(`Computicket returned status: ${response.status}`);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ events: [] }),
      };
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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ events: uniqueEvents.slice(0, 50) }),
    };
  } catch (error) {
    console.error('Computicket scraping error:', error);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ events: [] }),
    };
  }
};
