import { useState } from "react";
import { useData } from "@/context/DataContext";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Wrench } from "lucide-react";
import { toast } from "sonner";

export default function AdminServices() {
  const { services, addService, updateService, deleteService, complaints } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [name, setName] = useState("");

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Service name required"); return; }
    if (editing) {
      await updateService(editing, name.trim());
      toast.success("Service updated");
    } else {
      await addService(name.trim());
      toast.success("Service added");
    }
    setDialogOpen(false);
    setName("");
    setEditing(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Services ({services.length})</h2>
          <Dialog open={dialogOpen} onOpenChange={o => { setDialogOpen(o); if (!o) { setName(""); setEditing(null); } }}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />Add Service</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Service</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2"><Label>Service Name</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. AC Maintenance" /></div>
                <Button onClick={handleSave} className="w-full">Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map(s => {
            const count = complaints.filter(c => c.service_id === s.service_id).length;
            return (
              <Card key={s.service_id} className="shadow-card">
                <CardContent className="pt-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Wrench className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{count} complaint{count !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => { setName(s.name); setEditing(s.service_id); setDialogOpen(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={async () => { await deleteService(s.service_id); toast.success("Service removed"); }}><Trash2 className="h-3.5 w-3.5" /></Button>
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
