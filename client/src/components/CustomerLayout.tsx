import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, Home, PlusCircle, History, Headset, User } from "lucide-react";

export default function CustomerLayout({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { path: "/customer", label: "Dashboard", icon: Home },
    { path: "/customer/submit", label: "New Complaint", icon: PlusCircle },
    { path: "/customer/history", label: "History", icon: History },
    { path: "/customer/profile", label: "My Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Fixed Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border fixed top-0 left-0 h-screen z-30">
        <div className="flex flex-col items-start px-6 h-16 justify-center border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Headset className="h-5 w-5 text-sidebar-primary" />
            <span className="text-lg font-semibold text-sidebar-primary-foreground">CRM System</span>
          </div>
          <span className="text-[10px] font-medium tracking-widest uppercase text-sidebar-primary/70 ml-7">Customer Portal</span>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {links.map(l => (
            <button
              key={l.path}
              onClick={() => navigate(l.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === l.path
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </button>
          ))}
        </nav>
        <div className="px-3 pb-4 space-y-1">
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        <header className="h-16 border-b bg-card flex items-center px-6">
          <h1 className="text-lg font-semibold text-foreground">
            {links.find(l => l.path === location.pathname)?.label || "Customer Panel"}
          </h1>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>

    </div>
  );
}
