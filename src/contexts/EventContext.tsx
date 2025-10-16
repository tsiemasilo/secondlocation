import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Event, CreateEventInput } from "@/types/event";
import { fetchSouthAfricanEvents } from "@/services/ticketmaster";

interface EventContextType {
  events: Event[];
  likedEvents: Event[];
  addEvent: (event: CreateEventInput) => void;
  toggleLike: (eventId: string) => void;
  removeEvent: (eventId: string) => void;
  isLoading: boolean;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const STORAGE_KEY = "event_discovery_events";
const LIKED_KEY = "event_discovery_liked";

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
  },
];

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
        const fetchedEvents = await fetchSouthAfricanEvents();
        
        const eventsWithLikedStatus = fetchedEvents.map(event => ({
          ...event,
          liked: likedEventIds.has(event.id),
        }));
        
        setEvents(eventsWithLikedStatus);
      } catch (error) {
        console.error("Failed to fetch events, using mock data:", error);
        setEvents(mockEvents);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

  useEffect(() => {
    localStorage.setItem(LIKED_KEY, JSON.stringify(Array.from(likedEventIds)));
  }, [likedEventIds]);

  const likedEvents = events.filter((event) => event.liked);

  const addEvent = (eventInput: CreateEventInput) => {
    const newEvent: Event = {
      ...eventInput,
      id: Date.now().toString(),
      liked: false,
    };
    setEvents((prev) => [...prev, newEvent]);
  };

  const toggleLike = (eventId: string) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId ? { ...event, liked: !event.liked } : event
      )
    );
    
    setLikedEventIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const removeEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId));
    setLikedEventIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(eventId);
      return newSet;
    });
  };

  return (
    <EventContext.Provider value={{ events, likedEvents, addEvent, toggleLike, removeEvent, isLoading }}>
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
