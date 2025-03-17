
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Upload, FileSpreadsheet, AlertTriangle } from 'lucide-react';

interface FileUploadProps {
  onDataUploaded: (data: any[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const processFile = async (file: File) => {
    setIsProcessing(true);
    
    try {
      // Check file type
      if (!file.name.endsWith('.csv')) {
        toast.error('Only CSV files are supported');
        setIsProcessing(false);
        return;
      }
      
      const text = await file.text();
      const result = parseCSV(text);
      
      // Check if file has required columns with more flexible column name checking
      const requiredColumns = ['Brand', 'Product Name', 'Active Ingredient', 'Inactive Ingredients', 'Gender Classification'];
      // Special check for Price column which might have variations
      const priceColumnFound = Object.keys(result[0] || {}).some(
        col => col === 'Price' || col === 'Price (€)' || col.startsWith('Price')
      );
      
      if (!priceColumnFound) {
        requiredColumns.push('Price'); // Add price to missing columns if not found
      }
      
      const fileColumns = Object.keys(result[0] || {});
      const missingColumns = requiredColumns.filter(col => {
        // For regular columns, check exact match
        if (col !== 'Price') {
          return !fileColumns.includes(col);
        }
        // Price is already checked above
        return false;
      });
      
      if (missingColumns.length > 0) {
        toast.error(`Missing required columns: ${missingColumns.join(', ')}`);
        setIsProcessing(false);
        return;
      }
      
      // Normalize the data - make sure price column is consistently named "Price"
      const normalizedData = result.map(row => {
        const newRow = { ...row };
        // Check for price column variations and normalize to "Price"
        for (const key of Object.keys(newRow)) {
          if (key === 'Price (€)' || (key.startsWith('Price') && key !== 'Price')) {
            newRow.Price = newRow[key];
            delete newRow[key];
          }
        }
        return newRow;
      });
      
      toast.success(`Successfully processed ${normalizedData.length} rows of data`);
      onDataUploaded(normalizedData);
    } catch (error) {
      console.error(error);
      toast.error('Error processing file. Please check the format.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  // Simple CSV parser
  const parseCSV = (text: string) => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1)
      .filter(line => line.trim().length > 0)
      .map(line => {
        const values = line.split(',');
        const obj: Record<string, string> = {};
        
        headers.forEach((header, i) => {
          obj[header] = values[i]?.trim() || '';
        });
        
        return obj;
      });
  };
  
  return (
    <div 
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center transition-colors animate-fade-in",
        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20",
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        className="hidden" 
        accept=".csv" 
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      
      <div className="flex flex-col items-center justify-center py-4">
        <div className="mb-4 rounded-full bg-primary/10 p-3">
          <FileSpreadsheet className="h-6 w-6 text-primary" />
        </div>
        <h3 className="mb-2 text-lg font-medium">Upload Products CSV</h3>
        <p className="mb-4 text-sm text-muted-foreground max-w-md">
          Drag and drop your CSV file here, or click the button below to upload
        </p>
        
        <div className="flex flex-col gap-2 items-center">
          <Button 
            onClick={handleButtonClick} 
            disabled={isProcessing}
            className="relative overflow-hidden transition-all hover:pl-12"
          >
            <span className={cn(
              "absolute left-0 top-0 bottom-0 flex items-center justify-center transition-all duration-300 ease-out",
              "w-9 bg-primary-foreground/20",
              "transform opacity-0 -translate-x-full",
              "group-hover:opacity-100 group-hover:translate-x-0"
            )}>
              <Upload className="h-4 w-4" />
            </span>
            <span>Select CSV File</span>
          </Button>
          
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
            <AlertTriangle className="h-3 w-3" />
            <span>File must contain: Brand, Product Name, Price, Ingredients, Gender</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
