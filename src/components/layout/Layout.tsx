
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  FileText, 
  Calendar, 
  ClipboardList, 
  LayoutDashboard,
  FileOutput,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCompany } from '@/context/CompanyContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { companyState } = useCompany();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: '/company-profile', label: 'Company Profile', icon: <Building2 className="h-5 w-5" /> },
    { path: '/directors', label: 'Directors', icon: <Users className="h-5 w-5" /> },
    { path: '/members', label: 'Members', icon: <Users className="h-5 w-5" /> },
    { path: '/meetings', label: 'Meetings', icon: <Calendar className="h-5 w-5" /> },
    { path: '/transactions', label: 'Business Transactions', icon: <FileText className="h-5 w-5" /> },
    { path: '/filings', label: 'ROC Filings', icon: <FileText className="h-5 w-5" /> },
    { path: '/generate', label: 'Generate Documents', icon: <FileOutput className="h-5 w-5" /> },
    { path: '/reports', label: 'Reports', icon: <ClipboardList className="h-5 w-5" /> },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Mobile Menu Toggle */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMobileMenu}
          className="rounded-full"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-sidebar border-r fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-corporate-800">SecretarialPro</h1>
            <p className="text-sm text-gray-500">Compliance Automation</p>
          </div>

          <div className="p-4 border-b">
            {companyState.companyDetails ? (
              <div>
                <h2 className="font-medium text-corporate-700">{companyState.companyDetails.name}</h2>
                <p className="text-xs text-gray-500">CIN: {companyState.companyDetails.cin}</p>
              </div>
            ) : (
              <div className="text-sm text-gray-500">No company selected</div>
            )}
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      location.pathname === item.path
                        ? "bg-corporate-100 text-corporate-900"
                        : "text-gray-700 hover:bg-corporate-50 hover:text-corporate-800"
                    )}
                    onClick={closeMobileMenu}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t">
            <div className="text-xs text-gray-500">
              <p>Companies Act, 2013 Compliant</p>
              <p className="mt-1">© 2025 SecretarialPro</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        "md:ml-64" // Always shifted on desktop
      )}>
        <div className="container py-8 px-4 md:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
