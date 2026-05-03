export type Priority = "low" | "normal" | "urgent";
export type ComplaintStatus = "open" | "in_progress" | "closed";

export interface Customer {
  customer_id: number;
  name: string;
  phone: string;
  address: string;
  password?: string;
  created_at: string;
}

export interface Service {
  service_id: number;
  name: string;
}

export interface Technician {
  technician_id: number;
  name: string;
  phone: string;
  skill: string | null;
  area: string | null;
  is_available: boolean | null;
}

export interface Complaint {
  complaint_id: number;
  customer_id: number;
  service_id: number;
  technician_id: number | null;
  problem: string;
  ai_summary: string | null;
  priority: Priority | null;
  status: ComplaintStatus | null;
  action: string | null;
  done_at: string | null;
  created_at: string;
  closed_at: string | null;
  // joined
  customer?: Customer;
  service?: Service;
  technician?: Technician;
}

export interface Admin {
  admin_id: number;
  username: string;
}

export type UserRole = "admin" | "customer";

export interface AuthState {
  role: UserRole | null;
  customerId: number | null;
  adminId: number | null;
}
