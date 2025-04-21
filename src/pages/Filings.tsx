
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { 
  Plus,
  Pencil,
  Trash2, 
  FileClock,
  CheckCircle,
  AlertTriangle,
  FileDown
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCompany } from '@/context/CompanyContext';
import { FilingReport } from '@/types';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { generateFormText, generateAnnualReturn, generateDownloadableDocument } from '@/utils/documentGenerator';
import { Badge } from '@/components/ui/badge';

const filingSchema = z.object({
  name: z.string().min(2, { message: 'Filing name must be at least 2 characters.' }),
  formNumber: z.string().min(1, { message: 'Form number is required.' }),
  dueDate: z.string().min(1, { message: 'Due date is required.' }),
  filingDate: z.string().optional(),
  status: z.enum(['Pending', 'Filed', 'Delayed']),
});

const Filings = () => {
  const { companyState, addFiling, updateFiling, removeFiling } = useCompany();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFiling, setEditingFiling] = useState<FilingReport | null>(null);

  const form = useForm<z.infer<typeof filingSchema>>({
    resolver: zodResolver(filingSchema),
    defaultValues: {
      name: '',
      formNumber: '',
      dueDate: '',
      filingDate: '',
      status: 'Pending',
    },
  });

  const handleEdit = (filing: FilingReport) => {
    setEditingFiling(filing);
    form.reset({
      name: filing.name,
      formNumber: filing.formNumber,
      dueDate: filing.dueDate,
      filingDate: filing.filingDate || '',
      status: filing.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string | undefined) => {
    if (id) {
      removeFiling(id);
      toast.success('Filing removed successfully');
    }
  };

  const onSubmit = (data: z.infer<typeof filingSchema>) => {
    const filingData: FilingReport = {
      ...data,
      filingDate: data.filingDate || undefined,
    };
    
    if (editingFiling && editingFiling.id) {
      updateFiling(editingFiling.id, filingData);
      toast.success('Filing updated successfully');
    } else {
      addFiling(filingData);
      toast.success('Filing added successfully');
    }
    setIsDialogOpen(false);
    setEditingFiling(null);
    form.reset();
  };

  const onDialogOpenChange = (open: boolean) => {
    if (!open) {
      setEditingFiling(null);
      form.reset();
    }
    setIsDialogOpen(open);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
      case 'Filed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Filed</Badge>;
      case 'Delayed':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Delayed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleGenerateDocument = (filing: FilingReport) => {
    if (!companyState.companyDetails) {
      toast.error('Company profile is required to generate documents');
      return;
    }
    
    let content = '';
    let format = 'pdf';
    let fileName = '';
    
    if (filing.formNumber === 'MGT-7') {
      content = generateAnnualReturn(
        companyState.companyDetails, 
        companyState.directors, 
        companyState.members
      );
      fileName = `Annual_Return_${new Date().getFullYear()}.docx`;
      format = 'docx';
    } else {
      content = `
FORM ${filing.formNumber}
${filing.name}

Company Name: ${companyState.companyDetails.name}
CIN: ${companyState.companyDetails.cin}

This is a placeholder for the ${filing.formNumber} form content.
`;
      fileName = `${filing.formNumber}_${new Date().toISOString().split('T')[0]}.docx`;
      format = 'docx';
    }
    
    if (content) {
      // In a real application, this would generate actual files
      // For demo purposes, we'll just show a success message
      toast.success(`Form ${filing.formNumber} generated successfully`);
      
      // Simulate a document download
      const link = document.createElement('a');
      const file = new Blob([content], { type: 'text/plain' });
      link.href = URL.createObjectURL(file);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Filter filings by status
  const pendingFilings = companyState.filings.filter(f => f.status === 'Pending');
  const filedFilings = companyState.filings.filter(f => f.status === 'Filed');
  const delayedFilings = companyState.filings.filter(f => f.status === 'Delayed');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-corporate-800">ROC Filings</h1>
          <p className="text-gray-500">Manage regulatory filings and compliance requirements</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={onDialogOpenChange}>
          <DialogTrigger asChild>
            <Button className="bg-corporate-600 hover:bg-corporate-700">
              <Plus className="mr-2 h-4 w-4" /> Add Filing
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingFiling ? 'Edit Filing' : 'Add New Filing'}
              </DialogTitle>
              <DialogDescription>
                Enter the details for the regulatory filing.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="formNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Form Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., MGT-7, AOC-4" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Filing Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Annual Return" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Filed">Filed</SelectItem>
                            <SelectItem value="Delayed">Delayed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch('status') === 'Filed' && (
                    <FormField
                      control={form.control}
                      name="filingDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Filing Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-corporate-600 hover:bg-corporate-700">
                    {editingFiling ? 'Update Filing' : 'Add Filing'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <FileClock className="mr-2 h-5 w-5 text-amber-500" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pendingFilings.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              Filed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{filedFilings.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
              Delayed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{delayedFilings.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filing Information</CardTitle>
          <CardDescription>
            List of all regulatory filings with status tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          {companyState.filings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Form</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="hidden md:table-cell">Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companyState.filings.map((filing) => (
                  <TableRow key={filing.id}>
                    <TableCell className="font-medium">{filing.formNumber}</TableCell>
                    <TableCell>{filing.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(filing.dueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(filing.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(filing)}
                          title="Edit Filing"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleGenerateDocument(filing)}
                          title="Generate Form"
                          className="text-corporate-700"
                        >
                          <FileDown className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="icon" className="text-red-500" title="Delete Filing">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you sure you want to remove this filing?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the 
                                filing record from the system.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleDelete(filing.id)}
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-16 text-center">
              <FileClock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Filings Added</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-6">
                Add regulatory filings to track compliance deadlines and generate reports.
              </p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-corporate-600 hover:bg-corporate-700"
              >
                <Plus className="mr-2 h-4 w-4" /> Add First Filing
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Filings;
