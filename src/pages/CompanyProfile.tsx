
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
import { useCompany } from '@/context/CompanyContext';
import { CompanyDetails } from '@/types';

// Create schema for company form validation
const companySchema = z.object({
  // Corporate Identification Number - must be 21 chars, start with U and contain only uppercase letters and digits
  cin: z.string()
    .length(21, { message: 'CIN must be 21 characters.' })
    .regex(/^U[A-Z0-9]{20}$/, { 
      message: 'CIN must start with U and contain only uppercase letters and digits.' 
    }),
  
  // Company name - required
  name: z.string().min(1, { message: 'Company name is required.' }),
  
  // Date of incorporation - required and must be a valid date
  registrationDate: z.string()
    .refine(val => !isNaN(new Date(val).getTime()), { 
      message: "Invalid date" 
    }),
  
  // Registered address - required with minimum length
  registeredAddress: z.string().min(5, { message: 'Address must be at least 5 characters.' }),
  
  // Financial year end - required
  financialYearEnd: z.string().min(1, { message: 'Financial year end date is required.' }),
  
  // Authorized capital - must be a positive number
  authorizedCapital: z.coerce.number().min(1, { message: 'Authorized capital must be greater than 0.' }),
  
  // Paid-up capital - must be a positive number
  paidUpCapital: z.coerce.number().min(1, { message: 'Paid-up capital must be greater than 0.' }),
  
  // Email - must be valid email format
  email: z.string().email({ message: 'Invalid email address.' }),
  
  // Phone - basic validation for length
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits.' }),
  
  // Website - optional but must be valid URL if provided
  website: z.string().url({ message: 'Invalid website URL.' }).optional().or(z.literal('')),
});

// Create type based on the schema
type CompanyFormValues = z.infer<typeof companySchema>;

const CompanyProfile = () => {
  const { companyState, setCompanyDetails } = useCompany();
  const existingData = companyState.companyDetails || {} as CompanyDetails;

  // State for file upload
  const [coiFile, setCoiFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: existingData.name || '',
      cin: existingData.cin || '',
      registrationDate: existingData.registrationDate || '',
      registeredAddress: existingData.registeredAddress || '',
      authorizedCapital: existingData.authorizedCapital || 0,
      paidUpCapital: existingData.paidUpCapital || 0,
      email: existingData.email || '',
      phone: existingData.phone || '',
      website: existingData.website || '',
      financialYearEnd: existingData.financialYearEnd || '',
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
    
    // For demonstration, we'll still use the context to save the form data
    // In a real app, you would send formData to your API
    const companyData: CompanyDetails = {
      name: data.name,
      cin: data.cin,
      registrationDate: data.registrationDate,
      registeredAddress: data.registeredAddress,
      authorizedCapital: data.authorizedCapital,
      paidUpCapital: data.paidUpCapital,
      email: data.email,
      phone: data.phone,
      website: data.website || undefined,
      financialYearEnd: data.financialYearEnd,
    };
    
    // Save to context
    setCompanyDetails(companyData);
    
    // Show success toast
    toast.success('Company details saved successfully!');
    
    // Console log FormData for debugging purposes
    console.log('Form data to be sent:', formData);
    console.log('File to be uploaded:', coiFile);
  };

  const isFormValid = form.formState.isValid && !fileError && coiFile !== null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-corporate-800">Company Profile</h1>
        <p className="text-gray-500">Manage your company's basic information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Details</CardTitle>
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
                  name="registrationDate"
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
                  name="financialYearEnd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Financial Year End</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="authorizedCapital"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Authorized Capital (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paidUpCapital"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paid-up Capital (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="registeredAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registered Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Complete address as per incorporation documents" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="company@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+91 9876543210" {...field} />
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
                className="bg-corporate-600 hover:bg-corporate-700"
                disabled={!isFormValid}
              >
                Save Company Profile
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyProfile;

// Simple test for CIN validation:
/*
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CompanyProfile from './CompanyProfile';

test('CIN field rejects too-short strings', async () => {
  render(<CompanyProfile />);
  
  // Find the CIN input field
  const cinInput = screen.getByLabelText(/CIN/i);
  
  // Type an invalid CIN (too short)
  await userEvent.type(cinInput, 'U12345');
  
  // Trigger validation by clicking outside
  await userEvent.tab();
  
  // Check for error message
  expect(screen.getByText(/CIN must be 21 characters/i)).toBeInTheDocument();
});
*/
