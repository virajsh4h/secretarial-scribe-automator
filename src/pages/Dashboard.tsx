
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar,
  Clock,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  BookOpen
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCompany } from '@/context/CompanyContext';
import { Progress } from '@/components/ui/progress';

const Dashboard = () => {
  const { companyState } = useCompany();
  const navigate = useNavigate();
  
  // Calculate upcoming filings (due in the next 30 days)
  const currentDate = new Date();
  const thirtyDaysLater = new Date();
  thirtyDaysLater.setDate(currentDate.getDate() + 30);
  
  const upcomingFilings = companyState.filings.filter(filing => {
    const dueDate = new Date(filing.dueDate);
    return dueDate > currentDate && dueDate <= thirtyDaysLater && filing.status === 'Pending';
  });
  
  // Calculate compliance stats
  const totalFilings = companyState.filings.length;
  const completedFilings = companyState.filings.filter(f => f.status === 'Filed').length;
  const compliancePercentage = totalFilings ? Math.round((completedFilings / totalFilings) * 100) : 0;
  
  // Get recent meetings
  const recentMeetings = [...companyState.meetings]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-corporate-800">Dashboard</h1>
          <p className="text-gray-500">Company Secretary Compliance Automation</p>
        </div>
        
        {!companyState.companyDetails && (
          <Button 
            onClick={() => navigate('/company-profile')}
            className="bg-corporate-600 hover:bg-corporate-700"
          >
            Setup Company Profile
          </Button>
        )}
      </div>
      
      {companyState.companyDetails ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Users className="mr-2 h-5 w-5 text-corporate-600" />
                  Directors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{companyState.directors.length}</p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate('/directors')}
                >
                  Manage Directors
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Users className="mr-2 h-5 w-5 text-corporate-600" />
                  Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{companyState.members.length}</p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate('/members')}
                >
                  Manage Members
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-corporate-600" />
                  Meetings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{companyState.meetings.length}</p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate('/meetings')}
                >
                  Manage Meetings
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-corporate-600" />
                  ROC Filings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{companyState.filings.length}</p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate('/filings')}
                >
                  Manage Filings
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
                  Upcoming Compliance Deadlines
                </CardTitle>
                <CardDescription>Filings due in the next 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingFilings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingFilings.map((filing) => (
                      <div key={filing.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <h3 className="font-medium">{filing.name}</h3>
                          <p className="text-sm text-gray-500">Form {filing.formNumber}</p>
                        </div>
                        <div>
                          <p className="text-amber-600 flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Due: {new Date(filing.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2 text-accent2-600" />
                    <p>No upcoming deadlines for the next 30 days</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/filings')}
                >
                  View All Filings
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-corporate-600" />
                  Compliance Status
                </CardTitle>
                <CardDescription>Overall filing compliance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Filing Status</span>
                    <span className="text-sm text-gray-500">{compliancePercentage}% Complete</span>
                  </div>
                  <Progress value={compliancePercentage} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 text-center">
                    <p className="text-lg font-bold text-accent2-600">{completedFilings}</p>
                    <p className="text-xs text-gray-500">Completed</p>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <p className="text-lg font-bold text-amber-600">
                      {totalFilings - completedFilings}
                    </p>
                    <p className="text-xs text-gray-500">Pending</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/reports')}
                >
                  View Compliance Reports
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-corporate-600" />
                  Recent Meetings
                </CardTitle>
                <CardDescription>Latest scheduled or completed meetings</CardDescription>
              </CardHeader>
              <CardContent>
                {recentMeetings.length > 0 ? (
                  <div className="space-y-4">
                    {recentMeetings.map((meeting) => (
                      <div key={meeting.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <h3 className="font-medium">{meeting.title}</h3>
                          <p className="text-sm text-gray-500">{meeting.type} Meeting</p>
                        </div>
                        <div>
                          <p className="text-corporate-600">
                            {new Date(meeting.date).toLocaleDateString()} at {meeting.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    <p>No meetings scheduled</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/meetings')}
                >
                  View All Meetings
                </Button>
              </CardFooter>
            </Card>
          </div>
        </>
      ) : (
        <div className="p-8 text-center bg-corporate-50 rounded-lg border border-corporate-100">
          <h2 className="text-xl font-bold text-corporate-800 mb-2">Welcome to SecretarialPro</h2>
          <p className="text-gray-600 mb-6">
            Get started by setting up your company profile to begin automating your secretarial compliance tasks.
          </p>
          <Button 
            onClick={() => navigate('/company-profile')}
            className="bg-corporate-600 hover:bg-corporate-700"
          >
            Setup Company Profile
          </Button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
