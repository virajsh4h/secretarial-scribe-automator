
export interface CompanyDetails {
  id?: string;
  name: string;
  cin: string;
  registrationDate: string;
  registeredAddress: string;
  authorizedCapital: number;
  paidUpCapital: number;
  email: string;
  phone: string;
  website?: string;
  financialYearEnd: string;
}

export interface Director {
  id?: string;
  name: string;
  din: string;
  pan: string;
  dateOfBirth: string;
  dateOfAppointment: string;
  residentialAddress: string;
  email: string;
  phone: string;
  designation: string;
}

export interface Member {
  id?: string;
  name: string;
  folioNumber: string;
  pan: string;
  address: string;
  email: string;
  phone: string;
  numberOfShares: number;
  percentageHolding: number;
}

export interface MeetingDocument {
  id?: string;
  type: 'Board' | 'General';
  subType?: 'AGM' | 'EGM' | 'Regular' | 'Committee';
  title: string;
  date: string;
  time: string;
  venue: string;
  agenda: string[];
  generatedOn?: string;
  documentPath?: string;
}

export interface FilingReport {
  id?: string;
  name: string;
  formNumber: string;
  dueDate: string;
  filingDate?: string;
  status: 'Pending' | 'Filed' | 'Delayed';
  documentPath?: string;
}

export interface CompanyState {
  companyDetails: CompanyDetails | null;
  directors: Director[];
  members: Member[];
  meetings: MeetingDocument[];
  filings: FilingReport[];
}
