
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  CompanyDetails, 
  Director, 
  Member, 
  MeetingDocument, 
  FilingReport,
  CompanyState
} from '@/types';

interface CompanyContextType {
  companyState: CompanyState;
  setCompanyDetails: (details: CompanyDetails) => void;
  addDirector: (director: Director) => void;
  updateDirector: (id: string, director: Director) => void;
  removeDirector: (id: string) => void;
  addMember: (member: Member) => void;
  updateMember: (id: string, member: Member) => void;
  removeMember: (id: string) => void;
  addMeeting: (meeting: MeetingDocument) => void;
  updateMeeting: (id: string, meeting: MeetingDocument) => void;
  removeMeeting: (id: string) => void;
  addFiling: (filing: FilingReport) => void;
  updateFiling: (id: string, filing: FilingReport) => void;
  removeFiling: (id: string) => void;
}

const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

const defaultState: CompanyState = {
  companyDetails: null,
  directors: [],
  members: [],
  meetings: [],
  filings: []
};

// Check local storage for existing data
const loadInitialState = (): CompanyState => {
  if (typeof window === 'undefined') return defaultState;
  
  const storedData = localStorage.getItem('companyData');
  return storedData ? JSON.parse(storedData) : defaultState;
};

export const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [companyState, setCompanyState] = useState<CompanyState>(loadInitialState);

  // Save to local storage whenever state changes
  useEffect(() => {
    localStorage.setItem('companyData', JSON.stringify(companyState));
  }, [companyState]);

  const setCompanyDetails = (details: CompanyDetails) => {
    setCompanyState(prev => ({
      ...prev,
      companyDetails: {
        ...details,
        id: prev.companyDetails?.id || generateId()
      }
    }));
  };

  const addDirector = (director: Director) => {
    setCompanyState(prev => ({
      ...prev,
      directors: [...prev.directors, { ...director, id: generateId() }]
    }));
  };

  const updateDirector = (id: string, director: Director) => {
    setCompanyState(prev => ({
      ...prev,
      directors: prev.directors.map(d => d.id === id ? { ...director, id } : d)
    }));
  };

  const removeDirector = (id: string) => {
    setCompanyState(prev => ({
      ...prev,
      directors: prev.directors.filter(d => d.id !== id)
    }));
  };

  const addMember = (member: Member) => {
    setCompanyState(prev => ({
      ...prev,
      members: [...prev.members, { ...member, id: generateId() }]
    }));
  };

  const updateMember = (id: string, member: Member) => {
    setCompanyState(prev => ({
      ...prev,
      members: prev.members.map(m => m.id === id ? { ...member, id } : m)
    }));
  };

  const removeMember = (id: string) => {
    setCompanyState(prev => ({
      ...prev,
      members: prev.members.filter(m => m.id !== id)
    }));
  };

  const addMeeting = (meeting: MeetingDocument) => {
    setCompanyState(prev => ({
      ...prev,
      meetings: [...prev.meetings, { 
        ...meeting, 
        id: generateId(),
        generatedOn: new Date().toISOString() 
      }]
    }));
  };

  const updateMeeting = (id: string, meeting: MeetingDocument) => {
    setCompanyState(prev => ({
      ...prev,
      meetings: prev.meetings.map(m => m.id === id ? { ...meeting, id } : m)
    }));
  };

  const removeMeeting = (id: string) => {
    setCompanyState(prev => ({
      ...prev,
      meetings: prev.meetings.filter(m => m.id !== id)
    }));
  };

  const addFiling = (filing: FilingReport) => {
    setCompanyState(prev => ({
      ...prev,
      filings: [...prev.filings, { ...filing, id: generateId() }]
    }));
  };

  const updateFiling = (id: string, filing: FilingReport) => {
    setCompanyState(prev => ({
      ...prev,
      filings: prev.filings.map(f => f.id === id ? { ...filing, id } : f)
    }));
  };

  const removeFiling = (id: string) => {
    setCompanyState(prev => ({
      ...prev,
      filings: prev.filings.filter(f => f.id !== id)
    }));
  };

  return (
    <CompanyContext.Provider value={{
      companyState,
      setCompanyDetails,
      addDirector,
      updateDirector,
      removeDirector,
      addMember,
      updateMember,
      removeMember,
      addMeeting,
      updateMeeting,
      removeMeeting,
      addFiling,
      updateFiling,
      removeFiling
    }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
