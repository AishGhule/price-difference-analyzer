
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { BarChart, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { calculatePriceDifferences } from '@/utils/dataUtils';

interface PriceDifferenceCalculatorProps {
  data: any[];
  onComplete: (data: any[]) => void;
}

const PriceDifferenceCalculator: React.FC<PriceDifferenceCalculatorProps> = ({ data, onComplete }) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const startCalculation = () => {
    if (data.length === 0) {
      toast.error('No grouped data available for comparison');
      return;
    }
    
    setIsCalculating(true);
    setProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 20;
        return newProgress >= 95 ? 95 : newProgress;
      });
    }, 400);
    
    // Calculate price differences
    setTimeout(() => {
      clearInterval(progressInterval);
      const resultData = calculatePriceDifferences(data);
      setProgress(100);
      
      // Complete calculation
      setTimeout(() => {
        setIsCalculating(false);
        toast.success('Price difference calculation completed!');
        onComplete(resultData);
      }, 800);
    }, 1500);
  };
  
  return (
    <div className="animate-fade-in">
      <div className="bg-secondary/50 rounded-lg p-6 mb-6 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <BarChart className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium mb-2">Calculate Price Differences</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
          This final step will calculate price differences between similar male and female products to identify potential gender-based pricing.
        </p>
        
        {isCalculating ? (
          <div className="space-y-4">
            <Progress value={progress} className="w-full h-2" />
            <p className="text-sm text-muted-foreground">
              Calculating price differences... {progress}% complete
            </p>
          </div>
        ) : (
          <Button 
            onClick={startCalculation}
            className="relative overflow-hidden transition-all"
          >
            <span>Calculate Differences</span>
          </Button>
        )}
      </div>
      
      <div className="space-y-3 bg-muted/30 rounded-lg p-4">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          What This Step Does
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1 pl-6 list-disc">
          <li>Compares prices between paired male and female products</li>
          <li>Calculates the percentage difference in pricing</li>
          <li>Identifies instances of potential gender-based price discrimination</li>
          <li>Generates a final report of price differences</li>
        </ul>
      </div>
    </div>
  );
};

export default PriceDifferenceCalculator;
