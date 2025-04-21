
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { 
  Plus,
  Pencil,
  Trash2, 
  FileDown,
  Calendar,
  FileText
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
import { MeetingDocument } from '@/types';
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
import { Textarea } from '@/components/ui/textarea';
import { generateBoardMeetingNotice, generateBoardMeetingMinutes, generateAGMNotice, generateDownloadableDocument } from '@/utils/documentGenerator';

const meetingSchema = z.object({
  type: z.enum(['Board', 'General']),
  subType: z.enum(['AGM', 'EGM', 'Regular', 'Committee']),
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
  date: z.string().min(1, { message: 'Date is required.' }),
  time: z.string().min(1, { message: 'Time is required.' }),
  venue: z.string().min(5, { message: 'Venue must be at least 5 characters.' }),
  agenda: z.string().min(5, { message: 'Agenda is required.' }),
});

const Meetings = () => {
  const { companyState, addMeeting, updateMeeting, removeMeeting } = useCompany();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<MeetingDocument | null>(null);

  const form = useForm<z.infer<typeof meetingSchema>>({
    resolver: zodResolver(meetingSchema),
    defaultValues: {
      type: 'Board',
      subType: 'Regular',
      title: '',
      date: '',
      time: '',
      venue: '',
      agenda: '',
    },
  });

  const meetingType = form.watch('type');

  const handleEdit = (meeting: MeetingDocument) => {
    setEditingMeeting(meeting);
    form.reset({
      type: meeting.type,
      subType: meeting.subType as any || 'Regular',
      title: meeting.title,
      date: meeting.date,
      time: meeting.time,
      venue: meeting.venue,
      agenda: meeting.agenda.join('\n'),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string | undefined) => {
    if (id) {
      removeMeeting(id);
      toast.success('Meeting removed successfully');
    }
  };

  const onSubmit = (data: z.infer<typeof meetingSchema>) => {
    const agendaItems = data.agenda.split('\n').filter(item => item.trim() !== '');
    
    const meetingData: MeetingDocument = {
      type: data.type,
      subType: data.subType,
      title: data.title,
      date: data.date,
      time: data.time,
      venue: data.venue,
      agenda: agendaItems,
    };
    
    if (editingMeeting && editingMeeting.id) {
      updateMeeting(editingMeeting.id, meetingData);
      toast.success('Meeting updated successfully');
    } else {
      addMeeting(meetingData);
      toast.success('Meeting added successfully');
    }
    setIsDialogOpen(false);
    setEditingMeeting(null);
    form.reset();
  };

  const onDialogOpenChange = (open: boolean) => {
    if (!open) {
      setEditingMeeting(null);
      form.reset();
    }
    setIsDialogOpen(open);
  };

  const handleGenerateDocument = (meeting: MeetingDocument, documentType: string) => {
    if (!companyState.companyDetails) {
      toast.error('Company profile is required to generate documents');
      return;
    }
    
    let content = '';
    let format = 'pdf';
    let fileName = '';
    
    switch (documentType) {
      case 'notice':
        if (meeting.type === 'Board') {
          content = generateBoardMeetingNotice(companyState.companyDetails, meeting);
          fileName = `${meeting.type}_Meeting_Notice_${new Date(meeting.date).toISOString().split('T')[0]}.docx`;
          format = 'docx';
        } else if (meeting.subType === 'AGM') {
          content = generateAGMNotice(companyState.companyDetails, meeting);
          fileName = `AGM_Notice_${new Date(meeting.date).toISOString().split('T')[0]}.docx`;
          format = 'docx';
        }
        break;
      case 'minutes':
        if (meeting.type === 'Board') {
          content = generateBoardMeetingMinutes(companyState.companyDetails, meeting, companyState.directors);
          fileName = `${meeting.type}_Meeting_Minutes_${new Date(meeting.date).toISOString().split('T')[0]}.docx`;
          format = 'docx';
        }
        break;
      default:
        break;
    }
    
    if (content) {
      // In a real application, this would generate actual files
      // For demo purposes, we'll just show a success message
      toast.success(`${documentType.charAt(0).toUpperCase() + documentType.slice(1)} generated successfully`);
      
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-corporate-800">Meetings</h1>
          <p className="text-gray-500">Manage board and general meetings</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={onDialogOpenChange}>
          <DialogTrigger asChild>
            <Button className="bg-corporate-600 hover:bg-corporate-700">
              <Plus className="mr-2 h-4 w-4" /> Add Meeting
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingMeeting ? 'Edit Meeting' : 'Add New Meeting'}
              </DialogTitle>
              <DialogDescription>
                Enter the meeting details to create notices and minutes.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meeting Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Board">Board Meeting</SelectItem>
                            <SelectItem value="General">General Meeting</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meeting Sub-Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select sub-type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {meetingType === 'Board' ? (
                              <>
                                <SelectItem value="Regular">Regular</SelectItem>
                                <SelectItem value="Committee">Committee</SelectItem>
                              </>
                            ) : (
                              <>
                                <SelectItem value="AGM">Annual General Meeting</SelectItem>
                                <SelectItem value="EGM">Extraordinary General Meeting</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Meeting Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Board Meeting to approve financial statements" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="venue"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Venue</FormLabel>
                        <FormControl>
                          <Input placeholder="Complete address of the meeting venue" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="agenda"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Agenda Items (one per line)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter agenda items, one per line" 
                            className="min-h-[120px]"
                            {...field} 
                          />
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
                    {editingMeeting ? 'Update Meeting' : 'Add Meeting'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meeting Information</CardTitle>
          <CardDescription>
            List of all meetings with options to generate notices and minutes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {companyState.meetings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="hidden md:table-cell">Date & Time</TableHead>
                  <TableHead className="hidden md:table-cell">Venue</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companyState.meetings.map((meeting) => (
                  <TableRow key={meeting.id}>
                    <TableCell className="font-medium">{meeting.title}</TableCell>
                    <TableCell>
                      {meeting.type} {meeting.subType ? `(${meeting.subType})` : ''}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(meeting.date).toLocaleDateString()} at {meeting.time}
                    </TableCell>
                    <TableCell className="hidden md:table-cell truncate max-w-[200px]">
                      {meeting.venue}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(meeting)}
                          title="Edit Meeting"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleGenerateDocument(meeting, 'notice')}
                          title="Generate Notice"
                          className="text-corporate-700"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleGenerateDocument(meeting, 'minutes')}
                          title="Generate Minutes"
                          className="text-corporate-700"
                        >
                          <FileDown className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="icon" className="text-red-500" title="Delete Meeting">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you sure you want to remove this meeting?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the 
                                meeting and any generated documents.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleDelete(meeting.id)}
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
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Meetings Scheduled</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-6">
                Add board or general meetings to generate notices, minutes, and other compliance documents.
              </p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-corporate-600 hover:bg-corporate-700"
              >
                <Plus className="mr-2 h-4 w-4" /> Schedule First Meeting
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Meetings;
