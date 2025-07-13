import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  initialSeconds: number;
  onComplete?: () => void;
  onReset?: () => void;
  className?: string;
  format?: 'mm:ss' | 'seconds';
}

export function CountdownTimer({
  initialSeconds,
  onComplete,
  onReset,
  className = '',
  format = 'mm:ss',
}: CountdownTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    setSeconds(initialSeconds);
    setIsActive(true);
  }, [initialSeconds]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 1) {
            setIsActive(false);
            if (onComplete) {
              onComplete();
            }
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, seconds, onComplete]);

  const reset = () => {
    setSeconds(initialSeconds);
    setIsActive(true);
    if (onReset) {
      onReset();
    }
  };

  const formatTime = (totalSeconds: number) => {
    if (format === 'seconds') {
      return `${totalSeconds}s`;
    }
    
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <span className={className}>
      {formatTime(seconds)}
    </span>
  );
}

interface ResendTimerProps {
  initialSeconds?: number;
  onResend: () => void;
  disabled?: boolean;
  className?: string;
}

export function ResendTimer({
  initialSeconds = 60,
  onResend,
  disabled = false,
  className = '',
}: ResendTimerProps) {
  const [seconds, setSeconds] = useState(0);
  const [canResend, setCanResend] = useState(true);

  const handleResend = () => {
    if (disabled || !canResend) return;
    
    onResend();
    setSeconds(initialSeconds);
    setCanResend(false);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [seconds]);

  return (
    <button
      type="button"
      onClick={handleResend}
      disabled={disabled || !canResend}
      className={`text-sm font-medium transition-colors duration-200 ${
        disabled || !canResend
          ? 'text-gray-400 cursor-not-allowed'
          : 'text-blue-600 hover:text-blue-000 cursor-pointer'
      } ${className}`}
    >
      {canResend ? (
        'Resend code'
      ) : (
        `Resend in ${seconds}s`
      )}
    </button>
  );
}
