import { CheckCircle, Circle, Clock } from "lucide-react";

interface TimelineProps {
  createdAt: string;
  technicianAssigned: boolean;
  status: string | null;
  doneAt: string | null;
  closedAt: string | null;
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ComplaintTimeline({ createdAt, technicianAssigned, status, doneAt, closedAt }: TimelineProps) {
  const steps = [
    { label: "Created", time: formatDateTime(createdAt), done: true },
    { label: "Assigned", time: technicianAssigned ? (doneAt ? formatDateTime(doneAt) : "Yes") : null, done: technicianAssigned },
    { label: "In Progress", time: status === "in_progress" || status === "closed" ? "Active" : null, done: status === "in_progress" || status === "closed" },
    { label: "Completed", time: closedAt ? formatDateTime(closedAt) : null, done: status === "closed" },
  ];

  return (
    <div className="flex items-center gap-1 text-xs">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center gap-1">
          {i > 0 && <div className={`w-6 h-px ${step.done ? "bg-success" : "bg-border"}`} />}
          <div className="flex items-center gap-1">
            {step.done ? (
              <CheckCircle className="h-3.5 w-3.5 text-success shrink-0" />
            ) : (
              <Circle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            )}
            <div className="flex flex-col">
              <span className={step.done ? "text-foreground font-medium" : "text-muted-foreground"}>{step.label}</span>
              {step.time && <span className="text-muted-foreground text-[10px]">{step.time}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
