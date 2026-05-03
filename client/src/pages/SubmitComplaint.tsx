import { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import CustomerLayout from "@/components/CustomerLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { detectPriority } from "@/lib/priority";
import { PriorityBadge } from "@/components/StatusBadges";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Sparkles, Send, AlertTriangle } from "lucide-react";
import { COMPANY_BRANDS, skillToCompanies } from "@/lib/companyMapping";

function generateSummary(text: string): string {
  const keywords: string[] = [];
  const checks = [
    { words: ["cool", "cooling"], label: "Cooling issue" },
    { words: ["leak", "leaking", "drip", "water"], label: "Leakage" },
    { words: ["noise", "loud", "sound"], label: "Noise problem" },
    { words: ["not working", "stopped", "dead"], label: "Not functioning" },
    { words: ["spark", "sparking", "shock"], label: "Electrical hazard" },
    { words: ["smell", "odor", "burning"], label: "Burning smell" },
    { words: ["install", "installation", "setup"], label: "Installation needed" },
    { words: ["maintenance", "service", "checkup"], label: "Maintenance required" },
    { words: ["clog", "blocked", "drain"], label: "Blockage issue" },
    { words: ["spin", "rotation", "motor"], label: "Motor/spin issue" },
    { words: ["gas"], label: "Gas leakage" },
    { words: ["heat", "heating", "hot"], label: "Heating issue" },
    { words: ["vibrat"], label: "Vibration problem" },
    { words: ["display", "screen"], label: "Display issue" },
    { words: ["remote", "control"], label: "Remote/control issue" },
  ];
  const lower = text.toLowerCase();
  for (const c of checks) {
    if (c.words.some(w => lower.includes(w))) keywords.push(c.label);
  }
  return keywords.length > 0 ? keywords.join(", ") : text.slice(0, 60) + (text.length > 60 ? "..." : "");
}

function getCompaniesForServiceName(serviceName: string): string[] {
  const lower = serviceName.toLowerCase();
  for (const [key, brands] of Object.entries(skillToCompanies)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return brands;
    }
  }
  // Partial keyword match
  for (const [key, brands] of Object.entries(skillToCompanies)) {
    const words = lower.split(/\s+/);
    if (words.some(w => key.toLowerCase().includes(w) && w.length > 2)) {
      return brands;
    }
  }
  return COMPANY_BRANDS;
}

export default function SubmitComplaint() {
  const { customerId } = useAuth();
  const { services, addComplaint } = useData();
  const navigate = useNavigate();

  const [serviceId, setServiceId] = useState("");
  const [company, setCompany] = useState("");
  const [problem, setProblem] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const priority = problem.length > 5 ? detectPriority(problem) : "normal";
  const summary = problem.length > 10 ? generateSummary(problem) : "";

  const selectedService = services.find(s => s.service_id === Number(serviceId));

  const availableCompanies = useMemo(() => {
    if (!selectedService) return COMPANY_BRANDS;
    return getCompaniesForServiceName(selectedService.name);
  }, [selectedService]);

  const handleServiceChange = (val: string) => {
    setServiceId(val);
    setCompany("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceId) {
      toast.error("Please select a service type");
      return;
    }
    if (!problem.trim() || problem.trim().length < 10) {
      toast.error("Please describe your problem in at least 10 characters");
      return;
    }
    setSubmitting(true);
    try {
      const fullProblem = company ? `[${company}] ${problem.trim()}` : problem.trim();
      await addComplaint({
        customer_id: customerId!,
        service_id: Number(serviceId),
        problem: fullProblem,
        ai_summary: summary || null,
        priority,
      });
      toast.success("Complaint submitted successfully!");
      navigate("/customer/history");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit complaint");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CustomerLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Submit a Complaint</h2>
          <p className="text-muted-foreground text-sm mt-1">Describe your issue and we'll get it resolved</p>
        </div>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label>Service Type <span className="text-destructive">*</span></Label>
                <Select value={serviceId} onValueChange={handleServiceChange}>
                  <SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {services.map(s => (
                      <SelectItem key={s.service_id} value={String(s.service_id)}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  Company / Brand
                  {selectedService && (
                    <span className="ml-2 text-xs text-primary font-normal">
                      Showing brands for: {selectedService.name}
                    </span>
                  )}
                </Label>
                <Select value={company} onValueChange={setCompany}>
                  <SelectTrigger>
                    <SelectValue placeholder={serviceId ? "Select your brand" : "Select a service first"} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {availableCompanies.map(b => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Problem Description <span className="text-destructive">*</span></Label>
                <Textarea
                  placeholder="Describe your issue in detail (minimum 10 characters)..."
                  value={problem}
                  onChange={e => setProblem(e.target.value)}
                  rows={5}
                  required
                  minLength={10}
                />
                <p className="text-xs text-muted-foreground">{problem.length} characters</p>
              </div>

              {problem.length > 10 && (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-muted/50 border">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">AI Summary</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{summary}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Auto-detected priority:</span>
                    <PriorityBadge priority={priority} />
                  </div>
                  {priority === "urgent" && (
                    <div className="flex items-center gap-2 text-xs text-urgent font-medium p-2 rounded-md bg-urgent/10">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      This will be flagged as urgent for immediate attention
                    </div>
                  )}
                </div>
              )}

              <Button type="submit" className="w-full gap-2" disabled={submitting}>
                <Send className="h-4 w-4" />
                {submitting ? "Submitting..." : "Submit Complaint"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
}
