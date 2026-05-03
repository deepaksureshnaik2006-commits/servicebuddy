import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { SupportCardParams, generateSupportCardPDF } from "@/lib/generateSupportCard";

interface SupportCardPreviewProps {
  open: boolean;
  onClose: () => void;
  params: SupportCardParams | null;
}

const fmtLong = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "";

const fmtShort = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : "";

const FONT = "Arial, Helvetica, sans-serif";
const PAD  = "24px";

/* Section box — replaces divider lines */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      border: "1px solid #e0e0e0",
      borderRadius: "4px",
      padding: "10px 14px",
      marginBottom: "10px",
      fontFamily: FONT,
    }}>
      <div style={{ fontWeight: "bold", fontSize: "12px", color: "#1e1e1e", marginBottom: "8px" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

/* Field row — no border, just clean spacing */
function Field({ label, value, valueColor, italic }: {
  label: string;
  value?: string | null;
  valueColor?: string;
  italic?: boolean;
}) {
  if (!value || value.trim() === "") return null;
  return (
    <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "5px" }}>
      <span style={{ minWidth: "140px", flexShrink: 0, fontSize: "11px", color: "#6e6e6e" }}>{label}</span>
      <span style={{ fontSize: "11px", color: valueColor ?? "#373737", fontStyle: italic ? "italic" : "normal", flex: 1, wordBreak: "break-word" }}>
        {value}
      </span>
    </div>
  );
}

export default function SupportCardPreview({ open, onClose, params }: SupportCardPreviewProps) {
  if (!params) return null;
  const p = params;
  const refNum = `CRM-${String(p.complaintId).padStart(5, "0")}`;

  const status =
    p.status === "closed"
      ? { label: "Resolved",    color: "#16823d", bg: "#f0fdf4", accent: "#86efac", icon: "✅" }
      : p.status === "in_progress"
      ? { label: "In Progress", color: "#a05000", bg: "#fffbeb", accent: "#fcd34d", icon: "🔧" }
      : { label: "Open",        color: "#b41e1e", bg: "#fef2f2", accent: "#fca5a5", icon: "🔴" };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Support Card Preview</DialogTitle>
          <DialogDescription>Preview of your support card document</DialogDescription>
        </DialogHeader>

        <div style={{ background: "#fff", fontFamily: FONT }}>

          {/* ── Top bar: status + download — left-aligned so they don't clash with the dialog's × button ── */}
          <div style={{
            background: status.bg,
            borderBottom: `2px solid ${status.accent}`,
            padding: `10px ${PAD}`,
            display: "flex",
            alignItems: "center",
            gap: "12px",
            paddingRight: "56px",   /* keep clear of the dialog's built-in × button */
          }}>
            <span style={{ fontWeight: "bold", color: status.color, fontSize: "13px", whiteSpace: "nowrap" }}>
              {status.icon}&nbsp;{status.label}
            </span>
            <Button size="sm" onClick={() => generateSupportCardPDF(p)} className="gap-1.5 text-xs shrink-0">
              <Download className="h-3.5 w-3.5" />
              Download PDF
            </Button>
          </div>

          {/* ── Card body: outer border wrapping everything ── */}
          <div style={{ padding: PAD }}>
            <div style={{ border: "1px solid #ccc", padding: "15px", width: "100%", boxSizing: "border-box" }}>

              {/* Company header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "15px", color: "#0a2864" }}>{p.companySupport.companyName}</div>
                  <div style={{ fontSize: "8px", color: "#999", marginTop: "2px" }}>Customer Relationship Management System</div>
                </div>
                <div style={{ fontSize: "10px", color: "#999", textAlign: "right" }}>{fmtLong(p.createdAt)}</div>
              </div>

              {/* Title */}
              <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "14px", color: "#1e1e1e", marginBottom: "8px" }}>
                {p.companySupport.companyName.toUpperCase()}&nbsp;&nbsp;SUPPORT CARD
              </div>

              {/* Gray banner */}
              <div style={{ background: "#eeeef2", padding: "6px", textAlign: "center", fontWeight: "bold", fontSize: "10px", color: "#1e1e1e", marginBottom: "10px" }}>
                SERVICE COMPLAINT RECORD
              </div>

              {/* Reference */}
              <div style={{ marginBottom: "12px" }}>
                <div style={{ fontWeight: "bold", fontSize: "11px", color: "#1e1e1e" }}>ID REFERENCE NUMBER</div>
                <div style={{ fontSize: "10px", color: "#888", marginTop: "2px" }}>
                  {refNum}&nbsp;&nbsp;•&nbsp;&nbsp;Complaint #{p.complaintId}
                </div>
              </div>

              {/* Customer Details */}
              <Section title="Customer Details">
                <Field label="Full Name"    value={p.customerName} />
                <Field label="Phone Number" value={p.customerPhone} />
                <Field label="Address"      value={p.customerLocation && p.customerLocation !== "Unknown" ? p.customerLocation : "Not provided"} />
              </Section>

              {/* Service Details */}
              <Section title="Service Details">
                <Field label="Service Type"        value={p.serviceType} />
                <Field label="Problem Description" value={p.problemText} />
              </Section>

              {/* Complaint Status */}
              <Section title="Complaint Status">
                <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "5px" }}>
                  <span style={{ minWidth: "140px", flexShrink: 0, fontSize: "11px", color: "#6e6e6e" }}>Current Status</span>
                  <span style={{ fontSize: "11px", fontWeight: "bold", color: status.color }}>{status.label}</span>
                </div>
                <Field label="Date Submitted" value={fmtShort(p.createdAt) || undefined} />
                {fmtShort(p.closedAt) && <Field label="Date Resolved" value={fmtShort(p.closedAt)} />}
              </Section>

              {/* Technician Details */}
              <Section title="Technician Details">
                {p.technicianName ? (
                  <>
                    <Field label="Technician Name" value={p.technicianName} />
                    <Field label="Contact Number"  value={p.technicianPhone || "Not available"} />
                  </>
                ) : (
                  <div style={{ fontSize: "11px", color: "#888", fontStyle: "italic" }}>
                    No technician has been assigned to this complaint yet.
                  </div>
                )}
              </Section>

              {/* Company Support Contact */}
              <Section title="Company Support Contact">
                <Field label="Company Name"  value={p.companySupport.companyName} />
                <Field label="Phone Number"  value={p.companySupport.phone} />
                <Field label="Website"       value={p.companySupport.website} />
                {p.companySupport.email && <Field label="Email Address" value={p.companySupport.email} />}
              </Section>

              {/* Notice (unresolved only) */}
              {(p.status === "open" || p.status === "in_progress") && (
                <div style={{
                  marginTop: "2px",
                  background: "#f8f8fa",
                  border: "1px solid #d2d4d8",
                  borderLeft: "4px solid #0a2864",
                  borderRadius: "2px",
                  padding: "10px 14px",
                }}>
                  <div style={{ fontWeight: "bold", fontSize: "10px", color: "#1e1e1e", marginBottom: "5px" }}>NOTICE</div>
                  <div style={{ fontSize: "10px", color: "#646464", lineHeight: "1.6" }}>
                    This complaint is not yet resolved. Please contact the company directly using the support details provided above for further assistance.
                  </div>
                </div>
              )}

              {/* Footer */}
              <div style={{ marginTop: "16px", paddingTop: "8px", borderTop: "1px solid #e0e0e0", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "8px", color: "#aaa" }}>Customer Relationship Management System  •  Official Service Document</span>
                <span style={{ fontSize: "8px", color: "#aaa" }}>1</span>
              </div>

            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
