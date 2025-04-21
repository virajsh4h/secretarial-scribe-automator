
import React, { useState } from 'react';
import { toast } from 'sonner';
import { 
  FileText,
  CalendarDays,
  UserCircle,
  FileDown,
  FileType,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCompany } from '@/context/CompanyContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  generateBoardMeetingNotice, 
  generateAnnualReturn, 
  generateAGMNotice, 
  generateBoardMeetingMinutes, 
  generateDownloadableDocument 
} from '@/utils/documentGenerator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';

const GenerateDocuments = () => {
  const { companyState } = useCompany();
  const navigate = useNavigate();
  const [selectedMeeting, setSelectedMeeting] = useState<string>("");
  const [selectedFormat, setSelectedFormat] = useState<"pdf" | "docx">("docx");
  
  const hasMeetings = companyState.meetings.length > 0;
  const hasDirectors = companyState.directors.length > 0;
  const hasMembers = companyState.members.length > 0;
  const hasFilings = companyState.filings.length > 0;
  
  const generateMeetingDocument = (documentType: string) => {
    if (!companyState.companyDetails) {
      toast.error('Company profile is required to generate documents');
      return;
    }
    
    if (!selectedMeeting) {
      toast.error('Please select a meeting first');
      return;
    }
    
    const meeting = companyState.meetings.find(m => m.id === selectedMeeting);
    
    if (!meeting) {
      toast.error('Meeting not found');
      return;
    }
    
    let content = '';
    let fileName = '';
    
    switch (documentType) {
      case 'notice':
        if (meeting.type === 'Board') {
          content = generateBoardMeetingNotice(companyState.companyDetails, meeting);
          fileName = `${meeting.type}_Meeting_Notice_${new Date(meeting.date).toISOString().split('T')[0]}.${selectedFormat}`;
        } else if (meeting.subType === 'AGM') {
          content = generateAGMNotice(companyState.companyDetails, meeting);
          fileName = `AGM_Notice_${new Date(meeting.date).toISOString().split('T')[0]}.${selectedFormat}`;
        }
        break;
      case 'minutes':
        if (meeting.type === 'Board') {
          content = generateBoardMeetingMinutes(companyState.companyDetails, meeting, companyState.directors);
          fileName = `${meeting.type}_Meeting_Minutes_${new Date(meeting.date).toISOString().split('T')[0]}.${selectedFormat}`;
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
  
  const generateAnnualReturnDoc = () => {
    if (!companyState.companyDetails) {
      toast.error('Company profile is required to generate documents');
      return;
    }
    
    if (companyState.directors.length === 0) {
      toast.error('At least one director is required to generate Annual Return');
      return;
    }
    
    if (companyState.members.length === 0) {
      toast.error('At least one member is required to generate Annual Return');
      return;
    }
    
    const content = generateAnnualReturn(
      companyState.companyDetails,
      companyState.directors,
      companyState.members
    );
    
    const fileName = `Annual_Return_MGT7_${new Date().getFullYear()}.${selectedFormat}`;
    
    // In a real application, this would generate actual files
    toast.success('Annual Return (MGT-7) generated successfully');
    
    // Simulate a document download
    const link = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const navigateToSetup = (path: string) => {
    navigate(path);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-corporate-800">Generate Documents</h1>
        <p className="text-gray-500">Create compliant secretarial documents</p>
      </div>
      
      <Tabs defaultValue="meetings" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="meetings">Meeting Documents</TabsTrigger>
          <TabsTrigger value="filings">ROC Filings</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="meetings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarDays className="mr-2 h-5 w-5 text-corporate-600" />
                  Meeting Selection
                </CardTitle>
                <CardDescription>
                  Select a meeting to generate documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hasMeetings ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Select Meeting</label>
                      <Select onValueChange={setSelectedMeeting}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a meeting" />
                        </SelectTrigger>
                        <SelectContent>
                          {companyState.meetings.map((meeting) => (
                            <SelectItem key={meeting.id} value={meeting.id || ""}>
                              {meeting.title} ({new Date(meeting.date).toLocaleDateString()})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Output Format</label>
                      <Select 
                        defaultValue="docx" 
                        onValueChange={(value) => setSelectedFormat(value as "pdf" | "docx")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="docx">Word Document (.docx)</SelectItem>
                          <SelectItem value="pdf">PDF Document (.pdf)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center bg-gray-50 rounded-lg border border-gray-100">
                    <CalendarDays className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                    <h3 className="text-base font-medium text-gray-900 mb-1">No Meetings Found</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      You need to add meetings before generating documents.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => navigateToSetup('/meetings')}
                      className="text-corporate-600"
                    >
                      Setup Meetings <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-corporate-600" />
                  Document Generation
                </CardTitle>
                <CardDescription>
                  Generate meeting-related documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <FileType className="h-5 w-5 mr-2 text-corporate-600" />
                        <h3 className="font-medium">Meeting Notice</h3>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-corporate-700"
                        disabled={!hasMeetings || !selectedMeeting}
                        onClick={() => generateMeetingDocument('notice')}
                      >
                        <FileDown className="mr-1 h-4 w-4" /> Generate
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">
                      Creates a formal notice for board or general meetings as per Companies Act requirements.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <FileType className="h-5 w-5 mr-2 text-corporate-600" />
                        <h3 className="font-medium">Meeting Minutes</h3>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-corporate-700"
                        disabled={!hasMeetings || !selectedMeeting}
                        onClick={() => generateMeetingDocument('minutes')}
                      >
                        <FileDown className="mr-1 h-4 w-4" /> Generate
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">
                      Generates minutes of board meetings with standard format and agenda items.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <p className="text-xs text-gray-500">
                  All documents comply with Companies Act, 2013 requirements
                </p>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="filings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-corporate-600" />
                  Annual Return (MGT-7)
                </CardTitle>
                <CardDescription>
                  Generate annual return in MGT-7 format
                </CardDescription>
              </CardHeader>
              <CardContent>
                {companyState.companyDetails && hasDirectors && hasMembers ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Output Format</label>
                      <Select 
                        defaultValue="docx" 
                        onValueChange={(value) => setSelectedFormat(value as "pdf" | "docx")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="docx">Word Document (.docx)</SelectItem>
                          <SelectItem value="pdf">PDF Document (.pdf)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex justify-between items-center border-t pt-4">
                      <p className="text-sm font-medium">Generate Annual Return</p>
                      <Button 
                        className="bg-corporate-600 hover:bg-corporate-700"
                        onClick={generateAnnualReturnDoc}
                      >
                        <FileDown className="mr-2 h-4 w-4" /> Generate
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center bg-gray-50 rounded-lg border border-gray-100">
                    <FileText className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                    <h3 className="text-base font-medium text-gray-900 mb-1">Data Required</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      To generate Annual Return, you need to have:
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-center text-sm">
                        <div className={`h-4 w-4 rounded-full mr-2 ${companyState.companyDetails ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span>Company Profile</span>
                      </div>
                      <div className="flex items-center justify-center text-sm">
                        <div className={`h-4 w-4 rounded-full mr-2 ${hasDirectors ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span>Directors Information</span>
                      </div>
                      <div className="flex items-center justify-center text-sm">
                        <div className={`h-4 w-4 rounded-full mr-2 ${hasMembers ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span>Members Information</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => navigateToSetup(hasDirectors ? (hasMembers ? '/company-profile' : '/members') : '/directors')}
                      className="text-corporate-600"
                    >
                      Setup Required Data <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-corporate-600" />
                  Other ROC Forms
                </CardTitle>
                <CardDescription>
                  Generate other statutory forms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <FileType className="h-5 w-5 mr-2 text-corporate-600" />
                        <h3 className="font-medium">DIR-12 (Director Changes)</h3>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-corporate-700"
                        disabled={!hasDirectors}
                      >
                        <FileDown className="mr-1 h-4 w-4" /> Generate
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">
                      Form for appointment or changes in Directors.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <FileType className="h-5 w-5 mr-2 text-corporate-600" />
                        <h3 className="font-medium">AOC-4 (Financial Statements)</h3>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-corporate-700"
                        disabled={!companyState.companyDetails}
                      >
                        <FileDown className="mr-1 h-4 w-4" /> Generate
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">
                      For filing financial statements with ROC.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <FileType className="h-5 w-5 mr-2 text-corporate-600" />
                        <h3 className="font-medium">MGT-14 (Resolutions)</h3>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-corporate-700"
                        disabled={!hasMeetings}
                      >
                        <FileDown className="mr-1 h-4 w-4" /> Generate
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">
                      For filing resolutions with ROC.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <p className="text-xs text-gray-500">
                  All forms comply with MCA requirements
                </p>
                <a 
                  href="https://www.mca.gov.in/content/mca/global/en/home.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-corporate-600 flex items-center"
                >
                  MCA Website <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="reports">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCircle className="mr-2 h-5 w-5 text-corporate-600" />
                  Shareholding Reports
                </CardTitle>
                <CardDescription>
                  Generate member and shareholding reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <FileType className="h-5 w-5 mr-2 text-corporate-600" />
                        <h3 className="font-medium">Shareholding Pattern</h3>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-corporate-700"
                        disabled={!hasMembers}
                      >
                        <FileDown className="mr-1 h-4 w-4" /> Generate
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">
                      Report showing distribution of shares among members.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <FileType className="h-5 w-5 mr-2 text-corporate-600" />
                        <h3 className="font-medium">Register of Members</h3>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-corporate-700"
                        disabled={!hasMembers}
                      >
                        <FileDown className="mr-1 h-4 w-4" /> Generate
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">
                      Statutory register of members with shareholding details.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarDays className="mr-2 h-5 w-5 text-corporate-600" />
                  Compliance Calendar
                </CardTitle>
                <CardDescription>
                  Generate compliance reminders and schedules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <FileType className="h-5 w-5 mr-2 text-corporate-600" />
                        <h3 className="font-medium">Annual Compliance Calendar</h3>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-corporate-700"
                        disabled={!companyState.companyDetails}
                      >
                        <FileDown className="mr-1 h-4 w-4" /> Generate
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">
                      Year-round compliance schedule with due dates.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <FileType className="h-5 w-5 mr-2 text-corporate-600" />
                        <h3 className="font-medium">Deadline Reminders</h3>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-corporate-700"
                        disabled={!hasFilings}
                      >
                        <FileDown className="mr-1 h-4 w-4" /> Generate
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">
                      List of upcoming filing deadlines based on added filings.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GenerateDocuments;
