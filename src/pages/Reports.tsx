import React from 'react';
import { 
  BarChart,
  PieChart,
  PieChart as PieChartIcon,
  CalendarDays,
  ClipboardList,
  FileBarChart,
  AlertTriangle
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useCompany } from '@/context/CompanyContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PieChart as PieChartComponent, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { BarChart as BarChartComponent, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const Reports = () => {
  const { companyState } = useCompany();
  
  // Create data for compliance status chart
  const totalFilings = companyState.filings.length;
  const completedFilings = companyState.filings.filter(f => f.status === 'Filed').length;
  const pendingFilings = companyState.filings.filter(f => f.status === 'Pending').length;
  const delayedFilings = companyState.filings.filter(f => f.status === 'Delayed').length;
  
  const complianceStatusData = [
    { name: 'Filed', value: completedFilings, color: '#23b777' },
    { name: 'Pending', value: pendingFilings, color: '#e6a700' },
    { name: 'Delayed', value: delayedFilings, color: '#dc2626' },
  ];
  
  // Create data for meetings distribution
  const boardMeetings = companyState.meetings.filter(m => m.type === 'Board').length;
  const generalMeetings = companyState.meetings.filter(m => m.type === 'General').length;
  
  const meetingsData = [
    { name: 'Board', value: boardMeetings, color: '#0c96e6' },
    { name: 'General', value: generalMeetings, color: '#7c3aed' },
  ];
  
  // Calculate upcoming filings (due in the next 30 days)
  const currentDate = new Date();
  const thirtyDaysLater = new Date();
  thirtyDaysLater.setDate(currentDate.getDate() + 30);
  
  const upcomingFilings = companyState.filings.filter(filing => {
    const dueDate = new Date(filing.dueDate);
    return dueDate > currentDate && dueDate <= thirtyDaysLater && filing.status === 'Pending';
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  
  // Calculate delayed filings
  const delayedFilingsList = companyState.filings.filter(filing => {
    return filing.status === 'Delayed';
  });
  
  // Get shareholding data
  const shareholdingData = companyState.members.map(member => ({
    name: member.name,
    value: member.numberOfShares,
    percentage: member.percentageHolding,
    color: `hsl(${210 + companyState.members.indexOf(member) * 30}, 70%, 50%)`,
  }));
  
  // Calculate total shares
  const totalShares = companyState.members.reduce((sum, member) => sum + member.numberOfShares, 0);
  
  // Check if data is available
  const hasCompanyProfile = !!companyState.companyDetails;
  const hasData = totalFilings > 0 || companyState.meetings.length > 0 || companyState.members.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-corporate-800">Reports & Analytics</h1>
        <p className="text-gray-500">Compliance status and company insights</p>
      </div>
      
      {hasCompanyProfile && hasData ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <ClipboardList className="mr-2 h-5 w-5 text-corporate-600" />
                  Total Filings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{totalFilings}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <FileBarChart className="mr-2 h-5 w-5 text-green-600" />
                  Compliance Rate
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-3xl font-bold">
                  {totalFilings ? Math.round((completedFilings / totalFilings) * 100) : 0}%
                </p>
                <Progress 
                  value={totalFilings ? (completedFilings / totalFilings) * 100 : 0} 
                  className="h-2" 
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <CalendarDays className="mr-2 h-5 w-5 text-corporate-600" />
                  Meetings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{companyState.meetings.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
                  Due Soon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{upcomingFilings.length}</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {companyState.filings.length > 0 && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="mr-2 h-5 w-5 text-corporate-600" />
                    Compliance Status
                  </CardTitle>
                  <CardDescription>
                    Overview of filing compliance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChartComponent
                        data={complianceStatusData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Number of Filings">
                          {complianceStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChartComponent>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {companyState.meetings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChartIcon className="mr-2 h-5 w-5 text-corporate-600" />
                    Meeting Distribution
                  </CardTitle>
                  <CardDescription>
                    Types of meetings conducted
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChartComponent>
                        <Pie
                          data={meetingsData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {meetingsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChartComponent>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {companyState.members.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChartIcon className="mr-2 h-5 w-5 text-corporate-600" />
                    Shareholding Pattern
                  </CardTitle>
                  <CardDescription>
                    Distribution of shares among members
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChartComponent>
                        <Pie
                          data={shareholdingData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {shareholdingData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => [
                            `${value} shares (${((value/totalShares)*100).toFixed(2)}%)`, 
                            'Shares'
                          ]} 
                        />
                        <Legend />
                      </PieChartComponent>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingFilings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarDays className="mr-2 h-5 w-5 text-amber-500" />
                    Upcoming Deadlines
                  </CardTitle>
                  <CardDescription>
                    Filings due in the next 30 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Form</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingFilings.map((filing) => {
                        const daysLeft = Math.ceil((new Date(filing.dueDate).getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
                        
                        return (
                          <TableRow key={filing.id}>
                            <TableCell className="font-medium">{filing.formNumber}</TableCell>
                            <TableCell>{filing.name}</TableCell>
                            <TableCell>{new Date(filing.dueDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={
                                  daysLeft <= 7 
                                    ? "bg-red-50 text-red-700 border-red-200" 
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                }
                              >
                                {daysLeft <= 1 
                                  ? 'Due Today' 
                                  : `${daysLeft} days left`
                                }
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
            
            {delayedFilingsList.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                    Delayed Filings
                  </CardTitle>
                  <CardDescription>
                    Filings that have missed their deadlines
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Form</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {delayedFilingsList.map((filing) => (
                        <TableRow key={filing.id}>
                          <TableCell className="font-medium">{filing.formNumber}</TableCell>
                          <TableCell>{filing.name}</TableCell>
                          <TableCell>{new Date(filing.dueDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              Delayed
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      ) : (
        <div className="p-8 text-center bg-corporate-50 rounded-lg border border-corporate-100">
          <ClipboardList className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-bold text-corporate-800 mb-2">
            {hasCompanyProfile 
              ? "No Data Available for Reports" 
              : "Company Profile Required"}
          </h2>
          <p className="text-gray-600 mb-6">
            {hasCompanyProfile 
              ? "Add meetings, filings, directors, and members to view compliance reports and analytics." 
              : "Set up your company profile first to enable reports and analytics."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Reports;
