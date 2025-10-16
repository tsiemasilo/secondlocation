import { useState, useMemo, useRef, createRef, useEffect } from "react";
import TinderCard from "react-tinder-card";
import { useEvents } from "@/contexts/EventContext";
import { Event } from "@/types/event";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Heart, Calendar, MapPin, DollarSign, Menu } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { FilterBar } from "@/components/FilterBar";
import { SearchBar } from "@/components/SearchBar";
import { SortControls } from "@/components/SortControls";

const EventDiscovery = () => {
  const { 
    events, 
    toggleLike, 
    likedEvents, 
    isLoading,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    sortOption,
    setSortOption,
    searchSuggestions,
  } = useEvents();
  
  const [currentIndex, setCurrentIndex] = useState(events.length - 1);
  const [showHeart, setShowHeart] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [alreadyRemoved, setAlreadyRemoved] = useState<string[]>([]);
  const currentIndexRef = useRef(currentIndex);
  const lastTapRef = useRef<number>(0);

  const orderedEvents = useMemo(() => [...events].reverse(), [events.length, events.map(e => e.id).join(',')]);

  useEffect(() => {
    setCurrentIndex(orderedEvents.length - 1);
    currentIndexRef.current = orderedEvents.length - 1;
    setAlreadyRemoved([]);
  }, [orderedEvents.length]);

  const childRefs = useMemo(
    () =>
      Array(orderedEvents.length)
        .fill(0)
        .map(() => createRef<any>()),
    [orderedEvents.length]
  );

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canSwipe = currentIndex >= 0;

  const swiped = (direction: string, eventId: string, index: number) => {
    setAlreadyRemoved(prev => [...prev, eventId]);
    if (direction === "right") {
      toggleLike(eventId);
    }
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (name: string, idx: number) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
  };

  const swipe = async (dir: string) => {
    if (canSwipe && currentIndex < orderedEvents.length) {
      await childRefs[currentIndex].current.swipe(dir);
    }
  };

  const handleDoubleTap = (eventId: string) => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;
    
    if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
      if (isAnimating) return;
      
      setIsAnimating(true);
      setShowHeart(eventId);
      
      setTimeout(async () => {
        setShowHeart(null);
        await swipe("right");
        setIsAnimating(false);
      }, 800);
    }
    
    lastTapRef.current = now;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Discover Events</h1>
          <div className="flex gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative">
                  <Heart className="w-5 h-5 mr-2" />
                  Liked Events
                  {likedEvents.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      {likedEvents.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-gray-900 border-gray-800">
                <SheetHeader>
                  <SheetTitle className="text-white">Liked Events</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {likedEvents.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No liked events yet. Swipe right on events you like!</p>
                  ) : (
                    likedEvents.map((event) => (
                      <div key={event.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-white">{event.name}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleLike(event.id)}
                            className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                          >
                            <Heart className="w-5 h-5 fill-current" />
                          </Button>
                        </div>
                        <div className="mt-2 space-y-1 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(event.dateTime), "PPP 'at' p")}
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            R{event.price}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </SheetContent>
            </Sheet>
            <Link to="/admin">
              <Button variant="outline">
                <Menu className="w-5 h-5 mr-2" />
                Admin
              </Button>
            </Link>
          </div>
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <SearchBar 
                value={searchQuery}
                onChange={setSearchQuery}
                suggestions={searchSuggestions}
              />
            </div>
            <FilterBar 
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <SortControls 
              value={sortOption}
              onChange={setSortOption}
            />
            <p className="text-sm text-gray-400">
              Showing {orderedEvents.length} event{orderedEvents.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="relative w-full max-w-md h-[600px] flex items-center justify-center">
            {isLoading ? (
              <div className="text-center text-gray-400">
                <p className="text-xl mb-4">Loading events...</p>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
              </div>
            ) : orderedEvents.length === 0 ? (
              <div className="text-center text-gray-400">
                <p className="text-xl mb-4">No events match your filters</p>
                <p className="text-sm mb-4">Try adjusting your search or filters</p>
                <Link to="/admin">
                  <Button>Create an Event</Button>
                </Link>
              </div>
            ) : currentIndex < 0 ? (
              <div className="text-center text-gray-400">
                <p className="text-xl mb-4">No more events!</p>
                <p className="text-sm">Check your liked events or adjust your filters.</p>
              </div>
            ) : (
              orderedEvents
                .filter(event => !alreadyRemoved.includes(event.id))
                .map((event, index) => (
                  <TinderCard
                    ref={childRefs[index]}
                    className="absolute w-full max-w-md"
                    key={event.id}
                    onSwipe={(dir) => swiped(dir, event.id, index)}
                    onCardLeftScreen={() => outOfFrame(event.name, index)}
                    preventSwipe={["up", "down"]}
                    swipeRequirementType="position"
                    swipeThreshold={100}
                  >
                  <div
                    className="relative w-full h-[600px] bg-gray-800 rounded-2xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing"
                    style={{
                      backgroundImage: `url(${event.imageUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    onClick={() => handleDoubleTap(event.id)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    {showHeart === event.id && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                        <Heart className="w-32 h-32 text-white fill-white heart-pop" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      {event.category && (
                        <div className="mb-2">
                          <span className="inline-block px-3 py-1 bg-blue-500/80 rounded-full text-xs font-semibold uppercase">
                            {event.category}
                          </span>
                        </div>
                      )}
                      <h2 className="text-3xl font-bold mb-2">{event.name}</h2>
                      <p className="text-gray-200 mb-4 line-clamp-2">{event.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          <span>{format(new Date(event.dateTime), "PPP 'at' p")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5" />
                          <span className="text-2xl font-bold">R{event.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TinderCard>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDiscovery;
