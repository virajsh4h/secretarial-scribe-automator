
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// Define the Zod schema for company form validation
const companySchema = z.object({
  cin: z
    .string()
    .length(21, 'CIN must be exactly 21 characters')
    .regex(/^U[A-Z0-9]{20}$/, 'Must start with U and contain only uppercase letters and digits'),
  name: z
    .string()
    .min(1, 'Name is required'),
  incorporationDate: z
    .string()
    .refine(val => !isNaN(new Date(val)), 'Invalid date'),
  website: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
});

// Create type based on the schema
type CompanyFormValues = z.infer<typeof companySchema>;

const CompanyDetailsForm = () => {
  // State for file upload
  const [coiFile, setCoiFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      cin: '',
      incorporationDate: '',
      website: '',
    },
    mode: 'onChange', // Validate on change for better UX
  });

  // Handle file validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFileError(null);
    
    if (!selectedFile) {
      setCoiFile(null);
      return;
    }

    // Check file type
    if (selectedFile.type !== 'application/pdf') {
      setFileError('Only PDF files are accepted');
      setCoiFile(null);
      return;
    }

    // Check file size (2MB = 2 * 1024 * 1024 bytes)
    if (selectedFile.size > 2 * 1024 * 1024) {
      setFileError('File size must be less than 2MB');
      setCoiFile(null);
      return;
    }

    setCoiFile(selectedFile);
  };

  // Remove selected file
  const removeFile = () => {
    setCoiFile(null);
    setFileError(null);
  };

  const onSubmit = (data: CompanyFormValues) => {
    // Validate required file
    if (!coiFile) {
      setFileError('Certificate of Incorporation is required');
      return;
    }

    // Create FormData for file upload and other fields
    const formData = new FormData();
    formData.append('coi', coiFile);
    
    // Append all form values to FormData
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    
    // Show success toast
    toast.success('Company details saved successfully!');
    
    // Console log FormData for debugging purposes
    console.log('Form data to be sent:', data);
    console.log('File to be uploaded:', coiFile);
  };

  const isFormValid = form.formState.isValid && !fileError && coiFile !== null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Company Details</h1>
        <p className="text-gray-500">Enter your company's registration information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Registration Information</CardTitle>
          <CardDescription>
            Enter the basic details of your company as per incorporation documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="ABC Private Limited" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CIN (Corporate Identity Number)</FormLabel>
                      <FormControl>
                        <Input placeholder="U12345MH2020PTC123456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="incorporationDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Incorporation</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://www.example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Certificate of Incorporation File Upload */}
              <div className="space-y-2">
                <FormLabel htmlFor="coi">Certificate of Incorporation</FormLabel>
                <div className="flex items-center gap-2">
                  <Input 
                    id="coi" 
                    type="file" 
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                  {coiFile && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={removeFile}
                      className="h-10 w-10 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {coiFile && (
                  <p className="text-sm text-muted-foreground">
                    {coiFile.name} ({(coiFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                )}
                {fileError && (
                  <p className="text-sm font-medium text-destructive">{fileError}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90"
                disabled={!isFormValid}
              >
                Save Company Details
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyDetailsForm;

// Simple test for CIN validation:
/* 
import { render, screen, fireEvent } from '@testing-library/react';
import CompanyDetailsForm from './CompanyDetailsForm';

test('CIN field rejects too-short strings', async () => {
  render(<CompanyDetailsForm />);
  
  // Find the CIN input field
  const cinInput = screen.getByLabelText(/CIN/i);
  
  // Type an invalid CIN (too short)
  fireEvent.change(cinInput, { target: { value: 'U12345' } });
  
  // Trigger validation
  fireEvent.blur(cinInput);
  
  // Check for error message
  expect(await screen.findByText(/CIN must be exactly 21 characters/i)).toBeInTheDocument();
});
*/
