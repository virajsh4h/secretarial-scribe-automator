
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { 
  Plus,
  Pencil,
  Trash2, 
  Users
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
import { Member } from '@/types';
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

const memberSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  folioNumber: z.string().min(1, { message: 'Folio number is required.' }),
  pan: z.string().min(10, { message: 'PAN must be 10 characters.' }).max(10),
  address: z.string().min(5, { message: 'Address must be at least 5 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits.' }),
  numberOfShares: z.coerce.number().min(1, { message: 'Number of shares must be at least 1.' }),
  percentageHolding: z.coerce.number().min(0, { message: 'Percentage must be between 0 and 100.' }).max(100),
});

const Members = () => {
  const { companyState, addMember, updateMember, removeMember } = useCompany();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const form = useForm<z.infer<typeof memberSchema>>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: '',
      folioNumber: '',
      pan: '',
      address: '',
      email: '',
      phone: '',
      numberOfShares: 0,
      percentageHolding: 0,
    },
  });

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    form.reset({
      name: member.name,
      folioNumber: member.folioNumber,
      pan: member.pan,
      address: member.address,
      email: member.email,
      phone: member.phone,
      numberOfShares: member.numberOfShares,
      percentageHolding: member.percentageHolding,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string | undefined) => {
    if (id) {
      removeMember(id);
      toast.success('Member removed successfully');
    }
  };

  const onSubmit = (data: z.infer<typeof memberSchema>) => {
    // Ensure all required fields are present
    const memberData: Member = {
      name: data.name,
      folioNumber: data.folioNumber,
      pan: data.pan,
      address: data.address,
      email: data.email,
      phone: data.phone,
      numberOfShares: data.numberOfShares,
      percentageHolding: data.percentageHolding,
    };
    
    if (editingMember && editingMember.id) {
      updateMember(editingMember.id, memberData);
      toast.success('Member updated successfully');
    } else {
      addMember(memberData);
      toast.success('Member added successfully');
    }
    setIsDialogOpen(false);
    setEditingMember(null);
    form.reset();
  };

  const onDialogOpenChange = (open: boolean) => {
    if (!open) {
      setEditingMember(null);
      form.reset();
    }
    setIsDialogOpen(open);
  };

  const totalShares = companyState.members.reduce((sum, member) => sum + member.numberOfShares, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-corporate-800">Members</h1>
          <p className="text-gray-500">Manage your company's shareholders</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={onDialogOpenChange}>
          <DialogTrigger asChild>
            <Button className="bg-corporate-600 hover:bg-corporate-700">
              <Plus className="mr-2 h-4 w-4" /> Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingMember ? 'Edit Member' : 'Add New Member'}
              </DialogTitle>
              <DialogDescription>
                Enter the member's details as per share register.
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
                    name="folioNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Folio Number</FormLabel>
                        <FormControl>
                          <Input placeholder="001" {...field} />
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
                    name="address"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Complete address as per records" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="numberOfShares"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Shares</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="percentageHolding"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Percentage Holding (%)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
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
                    {editingMember ? 'Update Member' : 'Add Member'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Member Information</CardTitle>
          <CardDescription>
            List of all shareholders of the company along with their key details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {companyState.members.length > 0 ? (
            <>
              <div className="mb-6 p-4 bg-corporate-50 rounded-lg">
                <p className="text-gray-600">
                  <span className="font-medium">Total Members:</span> {companyState.members.length}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Total Shares:</span> {totalShares.toLocaleString()}
                </p>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Folio No.</TableHead>
                    <TableHead className="hidden md:table-cell">Shares</TableHead>
                    <TableHead className="hidden md:table-cell">Holding %</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companyState.members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.folioNumber}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {member.numberOfShares.toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {member.percentageHolding.toFixed(2)}%
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{member.email}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(member)}
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
                                  Are you sure you want to remove this member?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the 
                                  member and remove their data from the system.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => handleDelete(member.id)}
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
            </>
          ) : (
            <div className="py-16 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Members Added</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-6">
                Add shareholders to your company to manage their information and generate compliant documents.
              </p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-corporate-600 hover:bg-corporate-700"
              >
                <Plus className="mr-2 h-4 w-4" /> Add First Member
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Members;
