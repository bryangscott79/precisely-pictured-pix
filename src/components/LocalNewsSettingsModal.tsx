import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  getMetroNameFromZip,
  getAllStationsForZip,
  LocalNewsStation,
  lookupZipCode,
  createFallbackStation,
  isFallbackStation,
} from '@/data/localNewsStations';
import {
  useLocalNewsStation,
  saveLocalNewsStation,
  clearLocalNewsStation
} from '@/hooks/useLocalNews';
import { MapPin, Tv, Check, AlertCircle, Radio, Loader2, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface LocalNewsSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LocalNewsSettingsModal({
  open,
  onOpenChange,
}: LocalNewsSettingsModalProps) {
  const currentStation = useLocalNewsStation();
  const [zipCode, setZipCode] = useState('');
  const [metroName, setMetroName] = useState<string | null>(null);
  const [stations, setStations] = useState<LocalNewsStation[]>([]);
  const [selectedStation, setSelectedStation] = useState<LocalNewsStation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasLookedUp, setHasLookedUp] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [isFallback, setIsFallback] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      // Load saved zip code if available
      const savedZip = localStorage.getItem('epishow-local-zip');
      if (savedZip) {
        setZipCode(savedZip);
        lookupZip(savedZip);
      } else {
        setZipCode('');
        setMetroName(null);
        setStations([]);
        setSelectedStation(null);
        setError(null);
        setHasLookedUp(false);
        setIsFallback(false);
      }
    }
  }, [open]);

  const handleZipChange = (value: string) => {
    // Only allow digits
    const cleaned = value.replace(/\D/g, '').slice(0, 5);
    setZipCode(cleaned);

    // Auto-lookup when we have 5 digits
    if (cleaned.length === 5) {
      lookupZip(cleaned);
    } else {
      setMetroName(null);
      setStations([]);
      setSelectedStation(null);
      setError(null);
      setHasLookedUp(false);
      setIsFallback(false);
    }
  };

  const lookupZip = async (zip: string) => {
    setIsLookingUp(true);
    setError(null);

    // First, check our curated database
    const metro = getMetroNameFromZip(zip);
    const stationList = getAllStationsForZip(zip);

    setHasLookedUp(true);

    if (metro && stationList.length > 0) {
      // Found in curated database
      setMetroName(metro);
      setStations(stationList);
      // Select the current station if it's in the list, otherwise first station
      const current = currentStation
        ? stationList.find(s => s.callSign === currentStation.callSign)
        : null;
      setSelectedStation(current || stationList[0]);
      setIsFallback(false);
      setIsLookingUp(false);
      return;
    }

    // Not in database - try to look up the zip code via API
    try {
      const location = await lookupZipCode(zip);

      if (location) {
        // Create a fallback station using YouTube search
        const fallbackStation = createFallbackStation(
          location.city,
          location.state,
          location.stateAbbr
        );

        setMetroName(location.city);
        setStations([fallbackStation]);
        setSelectedStation(fallbackStation);
        setIsFallback(true);
        setError(null);
      } else {
        // Couldn't find the zip code at all
        setMetroName(null);
        setStations([]);
        setSelectedStation(null);
        setIsFallback(false);
        setError("We couldn't find this zip code. Please check and try again.");
      }
    } catch (err) {
      console.error('Error looking up zip code:', err);
      setMetroName(null);
      setStations([]);
      setSelectedStation(null);
      setIsFallback(false);
      setError("We couldn't look up this zip code. Please try again later.");
    }

    setIsLookingUp(false);
  };

  const handleSave = () => {
    if (selectedStation) {
      saveLocalNewsStation(selectedStation, zipCode);
      toast.success(`Local news set to ${selectedStation.name}`);
      onOpenChange(false);
    }
  };

  const handleRemove = () => {
    clearLocalNewsStation();
    toast.success('Local news removed');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel border-white/10 max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Local News Settings
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {/* Current Station */}
          {currentStation && (
            <div className="mb-4 p-3 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold',
                    currentStation.network === 'FOX' && 'bg-blue-600 text-white',
                    currentStation.network === 'ABC' && 'bg-amber-500 text-white',
                    currentStation.network === 'NBC' && 'bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 text-white',
                    currentStation.network === 'CBS' && 'bg-blue-900 text-white',
                    currentStation.network === 'PBS' && 'bg-blue-700 text-white',
                    currentStation.network === 'CW' && 'bg-green-600 text-white',
                    currentStation.network === 'Independent' && 'bg-gray-600 text-white',
                  )}>
                    {currentStation.network}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{currentStation.name}</p>
                    <p className="text-xs text-muted-foreground">{currentStation.city}, {currentStation.state}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Zip Code Input */}
          <div className="mb-4">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Enter your zip code
            </label>
            <div className="relative">
              <Input
                type="text"
                inputMode="numeric"
                placeholder="12345"
                value={zipCode}
                onChange={(e) => handleZipChange(e.target.value)}
                className="text-center text-xl font-mono tracking-widest h-12"
                maxLength={5}
              />
              {isLookingUp && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                </div>
              )}
              {!isLookingUp && zipCode.length === 5 && metroName && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              )}
            </div>
          </div>

          {/* Metro Area Found */}
          {metroName && stations.length > 0 && (
            <div className="space-y-3">
              <div className="text-center">
                {isFallback ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Searching YouTube for news in
                    </p>
                    <p className="text-lg font-semibold text-primary">{metroName}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
                      <Search className="w-3 h-3" />
                      via YouTube search
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Found <span className="text-foreground font-medium">{stations.length} stations</span> in
                    </p>
                    <p className="text-lg font-semibold text-primary">{metroName}</p>
                  </>
                )}
              </div>

              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {stations.map((station, index) => (
                  <button
                    key={station.callSign + index}
                    onClick={() => setSelectedStation(station)}
                    className={cn(
                      'w-full p-3 rounded-lg border text-left transition-all flex items-center gap-3',
                      selectedStation?.callSign === station.callSign
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0',
                      station.network === 'FOX' && 'bg-blue-600 text-white',
                      station.network === 'ABC' && 'bg-amber-500 text-white',
                      station.network === 'NBC' && 'bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 text-white',
                      station.network === 'CBS' && 'bg-blue-900 text-white',
                      station.network === 'PBS' && 'bg-blue-700 text-white',
                      station.network === 'CW' && 'bg-green-600 text-white',
                      station.network === 'Independent' && 'bg-gray-600 text-white',
                    )}>
                      {isFallbackStation(station) ? (
                        <Search className="w-4 h-4" />
                      ) : (
                        station.network
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{station.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {isFallbackStation(station) ? 'YouTube Search' : station.callSign}
                      </p>
                    </div>
                    {selectedStation?.callSign === station.callSign && (
                      <Radio className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              {isFallback && (
                <p className="text-xs text-muted-foreground text-center">
                  We'll search YouTube for local news broadcasts in your area.
                </p>
              )}
            </div>
          )}

          {/* No Coverage / Error */}
          {hasLookedUp && !isLookingUp && error && (
            <div className="text-center py-6">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!hasLookedUp && !isLookingUp && !currentStation && (
            <div className="text-center py-6">
              <Tv className="w-16 h-16 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                Enter your 5-digit zip code to find local news stations
              </p>
            </div>
          )}

          {/* Loading State */}
          {isLookingUp && (
            <div className="text-center py-6">
              <Loader2 className="w-12 h-12 text-primary mx-auto mb-3 animate-spin" />
              <p className="text-muted-foreground text-sm">
                Looking up your area...
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!selectedStation || isLookingUp}
            className="flex-1"
          >
            {selectedStation ? `Save` : 'Select a Station'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
