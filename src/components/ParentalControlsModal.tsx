import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, Lock, Unlock, AlertTriangle } from 'lucide-react';
import { useParentalControls } from '@/hooks/useParentalControls';

interface ParentalControlsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = 'main' | 'set-pin' | 'verify-pin' | 'confirm-disable';

export function ParentalControlsModal({ open, onOpenChange }: ParentalControlsModalProps) {
  const { enabled, pin, setEnabled, setPin, verifyPin } = useParentalControls();
  const [step, setStep] = useState<Step>('main');
  const [inputPin, setInputPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  const handleClose = () => {
    setStep('main');
    setInputPin('');
    setConfirmPin('');
    setError('');
    onOpenChange(false);
  };

  const handleToggle = () => {
    if (!enabled) {
      // Enabling parental controls - need to set a PIN
      if (!pin) {
        setStep('set-pin');
      } else {
        setEnabled(true);
        handleClose();
      }
    } else {
      // Disabling - need to verify PIN
      if (pin) {
        setStep('verify-pin');
      } else {
        setEnabled(false);
        handleClose();
      }
    }
  };

  const handleSetPin = () => {
    if (inputPin.length !== 4) {
      setError('Please enter a 4-digit PIN');
      return;
    }
    if (inputPin !== confirmPin) {
      setError('PINs do not match');
      return;
    }
    setPin(inputPin);
    setEnabled(true);
    handleClose();
  };

  const handleVerifyPin = () => {
    if (verifyPin(inputPin)) {
      setStep('confirm-disable');
      setInputPin('');
      setError('');
    } else {
      setError('Incorrect PIN');
      setInputPin('');
    }
  };

  const handleConfirmDisable = () => {
    setEnabled(false);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Parental Controls
          </DialogTitle>
          <DialogDescription>
            Restrict access to mature content and protect young viewers.
          </DialogDescription>
        </DialogHeader>

        {step === 'main' && (
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                {enabled ? (
                  <Lock className="w-5 h-5 text-primary" />
                ) : (
                  <Unlock className="w-5 h-5 text-muted-foreground" />
                )}
                <div>
                  <Label htmlFor="parental-toggle" className="font-medium">
                    {enabled ? 'Controls Active' : 'Controls Disabled'}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {enabled 
                      ? 'Restricted channels are hidden' 
                      : 'All channels are accessible'}
                  </p>
                </div>
              </div>
              <Switch 
                id="parental-toggle"
                checked={enabled}
                onCheckedChange={handleToggle}
              />
            </div>

            <div className="text-sm text-muted-foreground space-y-2">
              <p>When parental controls are enabled:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Channels marked as restricted will be hidden</li>
                <li>A 4-digit PIN is required to disable controls</li>
                <li>Settings are saved to this device</li>
              </ul>
            </div>

            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        )}

        {step === 'set-pin' && (
          <div className="space-y-6 py-4">
            <div className="text-center space-y-2">
              <Lock className="w-12 h-12 mx-auto text-primary" />
              <p className="text-sm text-muted-foreground">
                Create a 4-digit PIN to protect your parental control settings
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Enter PIN</Label>
                <div className="flex justify-center">
                  <InputOTP maxLength={4} value={inputPin} onChange={setInputPin}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Confirm PIN</Label>
                <div className="flex justify-center">
                  <InputOTP maxLength={4} value={confirmPin} onChange={setConfirmPin}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              {error && (
                <p className="text-center text-sm text-destructive">{error}</p>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('main')} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSetPin} className="flex-1">
                Set PIN
              </Button>
            </div>
          </div>
        )}

        {step === 'verify-pin' && (
          <div className="space-y-6 py-4">
            <div className="text-center space-y-2">
              <Lock className="w-12 h-12 mx-auto text-primary" />
              <p className="text-sm text-muted-foreground">
                Enter your PIN to disable parental controls
              </p>
            </div>

            <div className="flex justify-center">
              <InputOTP maxLength={4} value={inputPin} onChange={setInputPin}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {error && (
              <p className="text-center text-sm text-destructive">{error}</p>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('main')} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleVerifyPin} className="flex-1">
                Verify
              </Button>
            </div>
          </div>
        )}

        {step === 'confirm-disable' && (
          <div className="space-y-6 py-4">
            <div className="text-center space-y-2">
              <AlertTriangle className="w-12 h-12 mx-auto text-destructive" />
              <p className="font-medium">Disable Parental Controls?</p>
              <p className="text-sm text-muted-foreground">
                All channels including restricted content will become accessible.
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('main')} className="flex-1">
                Keep Enabled
              </Button>
              <Button variant="destructive" onClick={handleConfirmDisable} className="flex-1">
                Disable
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
