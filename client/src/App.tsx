import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import CustomerDashboard from "./pages/CustomerDashboard";
import SubmitComplaint from "./pages/SubmitComplaint";
import ComplaintHistory from "./pages/ComplaintHistory";
import CustomerProfile from "./pages/CustomerProfile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminComplaints from "./pages/AdminComplaints";
import AdminTechnicians from "./pages/AdminTechnicians";
import AdminServices from "./pages/AdminServices";
import AdminProfile from "./pages/AdminProfile";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

const queryClient = new QueryClient();

function ProtectedRoute({ children, role }: { children: React.ReactNode; role: "customer" | "admin" }) {
  const auth = useAuth();
  if (auth.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { role } = useAuth();
  return (
    <Routes>
      <Route path="/" element={role === "customer" ? <Navigate to="/customer" /> : role === "admin" ? <Navigate to="/admin" /> : <Index />} />
      <Route path="/login" element={role === "customer" ? <Navigate to="/customer" /> : role === "admin" ? <Navigate to="/admin" /> : <LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/customer" element={<ProtectedRoute role="customer"><CustomerDashboard /></ProtectedRoute>} />
      <Route path="/customer/submit" element={<ProtectedRoute role="customer"><SubmitComplaint /></ProtectedRoute>} />
      <Route path="/customer/history" element={<ProtectedRoute role="customer"><ComplaintHistory /></ProtectedRoute>} />
      <Route path="/customer/profile" element={<ProtectedRoute role="customer"><CustomerProfile /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/complaints" element={<ProtectedRoute role="admin"><AdminComplaints /></ProtectedRoute>} />
      <Route path="/admin/technicians" element={<ProtectedRoute role="admin"><AdminTechnicians /></ProtectedRoute>} />
      <Route path="/admin/services" element={<ProtectedRoute role="admin"><AdminServices /></ProtectedRoute>} />
      <Route path="/admin/profile" element={<ProtectedRoute role="admin"><AdminProfile /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <DataProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </DataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
