import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Complaint, Customer, Service, Technician } from "@/lib/types";
import { api } from "@/lib/api";

interface DataContextType {
  complaints: Complaint[];
  customers: Customer[];
  services: Service[];
  technicians: Technician[];
  loading: boolean;
  refreshAll: () => Promise<void>;
  addComplaint: (c: { customer_id: number; service_id: number; problem: string; ai_summary: string | null; priority: string }) => Promise<void>;
  updateComplaint: (id: number, updates: Partial<Complaint>) => Promise<void>;
  deleteComplaint: (id: number) => Promise<void>;
  assignTechnician: (complaintId: number, technicianId: number) => Promise<void>;
  addCustomer: (c: { name: string; phone: string; address: string; password: string }) => Promise<number>;
  deleteCustomer: (id: number) => Promise<void>;
  addService: (name: string) => Promise<void>;
  updateService: (id: number, name: string) => Promise<void>;
  deleteService: (id: number) => Promise<void>;
  addTechnician: (t: { name: string; phone: string; skill: string; area: string; is_available: boolean }) => Promise<void>;
  updateTechnician: (id: number, updates: Partial<Technician>) => Promise<void>;
  deleteTechnician: (id: number) => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshAll = useCallback(async () => {
    const data = await api.get<{
      complaints: Complaint[];
      customers: Customer[];
      services: Service[];
      technicians: Technician[];
    }>("/api/bootstrap");
    setComplaints(data.complaints);
    setCustomers(data.customers);
    setServices(data.services);
    setTechnicians(data.technicians);
    setLoading(false);
  }, []);

  useEffect(() => { refreshAll(); }, [refreshAll]);

  const addComplaint = async (c: { customer_id: number; service_id: number; problem: string; ai_summary: string | null; priority: string }) => {
    await api.post("/api/complaints", c);
    await refreshAll();
  };

  const updateComplaint = async (id: number, updates: Partial<Complaint>) => {
    const complaint = complaints.find(c => c.complaint_id === id);
    const dbUpdates: {
      status?: "open" | "in_progress" | "closed";
      action?: string | null;
      technician_id?: number | null;
      closed_at?: string | null;
      done_at?: string | null;
    } = {};
    if (updates.status !== undefined) dbUpdates.status = updates.status as any;
    if (updates.action !== undefined) {
      dbUpdates.action = updates.action;
      dbUpdates.done_at = new Date().toISOString();
    }
    if (updates.technician_id !== undefined) dbUpdates.technician_id = updates.technician_id;
    if (updates.status === "closed") {
      dbUpdates.closed_at = new Date().toISOString();
      dbUpdates.done_at = new Date().toISOString();
    }
    await api.patch(`/api/complaints/${id}`, dbUpdates);
    await refreshAll();
  };

  const deleteComplaint = async (id: number) => {
    await api.delete(`/api/complaints/${id}`);
    await refreshAll();
  };

  const assignTechnician = async (complaintId: number, technicianId: number) => {
    // Check technician availability
    const tech = technicians.find(t => t.technician_id === technicianId);
    if (tech && tech.is_available === false) {
      throw new Error("This technician is currently unavailable");
    }
    await api.post(`/api/complaints/${complaintId}/assign`, { technician_id: technicianId });
    await refreshAll();
  };

  const addCustomer = async (c: { name: string; phone: string; address: string; password: string }): Promise<number> => {
    const data = await api.post<{ customer_id: number }>("/api/customers", c);
    await refreshAll();
    return data.customer_id;
  };

  const deleteCustomer = async (id: number) => {
    await api.delete(`/api/customers/${id}`);
    await refreshAll();
  };

  const addService = async (name: string) => {
    await api.post("/api/services", { name });
    await refreshAll();
  };
  const updateService = async (id: number, name: string) => {
    await api.patch(`/api/services/${id}`, { name });
    await refreshAll();
  };
  const deleteService = async (id: number) => {
    await api.delete(`/api/services/${id}`);
    await refreshAll();
  };

  const addTechnician = async (t: { name: string; phone: string; skill: string; area: string; is_available: boolean }) => {
    await api.post("/api/technicians", t);
    await refreshAll();
  };
  const updateTechnician = async (id: number, updates: Partial<Technician>) => {
    await api.patch(`/api/technicians/${id}`, updates);
    await refreshAll();
  };
  const deleteTechnician = async (id: number) => {
    await api.delete(`/api/technicians/${id}`);
    await refreshAll();
  };

  return (
    <DataContext.Provider value={{
      complaints, customers, services, technicians, loading,
      refreshAll, addComplaint, updateComplaint, deleteComplaint, assignTechnician,
      addCustomer, deleteCustomer, addService, updateService, deleteService,
      addTechnician, updateTechnician, deleteTechnician,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
