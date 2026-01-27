import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PinEntryProps {
  onSubmit: (pin: string) => boolean;
  onCancel?: () => void;
  title?: string;
  isCreating?: boolean;
}

export function PinEntry({ onSubmit, onCancel, title, isCreating = false }: PinEntryProps) {
  const [pin, setPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const confirmInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleDigitChange = (index: number, value: string, isConfirm = false) => {
    // Only allow single digits
    if (!/^\d*$/.test(value)) return;

    const currentPin = isConfirm ? [...confirmPin] : [...pin];
    currentPin[index] = value.slice(-1);
    
    if (isConfirm) {
      setConfirmPin(currentPin);
    } else {
      setPin(currentPin);
    }

    setError('');

    // Auto-advance to next input
    if (value && index < 3) {
      const refs = isConfirm ? confirmInputRefs : inputRefs;
      refs.current[index + 1]?.focus();
    }

    // Check if PIN is complete
    if (currentPin.every(d => d !== '')) {
      if (isCreating && !isConfirm) {
        // Move to confirm stage
        setIsConfirming(true);
        setTimeout(() => confirmInputRefs.current[0]?.focus(), 100);
      } else if (isCreating && isConfirm) {
        // Verify pins match
        const pinStr = pin.join('');
        const confirmStr = currentPin.join('');
        if (pinStr === confirmStr) {
          onSubmit(pinStr);
        } else {
          setError('PINs do not match');
          setConfirmPin(['', '', '', '']);
          setTimeout(() => confirmInputRefs.current[0]?.focus(), 100);
        }
      } else {
        // Verify PIN
        const success = onSubmit(currentPin.join(''));
        if (!success) {
          setError('Incorrect PIN');
          setPin(['', '', '', '']);
          setTimeout(() => inputRefs.current[0]?.focus(), 100);
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent, isConfirm = false) => {
    if (e.key === 'Backspace') {
      const currentPin = isConfirm ? confirmPin : pin;
      if (!currentPin[index] && index > 0) {
        const refs = isConfirm ? confirmInputRefs : inputRefs;
        refs.current[index - 1]?.focus();
      }
    }
  };

  const renderPinInputs = (values: string[], refs: React.MutableRefObject<(HTMLInputElement | null)[]>, isConfirm = false) => (
    <div className="flex gap-3 justify-center">
      {values.map((digit, index) => (
        <input
          key={index}
          ref={(el) => { refs.current[index] = el; }}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleDigitChange(index, e.target.value, isConfirm)}
          onKeyDown={(e) => handleKeyDown(index, e, isConfirm)}
          className={cn(
            'w-14 h-14 text-center text-2xl font-bold rounded-lg',
            'bg-white/10 border-2 border-white/20',
            'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50',
            'transition-all'
          )}
        />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {title && <p className="text-white/70">{title}</p>}

      {!isConfirming ? (
        <>
          <p className="text-sm text-white/60">
            {isCreating ? 'Create a 4-digit PIN' : 'Enter your 4-digit PIN'}
          </p>
          {renderPinInputs(pin, inputRefs)}
        </>
      ) : (
        <>
          <p className="text-sm text-white/60">Confirm your PIN</p>
          {renderPinInputs(confirmPin, confirmInputRefs, true)}
        </>
      )}

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {onCancel && (
        <Button variant="ghost" onClick={onCancel} size="sm">
          Cancel
        </Button>
      )}
    </div>
  );
}
