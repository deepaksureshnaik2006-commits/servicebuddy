import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import CustomerLayout from "@/components/CustomerLayout";
import { Card, CardContent } from "@/components/ui/card";
import { PriorityBadge, StatusBadge } from "@/components/StatusBadges";
import { Sparkles, Phone, ExternalLink, MapPin, X, Eye } from "lucide-react";
import ComplaintTimeline from "@/components/ComplaintTimeline";
import { getEstimatedResolution } from "@/lib/smartMessages";
import { Button } from "@/components/ui/button";
import { detectCompanySupport } from "@/lib/supportCardData";
import { SupportCardParams } from "@/lib/generateSupportCard";
import { extractCompanyFromProblem, getCleanProblem } from "@/lib/companyMapping";
import { extractCityFromAddress } from "@/lib/locationUtils";
import { useSearchParams, useNavigate } from "react-router-dom";
import SupportCardPreview from "@/components/SupportCardPreview";

export default function ComplaintHistory() {
  const { customerId } = useAuth();
  const { complaints, services, technicians, customers, updateComplaint } = useData();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const statusParam = searchParams.get("status");

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewParams, setPreviewParams] = useState<SupportCardParams | null>(null);

  const customer = customers.find(c => c.customer_id === customerId);
  const customerCity = customer ? extractCityFromAddress(customer.address) : "";
  const allMyComplaints = complaints.filter(c => c.customer_id === customerId);
  const myComplaints = statusParam
    ? allMyComplaints.filter(c => c.status === statusParam)
    : allMyComplaints;

  const buildSupportCardParams = (complaint: typeof myComplaints[0]): SupportCardParams => {
    const service = services.find(s => s.service_id === complaint.service_id);
    const tech = technicians.find(t => t.technician_id === complaint.technician_id);
    const companySupport = detectCompanySupport(service?.name || "", complaint.problem);
    return {
      complaintId: complaint.complaint_id,
      companySupport,
      serviceType: service?.name || "Unknown",
      problemText: getCleanProblem(complaint.problem),
      aiSummary: complaint.ai_summary || null,
      technicianName: tech?.name || null,
      technicianPhone: tech?.phone || null,
      status: complaint.status || "open",
      createdAt: complaint.created_at,
      closedAt: complaint.closed_at || null,
      customerName: customer?.name,
      customerPhone: customer?.phone,
      customerLocation: customer?.address && customer.address !== "Unknown"
        ? customer.address
        : customerCity,
    };
  };

  const handlePreviewSupportCard = (complaint: typeof myComplaints[0]) => {
    setPreviewParams(buildSupportCardParams(complaint));
    setPreviewOpen(true);
  };

  const handleContactCompany = async (complaint: typeof myComplaints[0]) => {
    const service = services.find(s => s.service_id === complaint.service_id);
    const companySupport = detectCompanySupport(service?.name || "", complaint.problem);
    window.open(companySupport.website, "_blank");
    try {
      await updateComplaint(complaint.complaint_id, {
        action: "Customer contacted company support due to unresolved issue",
      });
    } catch { /* silent */ }
  };

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Complaint History</h2>
            <p className="text-muted-foreground text-sm mt-1">Track all your submitted complaints</p>
          </div>
          {statusParam && (
            <Button variant="outline" size="sm" className="gap-1.5 capitalize" onClick={() => navigate("/customer/history")}>
              <X className="h-3.5 w-3.5" />
              Showing: {statusParam.replace("_", " ")}
            </Button>
          )}
        </div>

        {myComplaints.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No complaints found. Submit your first complaint!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {myComplaints.map(c => {
              const service = services.find(s => s.service_id === c.service_id);
              const tech = technicians.find(t => t.technician_id === c.technician_id);
              const isUrgent = c.priority === "urgent" && c.status !== "closed";
              const showActions = c.status !== "closed";
              const companyFromText = extractCompanyFromProblem(c.problem);
              const companySupport = detectCompanySupport(service?.name || "", c.problem);
              const companyName = companyFromText || companySupport.companyName;
              const cleanProblem = getCleanProblem(c.problem);

              return (
                <Card key={c.complaint_id} className={`shadow-card ${isUrgent ? "border-l-4 border-l-urgent" : ""}`}>
                  <CardContent className="pt-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">#{c.complaint_id} · {service?.name} · {companyName}</p>
                        <p className="text-sm font-medium text-foreground mt-1">{cleanProblem}</p>
                        {customer?.address && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-primary font-medium bg-primary/10 px-1.5 py-0.5 rounded-full mt-1">
                            <MapPin className="h-2.5 w-2.5" /> {customer.address}{customerCity && customerCity !== "Unknown" ? ` / ${customerCity}` : ""}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4 shrink-0 flex-wrap justify-end">
                        <PriorityBadge priority={c.priority || "normal"} />
                        <StatusBadge status={c.status || "open"} />
                        {c.status !== "closed" && (
                          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                            ⏱ Est: {getEstimatedResolution(c.priority)}
                          </span>
                        )}
                      </div>
                    </div>

                    {c.ai_summary && (
                      <div className="flex items-center gap-1.5 mb-3 text-xs text-muted-foreground">
                        <Sparkles className="h-3 w-3 text-primary" />
                        <span>AI Summary: {c.ai_summary}</span>
                      </div>
                    )}

                    {tech && c.status !== "closed" && (
                      <div className="text-xs px-3 py-2.5 rounded-md bg-primary/10 border border-primary/20 mb-2 text-primary font-semibold">
                        📞 Technician: {tech.name} — Contact: {tech.phone}
                      </div>
                    )}
                    {c.priority === "urgent" && c.status !== "closed" && (
                      <div className="text-xs px-3 py-2.5 rounded-md bg-red-50 border border-red-200 mb-2 text-red-700 font-semibold">
                        ⚠️ Urgent complaint — prioritized for immediate attention
                      </div>
                    )}
                    {showActions && (
                      <div className="text-xs px-3 py-2.5 rounded-md bg-blue-50 border border-blue-200 mb-2 text-blue-800 font-medium">
                        🏢 Company: {companyName} — {companySupport.phone}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {showActions && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs gap-1.5 font-semibold border-primary/30 text-primary hover:bg-primary/10"
                          onClick={() => handleContactCompany(c)}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Contact Company
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs gap-1.5 font-semibold"
                        onClick={() => handlePreviewSupportCard(c)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Preview Card
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-muted-foreground border-t pt-3 mb-3">
                      <div>
                        <span className="font-medium text-foreground">Technician:</span>{" "}
                        {tech ? (
                          <span>{tech.name} ({tech.area})<br /><Phone className="inline h-3 w-3" /> {tech.phone}</span>
                        ) : "Not assigned yet"}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Submitted:</span>{" "}
                        {new Date(c.created_at).toLocaleDateString()} {new Date(c.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                      <div><span className="font-medium text-foreground">Action:</span> {c.action || "Pending"}</div>
                      <div><span className="font-medium text-foreground">Closed:</span> {c.closed_at ? `${new Date(c.closed_at).toLocaleDateString()} ${new Date(c.closed_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "—"}</div>
                    </div>

                    <div className="border-t pt-3">
                      <ComplaintTimeline
                        createdAt={c.created_at}
                        technicianAssigned={!!c.technician_id}
                        status={c.status}
                        doneAt={c.done_at}
                        closedAt={c.closed_at}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <SupportCardPreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        params={previewParams}
      />
    </CustomerLayout>
  );
}
