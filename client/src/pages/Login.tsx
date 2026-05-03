import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Headset, ShieldCheck, User, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [customerPhone, setCustomerPhone] = useState("");
  const [customerPassword, setCustomerPassword] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminAttempts, setAdminAttempts] = useState(0);
  const [adminLocked, setAdminLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [showCustomerPass, setShowCustomerPass] = useState(false);
  const [showAdminPass, setShowAdminPass] = useState(false);

  // Lock admin login for 30s after 3 failed attempts
  const MAX_ATTEMPTS = 3;
  const LOCK_SECONDS = 30;

  useState(() => {
    if (!adminLocked) return;
    const interval = setInterval(() => {
      setLockTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setAdminLocked(false);
          setAdminAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  });

  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await api.post<{ customer_id: number; name: string }>("/api/auth/customer-login", {
        phone: customerPhone,
        password: customerPassword,
      });
      login("customer", data.customer_id);
      toast.success("Welcome back, " + data.name);
      navigate("/customer");
    } catch {
      toast.error("Invalid phone number or password");
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLocked) {
      toast.error(`Too many attempts. Try again in ${lockTimer}s`);
      return;
    }
    try {
      const data = await api.post<{ admin_id: number }>("/api/auth/admin-login", {
        username: adminUsername,
        password: adminPassword,
      });
      setAdminAttempts(0);
      login("admin", data.admin_id);
      toast.success("Welcome, Admin");
      navigate("/admin");
    } catch {
      const newAttempts = adminAttempts + 1;
      setAdminAttempts(newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) {
        setAdminLocked(true);
        setLockTimer(LOCK_SECONDS);
        toast.error(`Account locked for ${LOCK_SECONDS} seconds due to too many failed attempts`);
      } else {
        toast.error(`Invalid credentials. ${MAX_ATTEMPTS - newAttempts} attempt(s) remaining`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
        </Button>
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-primary mb-2">
            <Headset className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Customer Relationship Management System</h1>
          <p className="text-muted-foreground text-sm">Smart Service Complaint Management</p>
        </div>

        <Card className="shadow-card">
          <Tabs defaultValue="customer">
            <div className="pb-2 pt-4 px-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="customer" className="gap-1.5"><User className="h-4 w-4" />Customer</TabsTrigger>
                <TabsTrigger value="admin" className="gap-1.5"><ShieldCheck className="h-4 w-4" />Admin</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="customer">
              <form onSubmit={handleCustomerLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="Enter phone number" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpass">Password</Label>
                    <div className="relative">
                      <Input id="cpass" type={showCustomerPass ? "text" : "password"} placeholder="Enter password" value={customerPassword} onChange={e => setCustomerPassword(e.target.value)} required className="pr-10" />
                      <button type="button" onClick={() => setShowCustomerPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showCustomerPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">Sign In</Button>
                  <p className="text-center text-sm text-muted-foreground">
                    New customer?{" "}
                    <button type="button" onClick={() => navigate("/register")} className="text-primary font-medium hover:underline">Register here</button>
                  </p>
                  
                </CardContent>
              </form>
            </TabsContent>

            <TabsContent value="admin">
              <form onSubmit={handleAdminLogin}>
                <CardContent className="space-y-4">
                  {adminLocked && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                      <ShieldCheck className="h-4 w-4" />
                      Account locked. Try again in {lockTimer}s
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="auser">Username</Label>
                    <Input id="auser" placeholder="Enter username" value={adminUsername} onChange={e => setAdminUsername(e.target.value)} required disabled={adminLocked} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apass">Password</Label>
                    <div className="relative">
                      <Input id="apass" type={showAdminPass ? "text" : "password"} placeholder="Enter password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} required disabled={adminLocked} className="pr-10" />
                      <button type="button" onClick={() => setShowAdminPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showAdminPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={adminLocked}>
                    {adminLocked ? `Locked (${lockTimer}s)` : "Admin Login"}
                  </Button>
                </CardContent>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
