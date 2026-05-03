import { Priority, ComplaintStatus } from "./types";

export function getSmartMessage(priority: Priority | null, status: ComplaintStatus | null, aiSummary: string | null): string | null {
  if (priority === "urgent" && status === "open") {
    return "⚠️ This complaint is urgent and requires immediate attention!";
  }
  if (priority === "urgent" && status === "in_progress") {
    return "🔧 Urgent complaint is being handled — monitor closely.";
  }
  if (status === "closed") {
    return "✅ This complaint has been resolved successfully.";
  }
  if (status === "open" && (!priority || priority === "normal")) {
    return "📋 Awaiting review — assign a technician to begin resolution.";
  }
  if (priority === "low") {
    return "📌 Low priority — can be addressed during routine maintenance.";
  }
  return null;
}

export function getEstimatedResolution(priority: Priority | null): string {
  switch (priority) {
    case "urgent": return "~2 hours";
    case "normal": return "~24 hours";
    case "low": return "~48 hours";
    default: return "~24 hours";
  }
}

export function getCloseSuggestion(status: ComplaintStatus | null, action: string | null, techAssigned: boolean): string | null {
  if (status === "closed") return null;
  if (status === "in_progress" && action) {
    return "💡 Action has been recorded. If the issue is resolved, you can close this complaint.";
  }
  if (status === "in_progress" && !action) {
    return "💡 Technician is assigned. Record the action taken before closing.";
  }
  if (status === "open" && !techAssigned) {
    return "💡 Assign a technician first to begin resolving this complaint.";
  }
  return null;
}
