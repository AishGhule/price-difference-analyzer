
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
  "cocamidopropyl betaine": "Gentle cleansing and foaming agent",
  "dimethicone": "Moisturizing and barrier protection",
  "parfum": "Fragrance and olfactory enhancement",
  "cocamide mea": "Foam boosting and conditioning",
  "sodium laureth sulfate": "Cleansing and foam production",
  "panthenol": "Moisturizing and skin conditioning",
  "biotin": "Hair strengthening and conditioning",
  "polyquaternium": "Conditioning and static reduction",
  "menthol": "Cooling and refreshing sensation"
};

// Default functionality based on product categories or ingredients
const getDefaultFunctionality = (activeIngredient: string, productName: string): string => {
  const lowerProductName = productName.toLowerCase();
  
  if (lowerProductName.includes('shampoo')) {
    return "Cleansing and scalp health";
  } else if (lowerProductName.includes('conditioner')) {
    return "Hair conditioning and detangling";
  } else if (lowerProductName.includes('moisturizer') || lowerProductName.includes('lotion')) {
    return "Skin hydration and moisturizing";
  } else if (lowerProductName.includes('cleanser') || lowerProductName.includes('wash')) {
    return "Skin cleansing and purifying";
  } else if (lowerProductName.includes('deodorant')) {
    return "Odor neutralizing and freshness";
  } else if (lowerProductName.includes('razor') || lowerProductName.includes('shave')) {
    return "Hair removal and skin protection";
  } else {
    // Extract possible functional words from the ingredient itself
    if (activeIngredient.includes('oil')) return "Moisturizing and nourishing";
    if (activeIngredient.includes('extract')) return "Natural conditioning and nurturing";
    if (activeIngredient.includes('butter')) return "Deep moisturizing and protection";
    if (activeIngredient.includes('vitamin')) return "Nourishing and protective";
    
    // Default if nothing else matches
    return "Personal care and skin health";
  }
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
      const productName = item['Product Name'] || '';
      
      // Look up the functionality from our known ingredients mapping
      let functionality = null;
      
      // Check if the active ingredient contains any of our known ingredients
      Object.keys(knownIngredients).forEach(knownIngredient => {
        if (activeIngredient.includes(knownIngredient)) {
          functionality = knownIngredients[knownIngredient];
        }
      });
      
      // If no functionality found, use the default based on product type
      if (!functionality) {
        functionality = getDefaultFunctionality(activeIngredient, productName);
      }
      
      // Get the gender classification directly from the data
      // Make sure it's properly formatted as "Men", "Women", or "Unisex"
      let gender = item['Gender Classification'];
      
      // If gender classification is missing, try to infer from product name
      if (!gender) {
        const lowerName = productName.toLowerCase();
        if (lowerName.includes('men')) {
          gender = 'Men';
        } else if (lowerName.includes('women')) {
          gender = 'Women';
        } else {
          gender = 'Unisex';
        }
      }
      
      // Ensure gender is formatted correctly
      if (typeof gender === 'string') {
        if (gender.toLowerCase() === 'male' || gender.toLowerCase() === 'm') {
          gender = 'Men';
        } else if (gender.toLowerCase() === 'female' || gender.toLowerCase() === 'f') {
          gender = 'Women';
        }
      }
      
      return {
        ...item,
        'Functionality of Active Ingredient': functionality,
        'Gender Classification': gender
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
