
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';

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

const companySchema = z.object({
  name: z.string().min(2, { message: 'Company name must be at least 2 characters.' }),
  cin: z.string().min(21, { message: 'CIN must be 21 characters.' }).max(21),
  registrationDate: z.string().min(1, { message: 'Registration date is required.' }),
  registeredAddress: z.string().min(5, { message: 'Address must be at least 5 characters.' }),
  authorizedCapital: z.coerce.number().min(1, { message: 'Authorized capital must be greater than 0.' }),
  paidUpCapital: z.coerce.number().min(1, { message: 'Paid-up capital must be greater than 0.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits.' }),
  website: z.string().url({ message: 'Invalid website URL.' }).optional().or(z.literal('')),
  financialYearEnd: z.string().min(1, { message: 'Financial year end date is required.' }),
});

const CompanyProfile = () => {
  const { companyState, setCompanyDetails } = useCompany();
  const existingData = companyState.companyDetails || {} as CompanyDetails;

  const form = useForm<z.infer<typeof companySchema>>({
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
  });

  const onSubmit = (data: z.infer<typeof companySchema>) => {
    setCompanyDetails(data);
    toast.success('Company profile saved successfully');
  };

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

              <Button type="submit" className="bg-corporate-600 hover:bg-corporate-700">
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
