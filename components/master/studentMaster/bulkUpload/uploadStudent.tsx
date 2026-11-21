'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { FileSymlink, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { ScrollArea } from '@/components/ui/scroll-area';

// Type Definitions
interface StudentData {
  [key: string]: string | number | boolean | null; // Adjust the fields as per your actual data structure
}

interface UploadError {
  error?: string;
  details?: Record<string, unknown>;
}

interface UploadDetails {
  successful: number;
  failed: number;
  details?: {
    successful?: number[];
    failed?: Array<{
      index: number;
      errors: Array<{ message: string; path?: string[] }>;
    }>;
  };
}

interface StudentUploadProps {
  onUploadSuccess?: (data: StudentData[]) => void;
  onUploadError?: (error: string) => void;
}

export const StudentBulkUpload: React.FC<StudentUploadProps> = ({ 
  onUploadSuccess, 
  onUploadError 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<UploadError | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadDetails, setUploadDetails] = useState<UploadDetails | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      if (!['xlsx', 'xls', 'csv'].includes(fileExtension || '')) {
        const errorMessage = 'Please upload a valid Excel file (.xlsx, .xls, .csv)';
        setUploadError({ error: errorMessage });
        toast.error(errorMessage);
        return;
      }
      setFile(selectedFile);
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      const errorMessage = 'Please select a file first';
      setUploadError({ error: errorMessage });
      toast.error(errorMessage);
      return;
    }

    setUploadStatus('uploading');
    setUploadError(null);

    try {
      // Read the Excel file
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Assume first sheet
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // Remove header row and convert to objects
          const headers = jsonData[0] as string[];
          const studentsData: StudentData[] = (jsonData.slice(1) as string[][]).map(row => 
            Object.fromEntries(headers.map((header, index) => [header, row[index]]))
          );

          // Send to backend
          const response = await fetch('/api/students/bulk-upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(studentsData),
          });

          // Parse the response
          const responseData = await response.json() as UploadDetails & { error?: string };

          if (!response.ok) {
            // Set detailed error information
            const errorDetails = responseData.details ? { ...responseData.details } : undefined;
            setUploadError({ error: responseData.error || 'Bulk upload failed', details: errorDetails });
            setUploadStatus('error');
            
            // Show error toast
            toast.error(responseData.error || 'Bulk upload failed', {
              description: errorDetails ? JSON.stringify(errorDetails) : undefined,
            });

            return;
          }

          // Success handling
          setUploadStatus('success');
          setUploadDetails(responseData);
          
          // Show success toast
          toast.success('Students uploaded successfully!', {
            description: `${responseData.successful} students imported, ${responseData.failed} failed`,
          });
          
          // Call onUploadSuccess with the processed data
          onUploadSuccess?.(studentsData);
        } catch (error) {
          handleUploadError(error);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      handleUploadError(error);
    }
  };

  const handleUploadError = (error: unknown) => {
    setUploadStatus('error');
    const errorMessage = error instanceof Error ? error.message : 'Upload failed';
    setUploadError({ error: errorMessage });
    
    // Show error toast
    toast.error('Upload Failed', {
      description: errorMessage,
    });

    // Call error callback if provided
    onUploadError?.(errorMessage);
  };

  return (
    <Card className="w-full bg-custom-pink-50 ">
      <CardHeader>
        <CardTitle className="flex items-center text-custom-red-600 ">
          <FileSymlink className="mr-2 " /> Bulk Student Upload
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input 
            type="file" 
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="w-full"
          />
          
          <Button 
            onClick={handleUpload} 
            disabled={!file || uploadStatus === 'uploading'}
            className="w-full bg-custom-pink-300 hover:bg-custom-red-600"
          >
            {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload Students'}
          </Button>

          {uploadError && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle>Error: {uploadError.error || 'Upload Failed'}</AlertTitle>
              <AlertDescription>
                {uploadError.details ? (
                  <ScrollArea className="h-40 w-full rounded-md border p-2">
                    <pre className="text-xs">{JSON.stringify(uploadError.details, null, 2)}</pre>
                  </ScrollArea>
                ) : (
                  'An error occurred during the upload process.'
                )}
              </AlertDescription>
            </Alert>
          )}

          {uploadStatus === 'success' && uploadDetails && (
            <Alert variant="default" className="mt-2">
              <AlertTitle>Upload Summary</AlertTitle>
              <AlertDescription>
                <p>Successful Uploads: {uploadDetails.successful}</p>
                <p>Failed Uploads: {uploadDetails.failed}</p>
                {uploadDetails.failed > 0 && (
                  <ScrollArea className="h-40 w-full rounded-md border p-2 mt-2">
                    <pre className="text-xs">{JSON.stringify(uploadDetails.details?.failed, null, 2)}</pre>
                  </ScrollArea>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
