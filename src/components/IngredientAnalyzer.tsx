
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Beaker, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface IngredientAnalyzerProps {
  data: any[];
  onComplete: (data: any[]) => void;
}

// Mapping of active ingredients to their functionality
const knownIngredients: Record<string, string> = {
  "salicylic acid": "Exfoliation and pore clearing",
  "benzoyl peroxide": "Antimicrobial and anti-inflammatory",
  "retinol": "Cell turnover and collagen production",
  "hyaluronic acid": "Hydration and moisture retention",
  "niacinamide": "Sebum regulation and pore refinement",
  "vitamin c": "Antioxidant and brightening",
  "glycolic acid": "Exfoliation and texture improvement",
  "lactic acid": "Gentle exfoliation and hydration",
  "aloe vera": "Soothing and hydration",
  "tea tree oil": "Antimicrobial and anti-inflammatory",
  "witch hazel": "Astringent and pore tightening",
  "zinc oxide": "Sun protection and soothing",
  "titanium dioxide": "Sun protection",
  "ceramides": "Barrier repair and hydration",
  "peptides": "Collagen stimulation and firming",
  "shea butter": "Moisturizing and softening",
  "glycerin": "Hydration and moisture attraction",
  "alpha arbutin": "Brightening and hyperpigmentation",
  "allantoin": "Soothing and healing",
  "centella asiatica": "Calming and healing",
  "caffeine": "Vasoconstriction and de-puffing",
  "collagen": "Hydration and elasticity",
  "cocamidopropyl betaine": "Gentle cleansing and foaming agent"
};

const IngredientAnalyzer: React.FC<IngredientAnalyzerProps> = ({ data, onComplete }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const analyzeIngredients = () => {
    setIsAnalyzing(true);
    setProgress(0);
    
    // Simulate API call with progressive updates
    const totalItems = data.length;
    let currentItem = 0;
    
    const analyzedData = data.map(item => {
      // Add a small delay to each item to simulate processing time
      currentItem++;
      setProgress(Math.floor((currentItem / totalItems) * 100));
      
      // Make sure we're working with lowercase for comparison
      const activeIngredient = item['Active Ingredient']?.toLowerCase() || '';
      
      // Look up the functionality from our known ingredients mapping
      let functionality = "Unknown";
      
      // Check if the active ingredient contains any of our known ingredients
      Object.keys(knownIngredients).forEach(knownIngredient => {
        if (activeIngredient.includes(knownIngredient)) {
          functionality = knownIngredients[knownIngredient];
        }
      });
      
      // Make sure we preserve the Gender Classification field correctly
      return {
        ...item,
        'Functionality of Active Ingredient': functionality
      };
    });
    
    // Complete the analysis after a short delay
    setTimeout(() => {
      setIsAnalyzing(false);
      toast.success('Ingredient analysis completed!');
      onComplete(analyzedData);
    }, 1500);
  };
  
  return (
    <div className="animate-fade-in">
      <div className="bg-secondary/50 rounded-lg p-6 mb-6 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Beaker className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium mb-2">Analyze Active Ingredients</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
          This will process your product data to determine the functionality of each active ingredient.
        </p>
        
        {isAnalyzing ? (
          <div className="space-y-4">
            <Progress value={progress} className="w-full h-2" />
            <p className="text-sm text-muted-foreground">
              Analyzing ingredients... {progress}% complete
            </p>
          </div>
        ) : (
          <Button 
            onClick={analyzeIngredients}
            className="relative overflow-hidden transition-all"
          >
            <span>Start Analysis</span>
          </Button>
        )}
      </div>
      
      <div className="space-y-3 bg-muted/30 rounded-lg p-4">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          What This Step Does
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1 pl-6 list-disc">
          <li>Processes each product's active ingredient</li>
          <li>Determines the primary functionality of each ingredient</li>
          <li>Categorizes ingredients by their skin benefits</li>
          <li>Prepares data for the next step of product grouping</li>
        </ul>
      </div>
    </div>
  );
};

export default IngredientAnalyzer;
