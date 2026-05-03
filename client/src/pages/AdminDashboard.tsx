import { useData } from "@/context/DataContext";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Clock, FileText, Users, Wrench } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useNavigate } from "react-router-dom";

const COLORS = ["hsl(38 92% 50%)", "hsl(215 90% 50%)", "hsl(142 71% 45%)"];

export default function AdminDashboard() {
  const { complaints, technicians, services } = useData();
  const navigate = useNavigate();

  const open = complaints.filter(c => c.status === "open").length;
  const inProgress = complaints.filter(c => c.status === "in_progress").length;
  const closed = complaints.filter(c => c.status === "closed").length;

  const stats = [
    { label: "Complaints", value: complaints.length, icon: FileText, gradient: "from-blue-600 to-indigo-600", onClick: () => navigate("/admin/complaints") },
    { label: "Open Alerts", value: open, icon: AlertCircle, gradient: "from-red-500 to-rose-600", onClick: () => navigate("/admin/complaints?status=open") },
    { label: "In Progress", value: inProgress, icon: Clock, gradient: "from-orange-500 to-amber-500", onClick: () => navigate("/admin/complaints?status=in_progress") },
    { label: "Resolved", value: closed, icon: CheckCircle, gradient: "from-emerald-500 to-teal-600", onClick: () => navigate("/admin/complaints?status=closed") },
    { label: "Technicians", value: technicians.length, icon: Users, gradient: "from-green-500 to-lime-600", onClick: () => navigate("/admin/technicians") },
    { label: "Services", value: services.length, icon: Wrench, gradient: "from-purple-500 to-fuchsia-600", onClick: () => navigate("/admin/services") },
  ];

  const pieData = [
    { name: "Open", value: open },
    { name: "In Progress", value: inProgress },
    { name: "Closed", value: closed },
  ].filter(d => d.value > 0);

  const techWorkload = technicians
    .map(t => ({
      name: t.name.split(" ")[0],
      assigned: complaints.filter(c => c.technician_id === t.technician_id && c.status !== "closed").length,
      completed: complaints.filter(c => c.technician_id === t.technician_id && c.status === "closed").length,
    }))
    .filter(t => t.assigned > 0 || t.completed > 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-3xl gradient-hero p-6 text-white shadow-2xl">
          <p className="text-sm font-semibold text-cyan-100">Admin Command Center</p>
          <h2 className="text-2xl font-black mt-1">Live CRM Overview</h2>
          <p className="text-sm text-white/80 mt-1">Track complaints, technician capacity, and resolution flow from one premium dashboard.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map(s => (
            <Card
              key={s.label}
              className={`shadow-card premium-hover overflow-hidden border-0 bg-gradient-to-br ${s.gradient} text-white cursor-pointer active:scale-95 transition-transform`}
              onClick={s.onClick}
              title={`Click to view ${s.label}`}
            >
              <CardContent className="pt-4 pb-3">
                <s.icon className="h-5 w-5 text-white/85 mb-2" />
                <p className="text-2xl font-black" data-testid={`text-admin-stat-${s.label.toLowerCase().replaceAll(" ", "-")}`}>{s.value}</p>
                <p className="text-xs text-white/82 mt-0.5">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-card premium-hover border-blue-100">
            <CardHeader><CardTitle className="text-base">Complaint Status</CardTitle></CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card premium-hover border-emerald-100">
            <CardHeader><CardTitle className="text-base">Technician Workload</CardTitle></CardHeader>
            <CardContent>
              <div className="h-56">
                {techWorkload.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                    No technician workload data available
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={techWorkload}>
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="assigned" fill="hsl(215 90% 50%)" name="Active" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="completed" fill="hsl(142 71% 45%)" name="Completed" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
