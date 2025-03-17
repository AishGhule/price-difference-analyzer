
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Layers, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { groupSimilarProducts } from '@/utils/dataUtils';

interface ProductGrouperProps {
  productData: any[];
  onComplete: (data: any[]) => void;
}

const ProductGrouper: React.FC<ProductGrouperProps> = ({ productData, onComplete }) => {
  const [isGrouping, setIsGrouping] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const startGrouping = async () => {
    setIsGrouping(true);
    setProgress(0);
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.floor(Math.random() * 15);
          return newProgress >= 90 ? 90 : newProgress; // Cap at 90% until complete
        });
      }, 500);
      
      // Perform the actual grouping
      const groupedData = await groupSimilarProducts(productData);
      
      // Finish progress and clear interval
      clearInterval(progressInterval);
      setProgress(100);
      
      // Small delay before completing
      setTimeout(() => {
        setIsGrouping(false);
        if (groupedData.length === 0) {
          toast.warning('No similar product groups were found. Check your data.');
        } else {
          toast.success(`Found ${groupedData.length} similar product groups!`);
          onComplete(groupedData);
        }
      }, 1000);
    } catch (error) {
      console.error('Error grouping products:', error);
      toast.error('An error occurred while grouping products');
      setIsGrouping(false);
    }
  };
  
  return (
    <div className="animate-fade-in">
      <div className="bg-secondary/50 rounded-lg p-6 mb-6 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Layers className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium mb-2">Group Similar Products</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
          This step will analyze all products and identify similar male/female product pairs based on ingredients and functionality.
        </p>
        
        {isGrouping ? (
          <div className="space-y-4">
            <Progress value={progress} className="w-full h-2" />
            <p className="text-sm text-muted-foreground">
              Grouping similar products... {progress}% complete
            </p>
          </div>
        ) : (
          <Button 
            onClick={startGrouping}
            className="relative overflow-hidden transition-all"
          >
            <span>Start Grouping</span>
          </Button>
        )}
      </div>
      
      <div className="space-y-3 bg-muted/30 rounded-lg p-4">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          What This Step Does
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1 pl-6 list-disc">
          <li>Compares male and female products from the same brand</li>
          <li>Identifies products with similar active ingredient functionality</li>
          <li>Analyzes inactive ingredient overlap</li>
          <li>Groups comparable products together for price analysis</li>
          <li>Assigns a similarity score to each product pair</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductGrouper;
