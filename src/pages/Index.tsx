import { useState } from 'react';
import { Button } from '@/components/ui/button';
import FileUpload from '@/components/FileUpload';
import DataTable from '@/components/DataTable';
import StepContainer from '@/components/StepContainer';
import IngredientAnalyzer from '@/components/IngredientAnalyzer';
import ProductGrouper from '@/components/ProductGrouper';
import PriceDifferenceCalculator from '@/components/PriceDifferenceCalculator';

const Index = () => {
  // Step tracking
  const [currentStep, setCurrentStep] = useState(1);
  
  // Data for each step
  const [rawData, setRawData] = useState<any[]>([]);
  const [processedData, setProcessedData] = useState<any[]>([]);
  const [analyzedData, setAnalyzedData] = useState<any[]>([]);
  const [groupedData, setGroupedData] = useState<any[]>([]);
  const [resultData, setResultData] = useState<any[]>([]);
  
  // Step 1: Handle data upload and preprocessing
  const handleDataUploaded = (data: any[]) => {
    setRawData(data);
    // Preprocessed data (remove URL and Price Per Unit columns)
    const cleaned = data.map(item => {
      const { URL, 'Price Per Unit': ppu, ...rest } = item;
      // Ensure price is properly converted to a number
      if (typeof rest.Price === 'string') {
        rest.Price = parseFloat(rest.Price.replace(/[^0-9.-]+/g, '')) || 0;
      }
      return rest;
    });
    setProcessedData(cleaned);
    setCurrentStep(2);
  };
  
  // Step 2: Analyze ingredients
  const handleIngredientsAnalyzed = (data: any[]) => {
    setAnalyzedData(data);
    setCurrentStep(3);
  };
  
  // Step 3: Group similar products
  const handleProductsGrouped = (data: any[]) => {
    setGroupedData(data);
    setCurrentStep(4);
  };
  
  // Step 4: Calculate price differences
  const handlePriceDifferencesCalculated = (data: any[]) => {
    setResultData(data);
  };
  
  // Column definitions for tables
  const rawDataColumns = [
    { key: 'Brand', label: 'Brand' },
    { key: 'Product Name', label: 'Product Name' },
    { key: 'Price', label: 'Price' },
    { key: 'Active Ingredient', label: 'Active Ingredient' },
    { key: 'Inactive Ingredients', label: 'Inactive Ingredients' },
    { key: 'Gender Classification', label: 'Gender' }
  ];
  
  const analyzedDataColumns = [
    { key: 'Brand', label: 'Brand' },
    { key: 'Product Name', label: 'Product Name' },
    { key: 'Active Ingredient', label: 'Active Ingredient' },
    { key: 'Functionality of Active Ingredient', label: 'Functionality' },
    { key: 'Gender Classification', label: 'Gender' },
    { key: 'Price', label: 'Price' }
  ];
  
  const groupedDataColumns = [
    { key: 'Group ID', label: 'Group' },
    { key: 'Brand', label: 'Brand' },
    { key: 'Female Product', label: 'Female Product' },
    { key: 'Male Product', label: 'Male Product' },
    { key: 'Functionality of Active Ingredient in Female Products', label: 'Female Functionality' },
    { key: 'Functionality of Active Ingredient in Male Products', label: 'Male Functionality' },
    { key: 'Female Price', label: 'Female Price' },
    { key: 'Male Price', label: 'Male Price' },
    { key: 'Similarity Score', label: 'Similarity' }
  ];
  
  const resultDataColumns = [
    { key: 'Brand', label: 'Brand' },
    { key: 'Female Product', label: 'Female Product' },
    { key: 'Male Product', label: 'Male Product' },
    { key: 'Active Ingredient in Female Products', label: 'Female Active Ingredient' },
    { key: 'Active Ingredient in Male Products', label: 'Male Active Ingredient' },
    { key: 'Price of Female Products', label: 'Female Price' },
    { key: 'Price of Male Products', label: 'Male Price' },
    { key: 'Percent Price Difference', label: 'Price Difference' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white shadow-sm">
        <div className="container py-6 px-4">
          <h1 className="text-3xl font-semibold text-center bg-clip-text">Product Price Analysis Tool</h1>
          <p className="text-muted-foreground text-center mt-2">
            Analyze gender-based price differences in similar personal care products
          </p>
        </div>
      </header>
      
      <main className="container py-10 px-4 md:px-6">
        {/* Progress indicator */}
        <div className="w-full max-w-md mx-auto mb-12">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300 ${
                    step <= currentStep
                      ? 'border-primary bg-primary text-primary-foreground shadow-md'
                      : 'border border-border bg-background text-muted-foreground'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 flex justify-between text-xs">
            <span className="text-center" style={{ width: '25%', marginLeft: '-12.5%' }}>Upload</span>
            <span className="text-center" style={{ width: '25%', marginLeft: '-12.5%' }}>Analyze</span>
            <span className="text-center" style={{ width: '25%', marginLeft: '-12.5%' }}>Group</span>
            <span className="text-center" style={{ width: '25%', marginLeft: '-12.5%' }}>Compare</span>
          </div>
        </div>
        
        {/* Step 1: Upload & Preprocess Data */}
        <StepContainer 
          number={1} 
          title="Upload & Preprocess Data" 
          isActive={true}
          delay={0}
        >
          {!processedData.length ? (
            <FileUpload onDataUploaded={handleDataUploaded} />
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                Data has been uploaded and preprocessed. The following columns were removed: URL, Price Per Unit.
                Gender Neutral products were also filtered out.
              </p>
              <DataTable 
                data={processedData} 
                columns={rawDataColumns} 
                filename="preprocessed_data" 
              />
              <div className="flex justify-end mt-4">
                <Button onClick={() => setCurrentStep(2)}>Continue to Step 2</Button>
              </div>
            </>
          )}
        </StepContainer>
        
        {/* Step 2: Extract Active Ingredient Functionality */}
        <StepContainer 
          number={2} 
          title="Extract Active Ingredient Functionality" 
          isActive={currentStep >= 2}
          delay={1}
        >
          {!analyzedData.length ? (
            <IngredientAnalyzer 
              data={processedData} 
              onComplete={handleIngredientsAnalyzed} 
            />
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                Active ingredients have been analyzed and their primary functionality has been determined.
              </p>
              <DataTable 
                data={analyzedData} 
                columns={analyzedDataColumns} 
                filename="analyzed_ingredients" 
              />
              <div className="flex justify-end mt-4">
                <Button onClick={() => setCurrentStep(3)}>Continue to Step 3</Button>
              </div>
            </>
          )}
        </StepContainer>
        
        {/* Step 3: Grouping Similar Products */}
        <StepContainer 
          number={3} 
          title="Group Similar Products" 
          isActive={currentStep >= 3}
          delay={2}
        >
          {!groupedData.length ? (
            <ProductGrouper 
              productData={analyzedData} 
              onComplete={handleProductsGrouped} 
            />
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                Similar products have been grouped based on brand, active ingredient functionality, and inactive ingredients.
              </p>
              <DataTable 
                data={groupedData} 
                columns={groupedDataColumns} 
                filename="grouped_products" 
              />
              <div className="flex justify-end mt-4">
                <Button onClick={() => setCurrentStep(4)}>Continue to Step 4</Button>
              </div>
            </>
          )}
        </StepContainer>
        
        {/* Step 4: Compare Gender-Based Price Differences */}
        <StepContainer 
          number={4} 
          title="Compare Gender-Based Price Differences" 
          isActive={currentStep >= 4}
          delay={3}
        >
          {!resultData.length ? (
            <PriceDifferenceCalculator 
              data={groupedData} 
              onComplete={handlePriceDifferencesCalculated} 
            />
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                Price differences between similar men's and women's products have been calculated.
                Positive values indicate women's products cost more than men's products.
              </p>
              <DataTable 
                data={resultData} 
                columns={resultDataColumns} 
                filename="price_differences" 
              />
            </>
          )}
        </StepContainer>
      </main>
      
      <footer className="border-t py-6 mt-8">
        <div className="container text-center text-sm text-muted-foreground">
          Product Price Analysis Tool &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Index;
