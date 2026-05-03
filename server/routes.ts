import type { Express, Request, Response } from "express";
import { and, desc, eq, ne } from "drizzle-orm";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { db, initSchema } from "./db";
import { admins, complaints, customers, services, technicians } from "./schema";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const uploadDir = path.join(rootDir, "uploads", "avatars");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, file.mimetype.startsWith("image/"));
  },
});

const asyncHandler = (handler: (req: Request, res: Response) => Promise<void>) => {
  return (req: Request, res: Response) => {
    handler(req, res).catch(error => {
      const message = error instanceof Error ? error.message : "Request failed";
      res.status(500).json({ message });
    });
  };
};

const toDate = (value: unknown) => typeof value === "string" ? new Date(value) : value instanceof Date ? value : null;

async function seedData() {
  const existingServices = await db.select().from(services).limit(1);
  if (existingServices.length > 0) return;
  await db.insert(services).values([
    { name: "AC Repair" },
    { name: "Refrigerator Repair" },
    { name: "Washing Machine Repair" },
    { name: "TV Repair" },
    { name: "Microwave Repair" },
    { name: "Plumbing" },
    { name: "Electrical Repair" },
  ]);
  await db.insert(technicians).values([
    { name: "Ramesh Kumar", phone: "9876543210", skill: "AC Repair", area: "Andheri East, Mumbai", is_available: true },
    { name: "Suresh Patel", phone: "9876543211", skill: "Refrigerator Repair", area: "Borivali West, Mumbai", is_available: true },
    { name: "Anil Sharma", phone: "9876543212", skill: "Washing Machine Repair", area: "Dadar, Mumbai", is_available: true },
    { name: "Rahul Verma", phone: "9876543213", skill: "AC Repair", area: "Whitefield, Bangalore", is_available: true },
    { name: "Imran Khan", phone: "9876543214", skill: "TV Repair", area: "Indiranagar, Bangalore", is_available: true },
    { name: "Arjun Reddy", phone: "9876543215", skill: "Microwave Repair", area: "Madhapur, Hyderabad", is_available: true },
    { name: "Kiran Rao", phone: "9876543216", skill: "AC Repair", area: "Gachibowli, Hyderabad", is_available: true },
    { name: "Mohit Singh", phone: "9876543217", skill: "Refrigerator Repair", area: "Rohini, Delhi", is_available: true },
    { name: "Deepak Yadav", phone: "9876543218", skill: "Washing Machine Repair", area: "Dwarka, Delhi", is_available: true },
    { name: "Vikas Gupta", phone: "9876543219", skill: "TV Repair", area: "Lajpat Nagar, Delhi", is_available: true },
  ]);
  await db.insert(customers).values([
    { name: "John Doe", phone: "1234567890", address: "123 Main St, Downtown", password: "password123" },
    { name: "Jane Smith", phone: "1234567891", address: "456 Oak Ave, Uptown", password: "password123" },
  ]);
  await db.insert(admins).values({ username: "admin", password: "admin123" });
  await db.insert(complaints).values([
    { customer_id: 1, service_id: 1, technician_id: 1, problem: "AC is not cooling properly and making a loud noise. Water is leaking from the indoor unit.", ai_summary: "Cooling issue, noise, indoor unit leakage", priority: "urgent", status: "in_progress", action: "Technician dispatched for inspection" },
    { customer_id: 1, service_id: 4, technician_id: 2, problem: "Minor drip in kitchen faucet", ai_summary: "Kitchen faucet drip", priority: "low", status: "closed", action: "Washer replaced", done_at: new Date("2024-02-20T16:00:00Z"), closed_at: new Date("2024-02-20T16:00:00Z") },
    { customer_id: 2, service_id: 5, problem: "Power outlet in bedroom not working. Sparks visible when plugging in devices.", ai_summary: "Non-functional outlet, sparking hazard", priority: "urgent", status: "open" },
    { customer_id: 2, service_id: 6, technician_id: 5, problem: "Washing machine not spinning during wash cycle", ai_summary: "Washing machine spin failure", priority: "normal", status: "in_progress", action: "Technician checking motor" },
  ]);
}

export async function registerRoutes(app: Express) {
  await initSchema();
  await seedData();

  app.get("/api/bootstrap", asyncHandler(async (_req, res) => {
    const [complaintsData, customersData, servicesData, techniciansData] = await Promise.all([
      db.select().from(complaints).orderBy(desc(complaints.created_at)),
      db.select().from(customers),
      db.select().from(services),
      db.select().from(technicians),
    ]);
    res.json({ complaints: complaintsData, customers: customersData, services: servicesData, technicians: techniciansData });
  }));

  app.post("/api/auth/customer-login", asyncHandler(async (req, res) => {
    const [customer] = await db.select().from(customers).where(eq(customers.phone, req.body.phone)).limit(1);
    if (!customer || customer.password !== req.body.password) {
      res.status(401).json({ message: "Invalid phone number or password" });
      return;
    }
    res.json({ customer_id: customer.customer_id, name: customer.name });
  }));

  app.post("/api/auth/admin-login", asyncHandler(async (req, res) => {
    const [admin] = await db.select().from(admins).where(eq(admins.username, req.body.username)).limit(1);
    if (!admin || admin.password !== req.body.password) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    res.json({ admin_id: admin.admin_id, username: admin.username });
  }));

  app.post("/api/complaints", asyncHandler(async (req, res) => {
    await db.insert(complaints).values({
      customer_id: Number(req.body.customer_id),
      service_id: Number(req.body.service_id),
      problem: req.body.problem,
      ai_summary: req.body.ai_summary ?? null,
      priority: req.body.priority ?? "normal",
    });
    res.status(201).json({ ok: true });
  }));

  app.patch("/api/complaints/:id", asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const [complaint] = await db.select().from(complaints).where(eq(complaints.complaint_id, id)).limit(1);
    const updates: Record<string, unknown> = {};
    if (req.body.status !== undefined) updates.status = req.body.status;
    if (req.body.action !== undefined) {
      updates.action = req.body.action;
      updates.done_at = new Date();
    }
    if (req.body.technician_id !== undefined) updates.technician_id = req.body.technician_id;
    if (req.body.status === "closed") {
      updates.closed_at = new Date();
      updates.done_at = new Date();
    }
    await db.update(complaints).set(updates).where(eq(complaints.complaint_id, id));
    if (req.body.status === "closed" && complaint?.technician_id) {
      await db.update(technicians).set({ is_available: true }).where(eq(technicians.technician_id, complaint.technician_id));
    }
    res.json({ ok: true });
  }));

  app.delete("/api/complaints/:id", asyncHandler(async (req, res) => {
    await db.delete(complaints).where(eq(complaints.complaint_id, Number(req.params.id)));
    res.json({ ok: true });
  }));

  app.post("/api/complaints/:id/assign", asyncHandler(async (req, res) => {
    const technicianId = Number(req.body.technician_id);
    const [technician] = await db.select().from(technicians).where(eq(technicians.technician_id, technicianId)).limit(1);
    if (!technician || technician.is_available === false) {
      res.status(400).json({ message: "This technician is currently unavailable" });
      return;
    }
    await db.update(complaints).set({ technician_id: technicianId, status: "in_progress", action: "Technician assigned", done_at: new Date() }).where(eq(complaints.complaint_id, Number(req.params.id)));
    await db.update(technicians).set({ is_available: false }).where(eq(technicians.technician_id, technicianId));
    res.json({ ok: true });
  }));

  app.post("/api/customers", asyncHandler(async (req, res) => {
    const [customer] = await db.insert(customers).values({
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      password: req.body.password,
    }).returning({ customer_id: customers.customer_id });
    res.status(201).json(customer);
  }));

  app.patch("/api/customers/:id", asyncHandler(async (req, res) => {
    await db.update(customers).set({
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
    }).where(eq(customers.customer_id, Number(req.params.id)));
    res.json({ ok: true });
  }));

  app.post("/api/customers/:id/password", asyncHandler(async (req, res) => {
    const [customer] = await db.select().from(customers).where(eq(customers.customer_id, Number(req.params.id))).limit(1);
    if (!customer || customer.password !== req.body.oldPassword) {
      res.status(400).json({ message: "Current password is incorrect" });
      return;
    }
    await db.update(customers).set({ password: req.body.newPassword }).where(eq(customers.customer_id, customer.customer_id));
    res.json({ ok: true });
  }));

  app.delete("/api/customers/:id", asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const activeComplaints = await db.select().from(complaints).where(and(eq(complaints.customer_id, id), ne(complaints.status, "closed")));
    for (const complaint of activeComplaints) {
      if (complaint.technician_id) {
        await db.update(technicians).set({ is_available: true }).where(eq(technicians.technician_id, complaint.technician_id));
      }
    }
    await db.delete(customers).where(eq(customers.customer_id, id));
    await fs.rm(path.join(uploadDir, `customer_${id}.jpg`), { force: true });
    res.json({ ok: true });
  }));

  app.get("/api/customers/:id/avatar", asyncHandler(async (req, res) => {
    const file = path.join(uploadDir, `customer_${Number(req.params.id)}.jpg`);
    res.sendFile(file, error => {
      if (error && !res.headersSent) res.status(404).end();
    });
  }));

  app.post("/api/customers/:id/avatar", upload.single("avatar"), asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400).json({ message: "Image file is required" });
      return;
    }
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, `customer_${Number(req.params.id)}.jpg`), req.file.buffer);
    res.json({ url: `/api/customers/${Number(req.params.id)}/avatar` });
  }));

  app.post("/api/services", asyncHandler(async (req, res) => {
    await db.insert(services).values({ name: req.body.name });
    res.status(201).json({ ok: true });
  }));

  app.patch("/api/services/:id", asyncHandler(async (req, res) => {
    await db.update(services).set({ name: req.body.name }).where(eq(services.service_id, Number(req.params.id)));
    res.json({ ok: true });
  }));

  app.delete("/api/services/:id", asyncHandler(async (req, res) => {
    await db.delete(services).where(eq(services.service_id, Number(req.params.id)));
    res.json({ ok: true });
  }));

  app.post("/api/technicians", asyncHandler(async (req, res) => {
    await db.insert(technicians).values(req.body);
    res.status(201).json({ ok: true });
  }));

  app.patch("/api/technicians/:id", asyncHandler(async (req, res) => {
    await db.update(technicians).set(req.body).where(eq(technicians.technician_id, Number(req.params.id)));
    res.json({ ok: true });
  }));

  app.delete("/api/technicians/:id", asyncHandler(async (req, res) => {
    await db.delete(technicians).where(eq(technicians.technician_id, Number(req.params.id)));
    res.json({ ok: true });
  }));

  app.get("/api/admins/:id", asyncHandler(async (req, res) => {
    const [admin] = await db.select({ admin_id: admins.admin_id, username: admins.username }).from(admins).where(eq(admins.admin_id, Number(req.params.id))).limit(1);
    if (!admin) {
      res.status(404).json({ message: "Admin not found" });
      return;
    }
    res.json(admin);
  }));

  app.patch("/api/admins/:id", asyncHandler(async (req, res) => {
    await db.update(admins).set({ username: req.body.username }).where(eq(admins.admin_id, Number(req.params.id)));
    res.json({ ok: true });
  }));

  app.post("/api/admins/:id/password", asyncHandler(async (req, res) => {
    const [admin] = await db.select().from(admins).where(eq(admins.admin_id, Number(req.params.id))).limit(1);
    if (!admin || admin.password !== req.body.oldPassword) {
      res.status(400).json({ message: "Current password is incorrect" });
      return;
    }
    await db.update(admins).set({ password: req.body.newPassword }).where(eq(admins.admin_id, admin.admin_id));
    res.json({ ok: true });
  }));
}