import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import { Event, CreateEventInput } from "@/types/event";
import { fetchSouthAfricanEvents } from "@/services/ticketmaster";
import { fetchSouthAfricanEventbriteEvents } from "@/services/eventbrite";
import { fetchSouthAfricanNightlifeVenues } from "@/services/foursquare";
import { fetchSouthAfricanYelpEvents } from "@/services/yelp";
import { fetchComputicketEvents } from "@/services/computicket";
import { fetchGooglePlaces } from "@/services/googlePlaces";
import { getLikedEvents, addLikedEvent, removeLikedEvent } from "@/services/database";

export interface FilterOptions {
  categories: string[];
  priceRange: { min: number; max: number };
  dateRange: { start: Date | null; end: Date | null };
  popularity: number;
  locationRadius: number;
  userLocation: { lat: number; lng: number } | null;
}

export type SortOption = 'date-asc' | 'date-desc' | 'price-asc' | 'price-desc' | 'popularity' | 'distance';

interface EventContextType {
  allEvents: Event[];
  events: Event[];
  likedEvents: Event[];
  addEvent: (event: CreateEventInput) => void;
  toggleLike: (eventId: string) => void;
  removeEvent: (eventId: string) => void;
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  searchSuggestions: string[];
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const LIKED_KEY = "event_discovery_liked";

const DEFAULT_FILTERS: FilterOptions = {
  categories: [],
  priceRange: { min: 0, max: 10000 },
  dateRange: { start: null, end: null },
  popularity: 0,
  locationRadius: 50,
  userLocation: null,
};

const mockEvents: Event[] = [
  {
    id: "1",
    name: "Summer Music Festival",
    description: "Join us for an amazing outdoor music festival featuring top artists from around the world. Great food, drinks, and vibes!",
    location: "Central Park, New York",
    price: 75,
    dateTime: "2025-07-15T18:00:00",
    imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop",
    liked: false,
    category: "music",
  },
  {
    id: "2",
    name: "Tech Conference 2025",
    description: "The biggest tech conference of the year. Learn from industry leaders and network with professionals.",
    location: "San Francisco Convention Center",
    price: 299,
    dateTime: "2025-08-20T09:00:00",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
    liked: false,
    category: "event",
  },
  {
    id: "3",
    name: "Food & Wine Festival",
    description: "Experience the finest cuisine and wines from local and international chefs and vineyards.",
    location: "Miami Beach, Florida",
    price: 125,
    dateTime: "2025-09-10T17:00:00",
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
    liked: false,
    category: "festival",
  },
  {
    id: "4",
    name: "Art Gallery Opening",
    description: "Exclusive opening night of contemporary art exhibition featuring emerging artists.",
    location: "Downtown Gallery, Los Angeles",
    price: 50,
    dateTime: "2025-06-25T19:00:00",
    imageUrl: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&h=600&fit=crop",
    liked: false,
    category: "event",
  },
  {
    id: "5",
    name: "Marathon & Charity Run",
    description: "Participate in our annual charity marathon. All proceeds go to local children's hospitals.",
    location: "Chicago Lakefront",
    price: 45,
    dateTime: "2025-10-05T07:00:00",
    imageUrl: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&h=600&fit=crop",
    liked: false,
    category: "sports",
  },
  {
    id: "6",
    name: "Comedy Night Live",
    description: "An evening of laughter with stand-up comedians performing live on stage.",
    location: "The Comedy Store, Hollywood",
    price: 35,
    dateTime: "2025-07-30T20:00:00",
    imageUrl: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&h=600&fit=crop",
    liked: false,
    category: "comedy",
  },
];

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [sortOption, setSortOption] = useState<SortOption>('date-asc');
  const [likedEventIds, setLikedEventIds] = useState<Set<string>>(() => {
    const stored = localStorage.getItem(LIKED_KEY);
    if (stored) {
      try {
        return new Set(JSON.parse(stored));
      } catch {
        return new Set();
      }
    }
    return new Set();
  });

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        
        const [ticketmasterEvents, eventbriteEvents, foursquareVenues, yelpEvents, computicketEvents, googlePlaces] = await Promise.all([
          fetchSouthAfricanEvents(),
          fetchSouthAfricanEventbriteEvents(),
          fetchSouthAfricanNightlifeVenues(),
          fetchSouthAfricanYelpEvents(),
          fetchComputicketEvents(),
          fetchGooglePlaces(),
        ]);
        
        const combinedEvents = [...ticketmasterEvents, ...eventbriteEvents, ...foursquareVenues, ...yelpEvents, ...computicketEvents, ...googlePlaces];
        const uniqueEvents = Array.from(
          new Map(combinedEvents.map(event => [event.name, event])).values()
        );
        
        console.log(`Total unique events: ${uniqueEvents.length} (${ticketmasterEvents.length} from Ticketmaster, ${eventbriteEvents.length} from Eventbrite, ${foursquareVenues.length} from Foursquare, ${yelpEvents.length} from Yelp, ${computicketEvents.length} from Computicket, ${googlePlaces.length} from Google Places)`);
        
        const likedEventsFromDb = await Promise.race([
          getLikedEvents(),
          new Promise<null>((resolve) => setTimeout(() => {
            console.log("Database timeout, using localStorage fallback");
            resolve(null);
          }, 2000))
        ]).catch((error) => {
          console.log("Error fetching liked events:", error);
          return null;
        });
        
        const likedIds: Set<string> = likedEventsFromDb 
          ? new Set(likedEventsFromDb.map(e => e.id))
          : likedEventIds;
        
        if (likedEventsFromDb) {
          setLikedEventIds(likedIds);
        }
        
        const eventsWithLikedStatus = uniqueEvents.map(event => ({
          ...event,
          liked: likedIds.has(event.id),
        }));
        
        setAllEvents(eventsWithLikedStatus);
      } catch (error) {
        console.error("Failed to fetch events, using mock data:", error);
        setAllEvents(mockEvents);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

  useEffect(() => {
    localStorage.setItem(LIKED_KEY, JSON.stringify(Array.from(likedEventIds)));
  }, [likedEventIds]);

  const filteredAndSortedEvents = useMemo(() => {
    let result = [...allEvents];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(event => 
        event.name.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.category?.toLowerCase().includes(query)
      );
    }

    if (filters.categories.length > 0) {
      result = result.filter(event => 
        event.category && filters.categories.includes(event.category)
      );
    }

    result = result.filter(event => 
      event.price >= filters.priceRange.min && event.price <= filters.priceRange.max
    );

    if (filters.dateRange.start) {
      result = result.filter(event => 
        new Date(event.dateTime) >= filters.dateRange.start!
      );
    }

    if (filters.dateRange.end) {
      result = result.filter(event => 
        new Date(event.dateTime) <= filters.dateRange.end!
      );
    }

    if (filters.popularity > 0) {
      result = result.filter(event => 
        (event.popularity || 0) >= filters.popularity
      );
    }

    if (filters.userLocation && filters.locationRadius > 0) {
      result = result.filter(event => {
        if (!event.coordinates) return true;
        const distance = calculateDistance(
          filters.userLocation!.lat,
          filters.userLocation!.lng,
          event.coordinates.lat,
          event.coordinates.lng
        );
        return distance <= filters.locationRadius;
      });
    }

    switch (sortOption) {
      case 'date-asc':
        result.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
        break;
      case 'date-desc':
        result.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
        result.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
      case 'distance':
        if (filters.userLocation) {
          result.sort((a, b) => {
            if (!a.coordinates) return 1;
            if (!b.coordinates) return -1;
            const distA = calculateDistance(
              filters.userLocation!.lat,
              filters.userLocation!.lng,
              a.coordinates.lat,
              a.coordinates.lng
            );
            const distB = calculateDistance(
              filters.userLocation!.lat,
              filters.userLocation!.lng,
              b.coordinates.lat,
              b.coordinates.lng
            );
            return distA - distB;
          });
        }
        break;
    }

    return result;
  }, [allEvents, searchQuery, filters, sortOption]);

  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    const suggestions = new Set<string>();
    
    allEvents.forEach(event => {
      if (event.name.toLowerCase().includes(query)) {
        suggestions.add(event.name);
      }
      if (event.category && event.category.toLowerCase().includes(query)) {
        suggestions.add(event.category);
      }
      if (event.location.toLowerCase().includes(query)) {
        suggestions.add(event.location);
      }
    });
    
    return Array.from(suggestions).slice(0, 5);
  }, [allEvents, searchQuery]);

  const likedEvents = allEvents.filter((event) => event.liked);

  const addEvent = (eventInput: CreateEventInput) => {
    const newEvent: Event = {
      ...eventInput,
      id: Date.now().toString(),
      liked: false,
    };
    setAllEvents((prev) => [...prev, newEvent]);
  };

  const toggleLike = async (eventId: string) => {
    const event = allEvents.find(e => e.id === eventId);
    if (!event) return;

    const wasLiked = likedEventIds.has(eventId);
    
    setAllEvents((prev) =>
      prev.map((e) =>
        e.id === eventId ? { ...e, liked: !e.liked } : e
      )
    );
    
    setLikedEventIds((prev) => {
      const newSet = new Set(prev);
      if (wasLiked) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });

    try {
      if (wasLiked) {
        await removeLikedEvent(eventId);
      } else {
        await addLikedEvent(event);
      }
    } catch (error) {
      console.error("Failed to sync like status to database:", error);
      setAllEvents((prev) =>
        prev.map((e) =>
          e.id === eventId ? { ...e, liked: wasLiked } : e
        )
      );
      setLikedEventIds((prev) => {
        const newSet = new Set(prev);
        if (wasLiked) {
          newSet.add(eventId);
        } else {
          newSet.delete(eventId);
        }
        return newSet;
      });
    }
  };

  const removeEvent = (eventId: string) => {
    setAllEvents((prev) => prev.filter((event) => event.id !== eventId));
    setLikedEventIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(eventId);
      return newSet;
    });
  };

  return (
    <EventContext.Provider value={{ 
      allEvents,
      events: filteredAndSortedEvents, 
      likedEvents, 
      addEvent, 
      toggleLike, 
      removeEvent, 
      isLoading,
      searchQuery,
      setSearchQuery,
      filters,
      setFilters,
      sortOption,
      setSortOption,
      searchSuggestions,
    }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
};
