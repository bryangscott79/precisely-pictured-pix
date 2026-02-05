import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOnboarding } from '@/contexts/OnboardingContext';
import {
  getMetroNameFromZip,
  getAllStationsForZip,
  LocalNewsStation,
  lookupZipCode,
  createFallbackStation,
  isFallbackStation,
} from '@/data/localNewsStations';
import { saveLocalNewsStation, clearLocalNewsStation } from '@/hooks/useLocalNews';
import { MapPin, Tv, Check, AlertCircle, Radio, Loader2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LocalNewsSetup() {
  const { setStep } = useOnboarding();
  const [zipCode, setZipCode] = useState('');
  const [metroName, setMetroName] = useState<string | null>(null);
  const [stations, setStations] = useState<LocalNewsStation[]>([]);
  const [selectedStation, setSelectedStation] = useState<LocalNewsStation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasLookedUp, setHasLookedUp] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [isFallback, setIsFallback] = useState(false);

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
      setSelectedStation(stationList[0]);
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

  const handleContinue = () => {
    // Save selected station using the centralized function (triggers event)
    if (selectedStation) {
      saveLocalNewsStation(selectedStation, zipCode);
    }
    setStep('youtube');
  };

  const handleSkip = () => {
    clearLocalNewsStation();
    setStep('youtube');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
          <MapPin className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Add Local News</h2>
        <p className="text-muted-foreground">
          Enter your zip code to add your local TV news stations
        </p>
      </div>

      {/* Zip Code Input */}
      <div className="mb-6">
        <div className="relative max-w-[200px] mx-auto">
          <Input
            type="text"
            inputMode="numeric"
            placeholder="Enter zip code"
            value={zipCode}
            onChange={(e) => handleZipChange(e.target.value)}
            className="text-center text-2xl font-mono tracking-widest h-14"
            maxLength={5}
          />
          {isLookingUp && (
            <div className="absolute -right-8 top-1/2 -translate-y-1/2">
              <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
            </div>
          )}
          {!isLookingUp && zipCode.length === 5 && metroName && (
            <div className="absolute -right-8 top-1/2 -translate-y-1/2">
              <Check className="w-5 h-5 text-green-500" />
            </div>
          )}
        </div>
      </div>

      {/* Metro Area Found */}
      {metroName && stations.length > 0 && (
        <div className="flex-1 min-h-0 overflow-auto">
          <div className="text-center mb-4">
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

          <div className="space-y-2">
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
                  'w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold',
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
                  <Radio className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </div>

          {isFallback && (
            <p className="text-xs text-muted-foreground text-center mt-4">
              We'll search YouTube for local news broadcasts in your area.
              Results may vary based on availability.
            </p>
          )}
        </div>
      )}

      {/* No Coverage / Error */}
      {hasLookedUp && !isLookingUp && error && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!hasLookedUp && !isLookingUp && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Tv className="w-16 h-16 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              Enter your 5-digit zip code above
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLookingUp && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary mx-auto mb-3 animate-spin" />
            <p className="text-muted-foreground text-sm">
              Looking up your area...
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <Button
          variant="outline"
          onClick={handleSkip}
          className="flex-1"
        >
          Skip
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!selectedStation || isLookingUp}
          className="flex-1"
        >
          {selectedStation ? `Add ${selectedStation.name.split(' ')[0]}` : 'Continue'}
        </Button>
      </div>
    </div>
  );
}
