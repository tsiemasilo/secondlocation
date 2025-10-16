import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { FilterOptions } from "@/contexts/EventContext";
import { Filter, Calendar as CalendarIcon, MapPin, DollarSign, Star, X } from "lucide-react";
import { format } from "date-fns";

interface FilterBarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

const CATEGORIES = [
  { value: "music", label: "Music" },
  { value: "nightclub", label: "Night Club" },
  { value: "bar", label: "Bar" },
  { value: "restaurant", label: "Restaurant" },
  { value: "sports", label: "Sports" },
  { value: "comedy", label: "Comedy" },
  { value: "theater", label: "Theater" },
  { value: "festival", label: "Festival" },
  { value: "event", label: "Other Events" },
];

export function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handlePriceRangeChange = (values: number[]) => {
    onFiltersChange({ 
      ...filters, 
      priceRange: { min: values[0], max: values[1] } 
    });
  };

  const handlePopularityChange = (values: number[]) => {
    onFiltersChange({ ...filters, popularity: values[0] });
  };

  const handleRadiusChange = (values: number[]) => {
    onFiltersChange({ ...filters, locationRadius: values[0] });
  };

  const handleDateRangeChange = (type: 'start' | 'end', date: Date | undefined) => {
    onFiltersChange({ 
      ...filters, 
      dateRange: { 
        ...filters.dateRange, 
        [type]: date || null 
      } 
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      categories: [],
      priceRange: { min: 0, max: 10000 },
      dateRange: { start: null, end: null },
      popularity: 0,
      locationRadius: 50,
      userLocation: null,
    });
  };

  const activeFiltersCount = 
    filters.categories.length + 
    (filters.dateRange.start ? 1 : 0) + 
    (filters.dateRange.end ? 1 : 0) + 
    (filters.priceRange.min > 0 || filters.priceRange.max < 10000 ? 1 : 0) + 
    (filters.popularity > 0 ? 1 : 0);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-gray-900 border-gray-800 text-white max-h-[600px] overflow-y-auto">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Filters</h3>
            {activeFiltersCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Category
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(category => (
                <div key={category.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.value}
                    checked={filters.categories.includes(category.value)}
                    onCheckedChange={() => handleCategoryToggle(category.value)}
                  />
                  <label
                    htmlFor={category.value}
                    className="text-sm cursor-pointer"
                  >
                    {category.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Price Range (R{filters.priceRange.min} - R{filters.priceRange.max})
            </Label>
            <Slider
              min={0}
              max={10000}
              step={50}
              value={[filters.priceRange.min, filters.priceRange.max]}
              onValueChange={handlePriceRangeChange}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Date Range
            </Label>
            <div className="space-y-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.start ? format(filters.dateRange.start, "PPP") : "Start Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-800">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.start || undefined}
                    onSelect={(date) => handleDateRangeChange('start', date)}
                    className="bg-gray-900"
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.end ? format(filters.dateRange.end, "PPP") : "End Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-800">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.end || undefined}
                    onSelect={(date) => handleDateRangeChange('end', date)}
                    className="bg-gray-900"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Star className="w-4 h-4" />
              Minimum Rating ({filters.popularity}/5)
            </Label>
            <Slider
              min={0}
              max={5}
              step={0.5}
              value={[filters.popularity]}
              onValueChange={handlePopularityChange}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location Radius ({filters.locationRadius} km)
            </Label>
            <Slider
              min={1}
              max={100}
              step={5}
              value={[filters.locationRadius]}
              onValueChange={handleRadiusChange}
              className="w-full"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
