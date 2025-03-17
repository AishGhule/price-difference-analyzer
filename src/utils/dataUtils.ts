
/**
 * Compare two products based on their ingredients and properties
 * @param product1 - First product to compare
 * @param product2 - Second product to compare 
 * @returns Similarity score between 0 and 1
 */
export const compareProducts = (product1: any, product2: any): number => {
  // If products have different brands, they are not comparable
  if (product1.Brand !== product2.Brand) {
    return 0;
  }
  
  // If they have same functionality for active ingredients
  const functionalitySimilarity = product1['Functionality of Active Ingredient'] === 
    product2['Functionality of Active Ingredient'] ? 0.5 : 0;
  
  // Get inactive ingredients as arrays (if they exist)
  const ingredients1 = product1['Inactive Ingredients'] ? 
    product1['Inactive Ingredients'].split(',').map((i: string) => i.trim().toLowerCase()) : [];
  const ingredients2 = product2['Inactive Ingredients'] ? 
    product2['Inactive Ingredients'].split(',').map((i: string) => i.trim().toLowerCase()) : [];
  
  // Calculate Jaccard similarity for inactive ingredients
  let ingredientSimilarity = 0;
  if (ingredients1.length > 0 && ingredients2.length > 0) {
    const intersection = ingredients1.filter(i => ingredients2.includes(i)).length;
    const union = new Set([...ingredients1, ...ingredients2]).size;
    ingredientSimilarity = union > 0 ? intersection / union * 0.5 : 0;
  }
  
  return functionalitySimilarity + ingredientSimilarity;
};

/**
 * Group products by gender and find pairs
 * @param data - Array of product data with gender classification
 * @returns Array of grouped products
 */
export const groupSimilarProducts = async (data: any[]): Promise<any[]> => {
  // Separate products by gender
  const femaleProducts = data.filter(p => p['Gender Classification'] === 'Female');
  const maleProducts = data.filter(p => p['Gender Classification'] === 'Male');
  
  const groups: any[] = [];
  let groupId = 1;
  
  // Compare each female product with each male product
  femaleProducts.forEach(femaleProduct => {
    maleProducts.forEach(maleProduct => {
      const similarityScore = compareProducts(femaleProduct, maleProduct);
      
      // Only group products if they have some similarity
      if (similarityScore > 0.3) {
        groups.push({
          'Group ID': groupId,
          'Brand': femaleProduct.Brand,
          'Female Product': femaleProduct['Product Name'],
          'Male Product': maleProduct['Product Name'],
          'Functionality of Active Ingredient in Female Products': femaleProduct['Functionality of Active Ingredient'],
          'Functionality of Active Ingredient in Male Products': maleProduct['Functionality of Active Ingredient'],
          'Female Price': femaleProduct.Price,
          'Male Price': maleProduct.Price,
          'Similarity Score': Number((similarityScore * 100).toFixed(1))
        });
        groupId++;
      }
    });
  });
  
  return groups;
};

/**
 * Calculate price differences between gendered products
 * @param groups - Array of grouped products
 * @returns Array with price difference data
 */
export const calculatePriceDifferences = (groups: any[]): any[] => {
  return groups.map(group => {
    const femalePricefemalePrice = parseFloat(group['Female Price']);
    const malePricemalePrice = parseFloat(group['Male Price']);
    const priceDifference = ((femalePricefemalePrice - malePricemalePrice) / malePricemalePrice) * 100;
    
    return {
      'Brand': group.Brand,
      'Female Product': group['Female Product'],
      'Male Product': group['Male Product'],
      'Active Ingredient in Female Products': group['Functionality of Active Ingredient in Female Products'],
      'Active Ingredient in Male Products': group['Functionality of Active Ingredient in Male Products'],
      'Price of Female Products': group['Female Price'],
      'Price of Male Products': group['Male Price'],
      'Percent Price Difference': `${priceDifference.toFixed(2)}%`
    };
  });
};
