
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md">
        <FileQuestion className="h-24 w-24 mx-auto mb-6 text-corporate-300" />
        <h1 className="text-4xl font-bold text-corporate-800 mb-4">Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button 
          onClick={() => navigate('/')}
          className="bg-corporate-600 hover:bg-corporate-700"
          size="lg"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
