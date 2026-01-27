import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguagePreference, SUPPORTED_LANGUAGES, LanguagePreference } from '@/hooks/useLanguagePreference';
import { Check, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LanguageSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LanguageSettingsModal({ open, onOpenChange }: LanguageSettingsModalProps) {
  const { language, setLanguage } = useLanguagePreference();

  const handleSelect = (lang: LanguagePreference) => {
    setLanguage(lang);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel border-white/10 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Globe className="w-5 h-5" />
            Language Preferences
          </DialogTitle>
        </DialogHeader>
        
        <p className="text-sm text-muted-foreground mb-4">
          Select your preferred language for video content. This helps filter videos to show content in your language.
        </p>

        <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <Button
              key={lang.code}
              variant="ghost"
              className={cn(
                'justify-start gap-2 h-auto py-3 px-3',
                language.code === lang.code 
                  ? 'bg-primary/20 border border-primary/50' 
                  : 'hover:bg-white/10'
              )}
              onClick={() => handleSelect(lang)}
            >
              <span className="flex-1 text-left">{lang.name}</span>
              {language.code === lang.code && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </Button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          Note: Content availability varies by language. Changing this will refresh your channels.
        </p>
      </DialogContent>
    </Dialog>
  );
}
