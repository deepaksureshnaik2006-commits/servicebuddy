import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PriorityBadge, StatusBadge } from "@/components/StatusBadges";
import { Sparkles, Trash2, AlertTriangle, Search, Clock, MapPin, X } from "lucide-react";
import { toast } from "sonner";
import { ComplaintStatus } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import ComplaintTimeline from "@/components/ComplaintTimeline";
import { getEstimatedResolution } from "@/lib/smartMessages";
import { extractCompanyFromProblem, getCleanProblem } from "@/lib/companyMapping";
import { detectCompanySupport } from "@/lib/supportCardData";
import { extractCityFromAddress, isTechnicianNearby } from "@/lib/locationUtils";
import { useSearchParams } from "react-router-dom";

export default function AdminComplaints() {
  const { complaints, customers, services, technicians, assignTechnician, updateComplaint, deleteComplaint } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get("status") || "all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const s = searchParams.get("status");
    if (s) setStatusFilter(s);
  }, [searchParams]);
  const [selectedComplaint, setSelectedComplaint] = useState<number | null>(null);

  const filtered = complaints.filter(c => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (priorityFilter !== "all" && c.priority !== priorityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const customer = customers.find(cu => cu.customer_id === c.customer_id);
      const service = services.find(s => s.service_id === c.service_id);
      const matchesCustomer = customer?.name.toLowerCase().includes(q) || customer?.address.toLowerCase().includes(q);
      const matchesService = service?.name.toLowerCase().includes(q);
      const matchesProblem = c.problem.toLowerCase().includes(q);
      const matchesSummary = c.ai_summary?.toLowerCase().includes(q);
      if (!matchesCustomer && !matchesService && !matchesProblem && !matchesSummary) return false;
    }
    return true;
  });

  const handleAssign = async (complaintId: number, techId: string) => {
    try {
      await assignTechnician(complaintId, Number(techId));
      toast.success("Technician assigned");
    } catch (err: any) {
      toast.error(err.message || "Failed to assign technician");
    }
  };

  const handleStatusChange = async (complaintId: number, newStatus: ComplaintStatus) => {
    const complaint = complaints.find(c => c.complaint_id === complaintId);
    if (!complaint) return;
    const current = complaint.status || "open";
    if (newStatus === "closed" && current === "open") {
      toast.error("Assign a technician before closing");
      return;
    }
    if (newStatus === "open" && current !== "open") {
      toast.error("Cannot revert to open");
      return;
    }
    await updateComplaint(complaintId, { status: newStatus });
    toast.success(`Status: ${newStatus.replace("_", " ")}`);
  };

  const handleAddAction = async (complaintId: number, action: string) => {
    if (!action.trim()) return;
    await updateComplaint(complaintId, { action });
    setSelectedComplaint(null);
  };

  const handleDelete = async (complaintId: number) => {
    await deleteComplaint(complaintId);
    toast.success("Complaint deleted");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          <h2 className="text-lg font-semibold text-foreground shrink-0">Complaints ({filtered.length})</h2>
          <div className="flex items-center gap-2 flex-wrap flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-8 h-9 w-64 text-sm" />
            </div>
            <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); if (v !== "all") setSearchParams({ status: v }); else setSearchParams({}); }}>
              <SelectTrigger className="w-36 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            {statusFilter !== "all" && (
              <Button variant="ghost" size="sm" className="h-9 gap-1 text-xs text-muted-foreground" onClick={() => { setStatusFilter("all"); setSearchParams({}); }}>
                <X className="h-3.5 w-3.5" /> Clear filter
              </Button>
            )}
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-36 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {filtered.length === 0 && (
            <Card className="shadow-card">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No complaints found.</p>
              </CardContent>
            </Card>
          )}
          {filtered.map(c => {
            const customer = customers.find(cu => cu.customer_id === c.customer_id);
            const service = services.find(s => s.service_id === c.service_id);
            const tech = technicians.find(t => t.technician_id === c.technician_id);
            const customerCity = customer ? extractCityFromAddress(customer.address) : "";
            const serviceName = service?.name?.toLowerCase() || "";
            
            // Filter technicians: skill matches service AND available
            const skillMatchedTechs = technicians.filter(t => {
              if (!t.is_available) return false;
              if (!t.skill) return false;
              return serviceName.includes(t.skill.toLowerCase()) || t.skill.toLowerCase().includes(serviceName);
            });
            
            // If no skill match, show all available
            const baseTechs = skillMatchedTechs.length > 0 ? skillMatchedTechs : technicians.filter(t => t.is_available);
            
            // Split into nearby and other
            const nearbyTechs = baseTechs.filter(t => isTechnicianNearby(t.area, customerCity));
            const otherTechs = baseTechs.filter(t => !isTechnicianNearby(t.area, customerCity));
            
            const isUrgent = c.priority === "urgent";
            const estTime = getEstimatedResolution(c.priority);
            const companyFromText = extractCompanyFromProblem(c.problem);
            const companySupport = detectCompanySupport(service?.name || "", c.problem);
            const companyName = companyFromText || companySupport.companyName;
            const cleanProblem = getCleanProblem(c.problem);

            return (
              <Card key={c.complaint_id} className={`shadow-card ${isUrgent && c.status !== "closed" ? "border-l-4 border-l-urgent" : ""}`}>
                <CardContent className="pt-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs text-muted-foreground">#{c.complaint_id}</span>
                        <PriorityBadge priority={c.priority || "normal"} />
                        <StatusBadge status={c.status || "open"} />
                        {c.status !== "closed" && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" /> Est: {estTime}
                          </span>
                        )}
                        {isUrgent && c.status !== "closed" && (
                          <span className="flex items-center gap-1 text-xs text-urgent font-medium">
                            <AlertTriangle className="h-3 w-3" /> Urgent
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-foreground">{cleanProblem}</p>
                      {c.ai_summary && (
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                          <Sparkles className="h-3 w-3 text-primary" />
                          <span>AI Summary: {c.ai_summary}</span>
                        </div>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" className="text-destructive shrink-0" onClick={() => handleDelete(c.complaint_id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs text-muted-foreground border-t pt-3 mb-3">
                    <div>
                      <span className="font-medium text-foreground">Customer:</span>{" "}
                      {customer ? `${customer.name} · ${customer.phone}` : "Unknown"}
                    </div>
                    <div>
                      <span className="font-medium text-foreground flex items-center gap-1"><MapPin className="h-3 w-3 text-primary" /> Address:</span>{" "}
                      {customer?.address ? (
                        <span>{customer.address}{customerCity && customerCity !== "Unknown" ? ` (${customerCity})` : ""}</span>
                      ) : "N/A"}
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Company:</span> {companyName}
                      <br />
                      <span className="font-medium text-foreground">Service:</span> {service?.name || "Unknown"}
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Technician:</span>{" "}
                      {tech ? `${tech.name} · ${tech.phone}` : "Not assigned"}
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Created:</span>{" "}
                      {new Date(c.created_at).toLocaleDateString()} {new Date(c.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>

                  {/* Action history */}
                  {(c.action || c.done_at || c.closed_at) && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs text-muted-foreground mb-3">
                      {c.action && <div><span className="font-medium text-foreground">Action:</span> {c.action}</div>}
                      {c.done_at && <div><span className="font-medium text-foreground">Action At:</span> {new Date(c.done_at).toLocaleDateString()}</div>}
                      {c.closed_at && <div><span className="font-medium text-foreground">Closed:</span> {new Date(c.closed_at).toLocaleDateString()}</div>}
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="border-t pt-3 mb-3">
                    <ComplaintTimeline createdAt={c.created_at} technicianAssigned={!!c.technician_id} status={c.status} doneAt={c.done_at} closedAt={c.closed_at} />
                  </div>

                  {/* Actions */}
                  {c.status !== "closed" && (
                    <div className="flex items-center gap-2 flex-wrap border-t pt-3">
                      {!c.technician_id && (
                        <Select onValueChange={v => handleAssign(c.complaint_id, v)}>
                          <SelectTrigger className="w-64 h-8 text-xs"><SelectValue placeholder="Assign Technician" /></SelectTrigger>
                          <SelectContent className="max-h-[200px] overflow-y-auto">
                            {nearbyTechs.length === 0 && otherTechs.length === 0 ? (
                              <div className="px-3 py-2 text-xs text-muted-foreground">No matching technicians available</div>
                            ) : (
                              <>
                                {nearbyTechs.length > 0 && (
                                  <>
                                    <div className="px-3 py-1.5 text-[10px] font-semibold text-primary bg-primary/5 flex items-center gap-1">
                                      <MapPin className="h-3 w-3" /> Nearby Technicians ({customerCity})
                                    </div>
                                    {nearbyTechs.map(t => (
                                      <SelectItem key={t.technician_id} value={String(t.technician_id)}>
                                        📍 {t.name} ({t.skill}{t.area ? ` · ${t.area}` : ""})
                                      </SelectItem>
                                    ))}
                                  </>
                                )}
                                {otherTechs.length > 0 && (
                                  <>
                                    <div className="px-3 py-1.5 text-[10px] font-semibold text-muted-foreground bg-muted/50">
                                      {nearbyTechs.length === 0 ? "No nearby technician available — showing all" : "Other Available Technicians"}
                                    </div>
                                    {otherTechs.map(t => (
                                      <SelectItem key={t.technician_id} value={String(t.technician_id)}>
                                        {t.name} ({t.skill}{t.area ? ` · ${t.area}` : ""})
                                      </SelectItem>
                                    ))}
                                  </>
                                )}
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      )}
                      <Select value={c.status || "open"} onValueChange={v => handleStatusChange(c.complaint_id, v as ComplaintStatus)}>
                        <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                      <ActionDialog complaintId={c.complaint_id} onSave={handleAddAction} />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}

function ActionDialog({ complaintId, onSave }: { complaintId: number; onSave: (id: number, action: string) => void }) {
  const [action, setAction] = useState("");
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 text-xs">Add Action</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Record Action</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Textarea placeholder="Describe the action taken..." value={action} onChange={e => setAction(e.target.value)} />
          <Button onClick={() => { if (!action.trim()) return; onSave(complaintId, action.trim()); setOpen(false); setAction(""); }} className="w-full" disabled={!action.trim()}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
