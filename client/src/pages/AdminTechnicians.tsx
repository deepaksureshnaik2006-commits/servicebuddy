import { useState } from "react";
import { useData } from "@/context/DataContext";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Phone, MapPin, Wrench, Building2 } from "lucide-react";
import { toast } from "sonner";
import { getCompaniesForSkill } from "@/lib/companyMapping";

export default function AdminTechnicians() {
  const { technicians, addTechnician, updateTechnician, deleteTechnician, complaints } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", skill: "", area: "", is_available: true });

  const resetForm = () => { setForm({ name: "", phone: "", skill: "", area: "", is_available: true }); setEditing(null); };

  const handleSave = async () => {
    if (!form.name || !form.phone || !form.skill) {
      toast.error("Please fill required fields");
      return;
    }
    if (editing) {
      await updateTechnician(editing, form);
      toast.success("Technician updated");
    } else {
      await addTechnician(form);
      toast.success("Technician added");
    }
    setDialogOpen(false);
    resetForm();
  };

  const openEdit = (id: number) => {
    const t = technicians.find(t => t.technician_id === id)!;
    setForm({ name: t.name, phone: t.phone, skill: t.skill || "", area: t.area || "", is_available: t.is_available ?? true });
    setEditing(id);
    setDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Technicians ({technicians.length})</h2>
          <Dialog open={dialogOpen} onOpenChange={o => { setDialogOpen(o); if (!o) resetForm(); }}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />Add Technician</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Technician</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2"><Label>Name *</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Phone *</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Skill *</Label><Input placeholder="e.g. AC Repair" value={form.skill} onChange={e => setForm(f => ({ ...f, skill: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Area</Label><Input placeholder="e.g. Downtown" value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} /></div>
                <div className="flex items-center gap-2">
                  <Switch checked={form.is_available} onCheckedChange={v => setForm(f => ({ ...f, is_available: v }))} />
                  <Label>Available</Label>
                </div>
                <Button onClick={handleSave} className="w-full">Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[520px] overflow-y-auto pr-2">
          {technicians.map(t => {
            const activeCount = complaints.filter(c => c.technician_id === t.technician_id && c.status !== "closed").length;
            const supportedCompanies = getCompaniesForSkill(t.skill);
            return (
              <Card key={t.technician_id} className="shadow-card premium-hover border-teal-100 overflow-hidden">
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-foreground">{t.name}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{t.phone}</span>
                      </div>
                    </div>
                    <Badge className={t.is_available ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}>
                      {t.is_available ? "Available" : "Busy"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1"><Wrench className="h-3 w-3" />{t.skill}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{t.area}</span>
                  </div>
                  {/* Supported Companies */}
                  {supportedCompanies.length > 0 && (
                    <div className="flex items-start gap-1.5 text-xs text-muted-foreground mb-3">
                      <Building2 className="h-3 w-3 mt-0.5 shrink-0" />
                      <span className="flex flex-wrap gap-1">
                        {supportedCompanies.map(c => (
                          <Badge key={c} variant="outline" className="text-[10px] px-1.5 py-0">{c}</Badge>
                        ))}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between border-t pt-3">
                    <span className="text-xs text-muted-foreground">{activeCount} active job{activeCount !== 1 ? "s" : ""}</span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(t.technician_id)} data-testid={`button-edit-technician-${t.technician_id}`}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={async () => { await deleteTechnician(t.technician_id); toast.success("Technician removed"); }} data-testid={`button-delete-technician-${t.technician_id}`}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
