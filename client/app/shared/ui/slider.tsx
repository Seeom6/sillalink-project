'use client';

import React, { useState, useRef, useEffect } from 'react';

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number | number[];
  defaultValue?: number | number[];
  onValueChange?: (value: number | number[]) => void;
  disabled?: boolean;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  range?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  className = '',
  orientation = 'horizontal',
  range = false
}) => {
  const [internalValue, setInternalValue] = useState<number | number[]>(() => {
    if (value !== undefined) return value;
    if (defaultValue !== undefined) return defaultValue;
    return range ? [min, max] : min;
  });

  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const activeThumb = useRef<number>(0);

  // Update internal value when controlled value changes
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const currentValue = value !== undefined ? value : internalValue;
  const isRange = range || Array.isArray(currentValue);
  const values = Array.isArray(currentValue) ? currentValue : [currentValue];

  const getPercentage = (val: number) => {
    return ((val - min) / (max - min)) * 100;
  };

  const getValueFromPosition = (clientX: number, clientY: number) => {
    if (!sliderRef.current) return min;

    const rect = sliderRef.current.getBoundingClientRect();
    const isHorizontal = orientation === 'horizontal';
    
    const position = isHorizontal 
      ? (clientX - rect.left) / rect.width
      : 1 - (clientY - rect.top) / rect.height;
    
    const rawValue = min + position * (max - min);
    const steppedValue = Math.round(rawValue / step) * step;
    
    return Math.max(min, Math.min(max, steppedValue));
  };

  const updateValue = (newValue: number, thumbIndex: number = 0) => {
    if (disabled) return;

    let updatedValue: number | number[];

    if (isRange) {
      const newValues = [...values];
      newValues[thumbIndex] = newValue;
      
      // Ensure values don't cross over
      if (thumbIndex === 0 && newValues[1] !== undefined) {
        newValues[0] = Math.min(newValues[0], newValues[1]);
      } else if (thumbIndex === 1 && newValues[0] !== undefined) {
        newValues[1] = Math.max(newValues[1], newValues[0]);
      }
      
      updatedValue = newValues;
    } else {
      updatedValue = newValue;
    }

    if (value === undefined) {
      setInternalValue(updatedValue);
    }
    
    onValueChange?.(updatedValue);
  };

  const handleMouseDown = (event: React.MouseEvent, thumbIndex: number = 0) => {
    if (disabled) return;
    
    event.preventDefault();
    isDragging.current = true;
    activeThumb.current = thumbIndex;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const newValue = getValueFromPosition(e.clientX, e.clientY);
      updateValue(newValue, activeThumb.current);
    };
    
    const handleMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTrackClick = (event: React.MouseEvent) => {
    if (disabled || isDragging.current) return;
    
    const newValue = getValueFromPosition(event.clientX, event.clientY);
    
    if (isRange) {
      // Find closest thumb
      const distances = values.map(val => Math.abs(val - newValue));
      const closestThumb = distances[0] <= distances[1] ? 0 : 1;
      updateValue(newValue, closestThumb);
    } else {
      updateValue(newValue);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, thumbIndex: number = 0) => {
    if (disabled) return;
    
    let newValue = values[thumbIndex];
    
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = Math.min(max, newValue + step);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = Math.max(min, newValue - step);
        break;
      case 'Home':
        newValue = min;
        break;
      case 'End':
        newValue = max;
        break;
      default:
        return;
    }
    
    event.preventDefault();
    updateValue(newValue, thumbIndex);
  };

  const isHorizontal = orientation === 'horizontal';
  const trackStyle = isHorizontal ? 'h-2 w-full' : 'w-2 h-full';
  const thumbStyle = isHorizontal ? 'w-5 h-5' : 'w-5 h-5';

  return (
    <div
      className={`relative flex ${isHorizontal ? 'items-center' : 'justify-center'} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
      style={{ minHeight: isHorizontal ? '20px' : '200px', minWidth: isHorizontal ? '200px' : '20px' }}
    >
      {/* Track */}
      <div
        ref={sliderRef}
        className={`relative bg-gray-200 rounded-full ${trackStyle}`}
        onClick={handleTrackClick}
      >
        {/* Range fill */}
        {isRange ? (
          <div
            className="absolute bg-blue-500 rounded-full h-full"
            style={{
              left: `${getPercentage(values[0])}%`,
              width: `${getPercentage(values[1]) - getPercentage(values[0])}%`,
            }}
          />
        ) : (
          <div
            className="absolute bg-blue-500 rounded-full h-full"
            style={{
              width: `${getPercentage(values[0])}%`,
            }}
          />
        )}
        
        {/* Thumbs */}
        {values.map((val, index) => (
          <div
            key={index}
            className={`absolute bg-white border-2 border-blue-500 rounded-full shadow-md transform -translate-x-1/2 -translate-y-1/2 ${thumbStyle} ${
              disabled ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            style={{
              left: `${getPercentage(val)}%`,
              top: '50%',
            }}
            tabIndex={disabled ? -1 : 0}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={val}
            aria-orientation={orientation}
            onMouseDown={(e) => handleMouseDown(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
