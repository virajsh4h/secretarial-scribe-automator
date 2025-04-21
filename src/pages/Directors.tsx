
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { 
  Plus,
  Pencil,
  Trash2, 
  UserPlus
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

import { useCompany } from '@/context/CompanyContext';
import { Director } from '@/types';
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

const directorSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  din: z.string().min(8, { message: 'DIN must be 8 characters.' }).max(8),
  pan: z.string().min(10, { message: 'PAN must be 10 characters.' }).max(10),
  dateOfBirth: z.string().min(1, { message: 'Date of birth is required.' }),
  dateOfAppointment: z.string().min(1, { message: 'Date of appointment is required.' }),
  residentialAddress: z.string().min(5, { message: 'Address must be at least 5 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits.' }),
  designation: z.string().min(2, { message: 'Designation is required.' }),
});

const Directors = () => {
  const { companyState, addDirector, updateDirector, removeDirector } = useCompany();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDirector, setEditingDirector] = useState<Director | null>(null);

  const form = useForm<z.infer<typeof directorSchema>>({
    resolver: zodResolver(directorSchema),
    defaultValues: {
      name: '',
      din: '',
      pan: '',
      dateOfBirth: '',
      dateOfAppointment: '',
      residentialAddress: '',
      email: '',
      phone: '',
      designation: '',
    },
  });

  const handleEdit = (director: Director) => {
    setEditingDirector(director);
    form.reset({
      name: director.name,
      din: director.din,
      pan: director.pan,
      dateOfBirth: director.dateOfBirth,
      dateOfAppointment: director.dateOfAppointment,
      residentialAddress: director.residentialAddress,
      email: director.email,
      phone: director.phone,
      designation: director.designation,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string | undefined) => {
    if (id) {
      removeDirector(id);
      toast.success('Director removed successfully');
    }
  };

  const onSubmit = (data: z.infer<typeof directorSchema>) => {
    // Ensure all required fields are present
    const directorData: Director = {
      name: data.name,
      din: data.din,
      pan: data.pan,
      dateOfBirth: data.dateOfBirth,
      dateOfAppointment: data.dateOfAppointment,
      residentialAddress: data.residentialAddress,
      email: data.email,
      phone: data.phone,
      designation: data.designation,
    };
    
    if (editingDirector && editingDirector.id) {
      updateDirector(editingDirector.id, directorData);
      toast.success('Director updated successfully');
    } else {
      addDirector(directorData);
      toast.success('Director added successfully');
    }
    setIsDialogOpen(false);
    setEditingDirector(null);
    form.reset();
  };

  const onDialogOpenChange = (open: boolean) => {
    if (!open) {
      setEditingDirector(null);
      form.reset();
    }
    setIsDialogOpen(open);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-corporate-800">Directors</h1>
          <p className="text-gray-500">Manage your company's directors</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={onDialogOpenChange}>
          <DialogTrigger asChild>
            <Button className="bg-corporate-600 hover:bg-corporate-700">
              <Plus className="mr-2 h-4 w-4" /> Add Director
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingDirector ? 'Edit Director' : 'Add New Director'}
              </DialogTitle>
              <DialogDescription>
                Enter the director's details as per official records.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="designation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Designation</FormLabel>
                        <FormControl>
                          <Input placeholder="Director" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="din"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>DIN (Director Identification Number)</FormLabel>
                        <FormControl>
                          <Input placeholder="12345678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PAN</FormLabel>
                        <FormControl>
                          <Input placeholder="ABCDE1234F" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateOfAppointment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Appointment</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
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
                    name="residentialAddress"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Residential Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Complete residential address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-corporate-600 hover:bg-corporate-700">
                    {editingDirector ? 'Update Director' : 'Add Director'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Director Information</CardTitle>
          <CardDescription>
            List of all directors of the company along with their key details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {companyState.directors.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>DIN</TableHead>
                  <TableHead className="hidden md:table-cell">Designation</TableHead>
                  <TableHead className="hidden md:table-cell">Appointment Date</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companyState.directors.map((director) => (
                  <TableRow key={director.id}>
                    <TableCell className="font-medium">{director.name}</TableCell>
                    <TableCell>{director.din}</TableCell>
                    <TableCell className="hidden md:table-cell">{director.designation}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(director.dateOfAppointment).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{director.email}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(director)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="icon" className="text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you sure you want to remove this director?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the 
                                director and remove their data from the system.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleDelete(director.id)}
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
              <UserPlus className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Directors Added</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-6">
                Add directors to your company to manage their information and generate compliant documents.
              </p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-corporate-600 hover:bg-corporate-700"
              >
                <Plus className="mr-2 h-4 w-4" /> Add First Director
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Directors;
