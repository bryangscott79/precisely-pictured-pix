import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { getMetroFromZip, getMetroNameFromZip, getAllStationsForZip, LocalNewsStation } from '@/data/localNewsStations';
import { MapPin, Tv, Check, AlertCircle, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LocalNewsSetup() {
  const { setStep, state } = useOnboarding();
  const [zipCode, setZipCode] = useState('');
  const [metroName, setMetroName] = useState<string | null>(null);
  const [stations, setStations] = useState<LocalNewsStation[]>([]);
  const [selectedStation, setSelectedStation] = useState<LocalNewsStation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasLookedUp, setHasLookedUp] = useState(false);

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
    }
  };

  const lookupZip = (zip: string) => {
    const metro = getMetroNameFromZip(zip);
    const stationList = getAllStationsForZip(zip);
    
    setHasLookedUp(true);
    
    if (metro && stationList.length > 0) {
      setMetroName(metro);
      setStations(stationList);
      setSelectedStation(stationList[0]); // Auto-select first station
      setError(null);
    } else {
      setMetroName(null);
      setStations([]);
      setSelectedStation(null);
      setError("We don't have local news for this area yet. You can skip this step.");
    }
  };

  const handleContinue = () => {
    // Save selected station to localStorage for now
    if (selectedStation) {
      localStorage.setItem('epishow-local-news-station', JSON.stringify(selectedStation));
      localStorage.setItem('epishow-local-zip', zipCode);
    }
    setStep('youtube');
  };

  const handleSkip = () => {
    localStorage.removeItem('epishow-local-news-station');
    localStorage.removeItem('epishow-local-zip');
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
          {zipCode.length === 5 && metroName && (
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
            <p className="text-sm text-muted-foreground">
              Found <span className="text-foreground font-medium">{stations.length} stations</span> in
            </p>
            <p className="text-lg font-semibold text-primary">{metroName}</p>
          </div>

          <div className="space-y-2">
            {stations.map((station) => (
              <button
                key={station.callSign}
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
                  {station.network}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{station.name}</p>
                  <p className="text-xs text-muted-foreground">{station.callSign}</p>
                </div>
                {selectedStation?.callSign === station.callSign && (
                  <Radio className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No Coverage */}
      {hasLookedUp && error && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">{error}</p>
            <p className="text-sm text-muted-foreground mt-2">
              We're adding more markets soon!
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!hasLookedUp && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Tv className="w-16 h-16 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              Enter your 5-digit zip code above
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
          disabled={!selectedStation}
          className="flex-1"
        >
          {selectedStation ? `Add ${selectedStation.name.split(' ')[0]}` : 'Continue'}
        </Button>
      </div>
    </div>
  );
}
