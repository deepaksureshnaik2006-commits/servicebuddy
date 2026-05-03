import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import CustomerLayout from "@/components/CustomerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Clock, FileText, MapPin } from "lucide-react";
import { PriorityBadge, StatusBadge } from "@/components/StatusBadges";
import { useNavigate } from "react-router-dom";
import { extractCityFromAddress } from "@/lib/locationUtils";

export default function CustomerDashboard() {
  const { customerId } = useAuth();
  const { complaints, services, customers, technicians } = useData();
  const navigate = useNavigate();

  const customer = customers.find(c => c.customer_id === customerId);
  const customerCity = customer ? extractCityFromAddress(customer.address) : "";
  const myComplaints = complaints.filter(c => c.customer_id === customerId);
  const open = myComplaints.filter(c => c.status === "open").length;
  const inProgress = myComplaints.filter(c => c.status === "in_progress").length;
  const closed = myComplaints.filter(c => c.status === "closed").length;

  const stats = [
    { label: "Complaints", value: myComplaints.length, icon: FileText, gradient: "from-blue-600 to-indigo-600", onClick: () => navigate("/customer/history") },
    { label: "Open", value: open, icon: AlertCircle, gradient: "from-red-500 to-rose-600", onClick: () => navigate("/customer/history?status=open") },
    { label: "In Progress", value: inProgress, icon: Clock, gradient: "from-orange-500 to-amber-500", onClick: () => navigate("/customer/history?status=in_progress") },
    { label: "Resolved", value: closed, icon: CheckCircle, gradient: "from-emerald-500 to-teal-600", onClick: () => navigate("/customer/history?status=closed") },
  ];

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="rounded-3xl gradient-hero p-6 text-white shadow-2xl">
          <h2 className="text-2xl font-black">Welcome, {customer?.name || "Customer"}</h2>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <p className="text-white/82 text-sm">Here's an overview of your complaints</p>
            {customerCity && customerCity !== "Unknown" && (
              <span className="flex items-center gap-1 text-xs text-white font-bold bg-white/18 px-3 py-1 rounded-full backdrop-blur">
                <MapPin className="h-3 w-3" /> {customerCity}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(s => (
            <Card
              key={s.label}
              className={`shadow-card premium-hover border-0 overflow-hidden bg-gradient-to-br ${s.gradient} text-white cursor-pointer active:scale-95 transition-transform`}
              onClick={s.onClick}
              title={`Click to view ${s.label} complaints`}
            >
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/82">{s.label}</p>
                    <p className="text-2xl font-black mt-1" data-testid={`text-customer-stat-${s.label.toLowerCase().replaceAll(" ", "-")}`}>{s.value}</p>
                  </div>
                  <s.icon className="h-8 w-8 text-white/85" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-lg">Recent Complaints</CardTitle></CardHeader>
          <CardContent>
            {myComplaints.length === 0 ? (
              <p className="text-muted-foreground text-sm py-8 text-center">No complaints yet. Submit your first complaint!</p>
            ) : (
              <div className="space-y-3">
                {myComplaints.slice(0, 5).map(c => {
                  const service = services.find(s => s.service_id === c.service_id);
                  const tech = technicians.find(t => t.technician_id === c.technician_id);
                  return (
                    <div key={c.complaint_id} className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-purple-50 hover:to-teal-50 transition-colors cursor-pointer border border-blue-100" onClick={() => navigate("/customer/history")} data-testid={`card-recent-complaint-${c.complaint_id}`}>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{c.ai_summary || c.problem}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{service?.name} · {new Date(c.created_at).toLocaleDateString()}</p>
                        {tech && c.status !== "closed" && (
                          <p className="text-xs text-primary mt-0.5">📞 {tech.name}: {tech.phone}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <PriorityBadge priority={c.priority || "normal"} />
                        <StatusBadge status={c.status || "open"} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
}
