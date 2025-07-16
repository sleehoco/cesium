
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Car, Info } from 'lucide-react';
import CEOPopup from './CEOPopup';

interface CEOPopupTriggerProps {
  variant?: 'button' | 'text' | 'image';
  className?: string;
  children?: React.ReactNode;
}

const CEOPopupTrigger = ({ 
  variant = 'button', 
  className = '', 
  children 
}: CEOPopupTriggerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  if (variant === 'text') {
    return (
      <>
        <button
          onClick={handleClick}
          className={`text-primary hover:text-primary/80 underline transition-colors ${className}`}
        >
          {children || 'Learn about our CEO'}
        </button>
        <CEOPopup open={isOpen} onOpenChange={setIsOpen} />
      </>
    );
  }

  if (variant === 'image') {
    return (
      <>
        <div
          onClick={handleClick}
          className={`cursor-pointer transition-transform hover:scale-105 ${className}`}
        >
          {children}
        </div>
        <CEOPopup open={isOpen} onOpenChange={setIsOpen} />
      </>
    );
  }

  return (
    <>
      <Button
        onClick={handleClick}
        variant="outline"
        className={`flex items-center gap-2 ${className}`}
      >
        <Car className="h-4 w-4" />
        {children || 'Meet Our CEO'}
      </Button>
      <CEOPopup open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
};

export default CEOPopupTrigger;
