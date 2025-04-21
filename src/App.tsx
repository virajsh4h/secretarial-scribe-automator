
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { CompanyProvider } from "./context/CompanyContext";

// Pages
import Dashboard from "./pages/Dashboard";
import CompanyProfile from "./pages/CompanyProfile";
import Directors from "./pages/Directors";
import Members from "./pages/Members";
import Meetings from "./pages/Meetings";
import Filings from "./pages/Filings";
import GenerateDocuments from "./pages/GenerateDocuments";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CompanyProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <Layout>
                <Dashboard />
              </Layout>
            } />
            <Route path="/company-profile" element={
              <Layout>
                <CompanyProfile />
              </Layout>
            } />
            <Route path="/directors" element={
              <Layout>
                <Directors />
              </Layout>
            } />
            <Route path="/members" element={
              <Layout>
                <Members />
              </Layout>
            } />
            <Route path="/meetings" element={
              <Layout>
                <Meetings />
              </Layout>
            } />
            <Route path="/filings" element={
              <Layout>
                <Filings />
              </Layout>
            } />
            <Route path="/generate" element={
              <Layout>
                <GenerateDocuments />
              </Layout>
            } />
            <Route path="/reports" element={
              <Layout>
                <Reports />
              </Layout>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CompanyProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
