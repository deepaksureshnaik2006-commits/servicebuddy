import { Badge } from "@/components/ui/badge";
import { Priority, ComplaintStatus } from "@/lib/types";

export function PriorityBadge({ priority }: { priority: Priority }) {
  const styles: Record<Priority, string> = {
    urgent: "bg-urgent text-urgent-foreground",
    normal: "bg-primary text-primary-foreground",
    low: "bg-muted text-muted-foreground",
  };
  return <Badge className={styles[priority]}>{priority}</Badge>;
}

export function StatusBadge({ status }: { status: ComplaintStatus }) {
  const styles: Record<ComplaintStatus, string> = {
    open: "bg-warning text-warning-foreground",
    in_progress: "bg-primary text-primary-foreground",
    closed: "bg-success text-success-foreground",
  };
  const labels: Record<ComplaintStatus, string> = {
    open: "Open",
    in_progress: "In Progress",
    closed: "Closed",
  };
  return <Badge className={styles[status]}>{labels[status]}</Badge>;
}
