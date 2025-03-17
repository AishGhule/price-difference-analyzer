
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface StepContainerProps {
  number: number;
  title: string;
  isActive: boolean;
  delay?: number;
  children: React.ReactNode;
}

const StepContainer: React.FC<StepContainerProps> = ({ 
  number, 
  title, 
  isActive, 
  delay = 0,
  children 
}) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Only animate entrance after the specified delay
    if (isActive) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, delay * 200);
      
      return () => clearTimeout(timer);
    }
    
    return undefined;
  }, [isActive, delay]);
  
  if (!isActive) return null;

  return (
    <div 
      className={cn(
        "mb-8 rounded-lg border bg-white shadow-sm transition-all card-transition",
        visible ? "opacity-100 transform-none" : "opacity-0 translate-y-4"
      )}
      style={{ 
        transitionDelay: `${delay * 100}ms`,
        transitionDuration: '500ms'
      }}
    >
      <div className="flex items-center gap-3 p-4 border-b">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          {number}
        </div>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default StepContainer;
