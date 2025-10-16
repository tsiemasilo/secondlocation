import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortOption } from "@/contexts/EventContext";
import { ArrowUpDown } from "lucide-react";

interface SortControlsProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortControls({ value, onChange }: SortControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-4 h-4 text-gray-400" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700 text-white">
          <SelectItem value="date-asc">Upcoming First</SelectItem>
          <SelectItem value="date-desc">Latest First</SelectItem>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="popularity">Most Popular</SelectItem>
          <SelectItem value="distance">Nearest</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
