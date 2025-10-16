import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, ChevronRight, X } from 'lucide-react';
import { southAfricanProvinces, getCitiesByProvince } from '@/data/locations';

interface LocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationSelect: (city: string) => void;
  currentLocation?: string;
}

export const LocationDialog = ({ 
  open, 
  onOpenChange, 
  onLocationSelect,
  currentLocation 
}: LocationDialogProps) => {
  const [step, setStep] = useState<'province' | 'city'>('province');
  const [selectedProvince, setSelectedProvince] = useState<string>('');

  const handleProvinceSelect = (provinceName: string) => {
    setSelectedProvince(provinceName);
    setStep('city');
  };

  const handleCitySelect = (city: string) => {
    onLocationSelect(city);
    onOpenChange(false);
    setStep('province');
    setSelectedProvince('');
  };

  const handleBack = () => {
    setStep('province');
    setSelectedProvince('');
  };

  const handleClearLocation = () => {
    onLocationSelect('');
    onOpenChange(false);
    setStep('province');
    setSelectedProvince('');
  };

  const cities = selectedProvince ? getCitiesByProvince(selectedProvince) : [];

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) {
        setStep('province');
        setSelectedProvince('');
      }
    }}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            {step === 'province' ? 'Select Province' : `Select City in ${selectedProvince}`}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {step === 'province' 
              ? 'Choose a province to see events in your area'
              : 'Choose a city to filter events'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {currentLocation && (
            <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-blue-400">Current: {currentLocation}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearLocation}
                className="h-auto p-1 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          {step === 'city' && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="w-full justify-start border-gray-700 hover:bg-gray-800"
            >
              ← Back to Provinces
            </Button>
          )}

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-2">
              {step === 'province' ? (
                southAfricanProvinces.map((province) => (
                  <Button
                    key={province.name}
                    variant="outline"
                    onClick={() => handleProvinceSelect(province.name)}
                    className="w-full justify-between border-gray-700 hover:bg-gray-800 hover:border-blue-500 transition-colors"
                  >
                    <span>{province.name}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Button>
                ))
              ) : (
                cities.map((city) => (
                  <Button
                    key={city}
                    variant="outline"
                    onClick={() => handleCitySelect(city)}
                    className="w-full justify-start border-gray-700 hover:bg-gray-800 hover:border-blue-500 transition-colors"
                  >
                    <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                    {city}
                  </Button>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
