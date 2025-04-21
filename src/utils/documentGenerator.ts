
import { CompanyDetails, Director, Member, MeetingDocument } from '@/types';

export const generateBoardMeetingNotice = (
  company: CompanyDetails,
  meeting: MeetingDocument
): string => {
  const date = new Date(meeting.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const formattedTime = meeting.time;
  
  return `
NOTICE OF BOARD MEETING

${company.name}
CIN: ${company.cin}
Registered Office: ${company.registeredAddress}

Date: ${new Date().toLocaleDateString('en-GB')}

NOTICE is hereby given that a Meeting of the Board of Directors of ${company.name} will be held on ${date} at ${formattedTime} at ${meeting.venue} to transact the following business:

AGENDA:
${meeting.agenda.map((item, index) => `${index + 1}. ${item}`).join('\n')}

By Order of the Board
For ${company.name}

Company Secretary
  `;
};

export const generateBoardMeetingMinutes = (
  company: CompanyDetails,
  meeting: MeetingDocument,
  directors: Director[]
): string => {
  const date = new Date(meeting.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const formattedTime = meeting.time;
  
  const attendingDirectors = directors.slice(0, Math.min(directors.length, 3));
  
  return `
MINUTES OF THE MEETING OF BOARD OF DIRECTORS OF ${company.name.toUpperCase()}
HELD ON ${date.toUpperCase()} AT ${formattedTime} AT ${meeting.venue.toUpperCase()}

PRESENT:
${attendingDirectors.map(director => `${director.name} - ${director.designation}`).join('\n')}

IN ATTENDANCE:
Company Secretary

CHAIRPERSON:
${attendingDirectors.length > 0 ? attendingDirectors[0].name : 'The Director'}

The Chairperson welcomed the Directors to the Meeting. The requisite quorum being present, the Chairperson called the Meeting to order.

MINUTES OF THE PREVIOUS MEETING:
The Minutes of the previous Board Meeting were read and confirmed.

AGENDA ITEMS:
${meeting.agenda.map((item, index) => {
  return `
ITEM ${index + 1}: ${item}
The Board discussed and approved ${item}.
`;
}).join('\n')}

CONCLUSION:
There being no other business, the Meeting concluded with a vote of thanks to the Chair.

Date: ${date}

_______________________
CHAIRPERSON
  `;
};

export const generateAGMNotice = (
  company: CompanyDetails,
  meeting: MeetingDocument
): string => {
  const date = new Date(meeting.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return `
NOTICE OF ANNUAL GENERAL MEETING

${company.name}
CIN: ${company.cin}
Registered Office: ${company.registeredAddress}

NOTICE is hereby given that the Annual General Meeting of ${company.name} will be held on ${date} at ${meeting.time} at ${meeting.venue} to transact the following business:

ORDINARY BUSINESS:
${meeting.agenda.map((item, index) => `${index + 1}. ${item}`).join('\n')}

By Order of the Board
For ${company.name}

Place: ${meeting.venue.split(',').pop()?.trim() || ''}
Date: ${new Date().toLocaleDateString('en-GB')}

Company Secretary

Notes:
1. A MEMBER ENTITLED TO ATTEND AND VOTE IS ENTITLED TO APPOINT A PROXY TO ATTEND AND VOTE INSTEAD OF HIMSELF.
2. THE REGISTER OF MEMBERS AND SHARE TRANSFER BOOKS WILL REMAIN CLOSED FROM [DATE] TO [DATE] (BOTH DAYS INCLUSIVE).
  `;
};

export const generateAnnualReturn = (
  company: CompanyDetails,
  directors: Director[],
  members: Member[]
): string => {
  const financialYear = company.financialYearEnd.split('-')[0];
  const totalShares = members.reduce((sum, member) => sum + member.numberOfShares, 0);
  
  return `
ANNUAL RETURN
[FORM MGT-7]

For the financial year ended: ${company.financialYearEnd}

1. COMPANY DETAILS:
   Name: ${company.name}
   CIN: ${company.cin}
   Registration Date: ${company.registrationDate}
   Registered Office: ${company.registeredAddress}
   Email: ${company.email}
   Phone: ${company.phone}
   Website: ${company.website || 'N/A'}
   
2. CAPITAL STRUCTURE:
   Authorized Capital: Rs. ${company.authorizedCapital.toLocaleString()}
   Paid-up Capital: Rs. ${company.paidUpCapital.toLocaleString()}
   
3. DIRECTORS:
${directors.map((director, index) => `
   ${index + 1}. Name: ${director.name}
      DIN: ${director.din}
      Designation: ${director.designation}
      Date of Appointment: ${director.dateOfAppointment}
`).join('')}

4. SHAREHOLDERS:
${members.map((member, index) => `
   ${index + 1}. Name: ${member.name}
      Folio Number: ${member.folioNumber}
      Shares: ${member.numberOfShares} (${member.percentageHolding}%)
`).join('')}

5. SUMMARY:
   Total Number of Directors: ${directors.length}
   Total Number of Members: ${members.length}
   Total Number of Shares: ${totalShares}
  `;
};

export const generateFormText = (formName: string): string => {
  const forms: Record<string, string> = {
    'MGT-7': 'Annual Return',
    'AOC-4': 'Financial Statements',
    'DIR-12': 'Changes in Directors',
    'MGT-14': 'Filing of Resolutions',
    'ADT-1': 'Appointment of Auditor',
  };
  
  return forms[formName] || formName;
};

// Function to convert document to downloadable format (simulated)
export const generateDownloadableDocument = (content: string, format: 'pdf' | 'docx'): string => {
  // In real implementation, this would generate actual PDF or DOCX files
  // For now, we'll just return a mock URL
  return `data:application/${format === 'pdf' ? 'pdf' : 'vnd.openxmlformats-officedocument.wordprocessingml.document'};base64,${btoa(content)}`;
};
