import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";

export const services = pgTable("services", {
  service_id: serial("service_id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const technicians = pgTable("technicians", {
  technician_id: serial("technician_id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  skill: text("skill"),
  area: text("area"),
  is_available: boolean("is_available").default(true),
});

export const customers = pgTable("customers", {
  customer_id: serial("customer_id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  address: text("address").notNull(),
  password: text("password").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const admins = pgTable("admins", {
  admin_id: serial("admin_id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const complaints = pgTable("complaints", {
  complaint_id: serial("complaint_id").primaryKey(),
  customer_id: integer("customer_id").notNull().references(() => customers.customer_id, { onDelete: "cascade" }),
  service_id: integer("service_id").notNull().references(() => services.service_id),
  technician_id: integer("technician_id").references(() => technicians.technician_id),
  problem: text("problem").notNull(),
  ai_summary: text("ai_summary"),
  priority: text("priority").default("normal"),
  status: text("status").default("open"),
  action: text("action"),
  done_at: timestamp("done_at"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  closed_at: timestamp("closed_at"),
});

export type Service = typeof services.$inferSelect;
export type Technician = typeof technicians.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type Admin = typeof admins.$inferSelect;
export type Complaint = typeof complaints.$inferSelect;