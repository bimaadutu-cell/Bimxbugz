import { pgTable, text, timestamp, boolean, integer, serial, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  password: text("password").notNull(),
  role: varchar("role", { length: 20 }).notNull().default("user"), // user, reseller, owner, developer
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  profilePic: text("profile_pic"),
  isActive: boolean("is_active").default(true).notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  username: varchar("username", { length: 100 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const appSettings = pgTable("app_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const attackLogs = pgTable("attack_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  username: varchar("username", { length: 100 }).notNull(),
  attackType: varchar("attack_type", { length: 100 }).notNull(),
  target: text("target").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("success"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
