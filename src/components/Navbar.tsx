import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Heart, Search, Filter, Calendar, MapPin, DollarSign } from "lucide-react";
import { useEvents } from "@/contexts/EventContext";
import { format } from "date-fns";

export const Navbar = () => {
  const { likedEvents, toggleLike, filters, setFilters } = useEvents();
  const [activeTab, setActiveTab] = useState<'all' | 'bar' | 'nightlife' | 'restaurant'>('all');

  const handleTabChange = (tab: 'all' | 'bar' | 'nightlife' | 'restaurant') => {
    setActiveTab(tab);
    if (tab === 'all') {
      setFilters({ ...filters, categories: [] });
    } else if (tab === 'bar') {
      setFilters({ ...filters, categories: ['bar'] });
    } else if (tab === 'nightlife') {
      setFilters({ ...filters, categories: ['night_club', 'nightlife'] });
    } else if (tab === 'restaurant') {
      setFilters({ ...filters, categories: ['restaurant'] });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">2nd Location</h1>
          <div className="flex gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                  <Search className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="bg-gray-900 border-gray-800">
                <SheetHeader>
                  <SheetTitle className="text-white">Search Events</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <input
                    type="text"
                    placeholder="Search events, locations, categories..."
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                  <Heart className="w-4 h-4" />
                  {likedEvents.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
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

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-gray-900 border-gray-800">
                <SheetHeader>
                  <SheetTitle className="text-white">Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <p className="text-gray-400 text-sm">Filter options coming soon...</p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="relative">
          <div className="navbar-wrap">
            <input 
              defaultChecked 
              type="radio" 
              id="rd-1" 
              name="radio" 
              className="rd-1" 
              onChange={() => handleTabChange('all')}
            />
            <label htmlFor="rd-1" className="navbar-label" style={{ zIndex: 0 }}>
              <span>All Events</span>
            </label>
            
            <input 
              type="radio" 
              id="rd-2" 
              name="radio" 
              className="rd-2" 
              onChange={() => handleTabChange('bar')}
            />
            <label htmlFor="rd-2" className="navbar-label" style={{ zIndex: 1 }}>
              <span>Bar</span>
            </label>
            
            <input 
              type="radio" 
              id="rd-3" 
              name="radio" 
              className="rd-3" 
              onChange={() => handleTabChange('nightlife')}
            />
            <label htmlFor="rd-3" className="navbar-label" style={{ zIndex: 2 }}>
              <span>Nightlife</span>
            </label>
            
            <input 
              type="radio" 
              id="rd-4" 
              name="radio" 
              className="rd-4" 
              onChange={() => handleTabChange('restaurant')}
            />
            <label htmlFor="rd-4" className="navbar-label" style={{ zIndex: 3 }}>
              <span>Restaurant</span>
            </label>
            
            <div className="navbar-bar" />
            <div className="navbar-slidebar" />
          </div>
        </div>
      </div>
    </nav>
  );
};
