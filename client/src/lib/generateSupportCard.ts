import jsPDF from "jspdf";
import { CompanySupport } from "./supportCardData";

export interface SupportCardParams {
  complaintId: number;
  companySupport: CompanySupport;
  serviceType: string;
  problemText: string;
  aiSummary?: string | null;
  technicianName: string | null;
  technicianPhone?: string | null;
  status: string;
  createdAt: string;
  closedAt?: string | null;
  customerName?: string;
  customerPhone?: string;
  customerLocation?: string;
}

export function generateSupportCardPDF(p: SupportCardParams) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pw  = doc.internal.pageSize.getWidth();
  const ph  = doc.internal.pageSize.getHeight();

  // ── Palette ────────────────────────────────────────────────────
  const INK    : [number,number,number] = [30,  30,  30 ];
  const LABEL  : [number,number,number] = [100, 100, 100];
  const VALUE  : [number,number,number] = [55,  55,  55 ];
  const GRAY_BG: [number,number,number] = [238, 239, 242];
  const WHITE  : [number,number,number] = [255, 255, 255];
  const BLUE   : [number,number,number] = [10,  40,  100];
  const OUTER_STROKE: [number,number,number] = [180, 180, 180]; // #ccc
  const SECT_STROKE : [number,number,number] = [200, 200, 200]; // #e0e0e0

  const STATUS = p.status === "closed"
    ? { label: "Resolved",    color: [22,  130, 65 ] as [number,number,number] }
    : p.status === "in_progress"
    ? { label: "In Progress", color: [160, 80,  0  ] as [number,number,number] }
    : { label: "Open",        color: [180, 30,  30 ] as [number,number,number] };

  const fmtShort = (d?: string | null) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : null;
  const fmtLong = (d?: string | null) =>
    d ? new Date(d).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "";

  // ── Layout ─────────────────────────────────────────────────────
  const L   = 15;        // page left margin
  const R   = pw - 15;   // page right margin
  const W   = R - L;     // total content width

  const OP  = 5;         // outer-box padding (mm)
  const SP  = 3.5;       // section inner padding (mm)
  const OL  = L + OP;    // content left inside outer box
  const OW  = W - 2*OP;  // content width inside outer box
  const CL  = OL + SP;   // content left inside section box
  const CW  = OW - 2*SP; // content width inside section box
  const VX  = CL + 52;   // value-column x

  doc.setFillColor(...WHITE);
  doc.rect(0, 0, pw, ph, "F");

  let y = 15;

  // ── Company header (above outer box) ─────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...BLUE);
  doc.text(p.companySupport.companyName, L, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(...LABEL);
  doc.text("Customer Relationship Management System", L, y + 4.5);

  doc.setFontSize(8.5);
  doc.text(fmtLong(p.createdAt), R, y, { align: "right" });

  y += 12;

  // ── Outer box starts ─────────────────────────────────────────
  const outerTop = y;
  y += OP; // top padding inside outer box

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13.5);
  doc.setTextColor(...INK);
  doc.text(`${p.companySupport.companyName.toUpperCase()}  SUPPORT CARD`, pw / 2, y + 5, { align: "center" });
  y += 12;

  // Gray record banner
  doc.setFillColor(...GRAY_BG);
  doc.rect(OL, y, OW, 9, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...INK);
  doc.text("SERVICE COMPLAINT RECORD", pw / 2, y + 5.8, { align: "center" });
  y += 13;

  // Reference number (no section box, just spaced text)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(...INK);
  doc.text("ID REFERENCE NUMBER", CL, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...LABEL);
  doc.text(`CRM-${String(p.complaintId).padStart(5, "0")}   •   Complaint #${p.complaintId}`, CL, y);
  y += 8;

  // ── Section helpers ───────────────────────────────────────────
  // We collect rect data and draw borders after all text is placed.
  const sectionRects: [number, number, number, number][] = [];

  const beginSection = () => { const top = y; y += SP + 2; return top; };
  const endSection   = (top: number) => {
    y += SP;
    sectionRects.push([OL, top, OW, y - top]);
    y += 3.5; // gap between sections
  };

  const sHead = (title: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...INK);
    doc.text(title, CL, y);
    y += 6;
  };

  // No divider lines — fields are separated only by vertical spacing
  const field = (label: string, value: string | null | undefined) => {
    if (!value || value.trim() === "") return;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...LABEL);
    doc.text(label, CL, y);
    doc.setTextColor(...VALUE);
    const lines = doc.splitTextToSize(value, R - VX - OP - SP);
    doc.text(lines, VX, y);
    y += lines.length * 5.2 + 2.5; // spacing between fields (no rule needed)
  };

  // ── Customer Details ──────────────────────────────────────────
  let top = beginSection();
  sHead("Customer Details");
  field("Full Name",     p.customerName);
  field("Phone Number",  p.customerPhone);
  field("Address",
    p.customerLocation && p.customerLocation !== "Unknown"
      ? p.customerLocation : "Not provided");
  endSection(top);

  // ── Service Details ───────────────────────────────────────────
  top = beginSection();
  sHead("Service Details");
  field("Service Type",        p.serviceType);
  field("Problem Description", p.problemText);
  endSection(top);

  // ── Complaint Status ──────────────────────────────────────────
  top = beginSection();
  sHead("Complaint Status");
  // Status row (coloured value)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...LABEL);
  doc.text("Current Status", CL, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...STATUS.color);
  doc.text(STATUS.label, VX, y);
  y += 7.7;
  field("Date Submitted", fmtShort(p.createdAt));
  if (fmtShort(p.closedAt)) field("Date Resolved", fmtShort(p.closedAt));
  endSection(top);

  // ── Technician Details ────────────────────────────────────────
  top = beginSection();
  sHead("Technician Details");
  if (p.technicianName) {
    field("Technician Name", p.technicianName);
    field("Contact Number",  p.technicianPhone || "Not available");
  } else {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(...LABEL);
    doc.text("No technician has been assigned to this complaint yet.", CL, y);
    y += 6;
  }
  endSection(top);

  // ── Company Support Contact ───────────────────────────────────
  top = beginSection();
  sHead("Company Support Contact");
  field("Company Name",  p.companySupport.companyName);
  field("Phone Number",  p.companySupport.phone);
  field("Website",       p.companySupport.website);
  if (p.companySupport.email) field("Email Address", p.companySupport.email);
  endSection(top);

  // Close outer box (add bottom padding then draw border)
  y += OP;
  const outerH = y - outerTop;

  // ── Draw all borders (after text, so borders render over white space only) ──
  // Outer border: 1px solid #ccc
  doc.setDrawColor(...OUTER_STROKE);
  doc.setLineWidth(0.35);
  doc.rect(L, outerTop, W, outerH, "S");

  // Section borders: 1px solid #e0e0e0
  doc.setDrawColor(...SECT_STROKE);
  doc.setLineWidth(0.25);
  for (const [rx, ry, rw, rh] of sectionRects) {
    doc.rect(rx, ry, rw, rh, "S");
  }

  // ── Footer constants (fixed at bottom) ───────────────────────
  const FOOTER_LINE_Y = ph - 18; // separator line
  const FOOTER_TEXT_Y = ph - 13; // text baseline

  y += 5;

  // ── Notice (unresolved only) ──────────────────────────────────
  if (p.status === "open" || p.status === "in_progress") {
    const msg =
      "This complaint is not yet resolved. Please contact the company directly using " +
      "the support details provided above for further assistance.";
    const lines = doc.splitTextToSize(msg, W - 8);
    const bH = lines.length * 5.5 + 12;

    // Clamp so notice never overlaps the footer
    const maxNoticeY = FOOTER_LINE_Y - bH - 4;
    if (y > maxNoticeY) y = maxNoticeY;

    doc.setFillColor(248, 248, 250);
    doc.setDrawColor(210, 212, 216);
    doc.setLineWidth(0.25);
    doc.rect(L, y, W, bH, "FD");

    doc.setFillColor(...BLUE);
    doc.rect(L, y, 3, bH, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...INK);
    doc.text("NOTICE", L + 7, y + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...LABEL);
    doc.text(lines, L + 7, y + 11);
  }

  // ── Footer ────────────────────────────────────────────────────
  doc.setFillColor(210, 212, 216);
  doc.rect(L, FOOTER_LINE_Y, W, 0.25, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(...LABEL);
  doc.text("Customer Relationship Management System  •  Official Service Document", L, FOOTER_TEXT_Y);
  doc.setFontSize(8);
  doc.text("1", R, FOOTER_TEXT_Y, { align: "right" });

  doc.save(`Support_Card_CRM-${String(p.complaintId).padStart(5, "0")}.pdf`);
}
