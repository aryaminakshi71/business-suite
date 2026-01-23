/**
 * Shared Auth Schema for Business Suite
 * 
 * Used by Better Auth for authentication across all modules
 */

import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { createId } from "../../id.js";

/**
 * User table
 * Stores user accounts for the suite
 */
export const user = pgTable("user", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  emailIdx: index("idx_user_email").on(table.email),
}));

/**
 * Session table
 * Stores user sessions
 */
export const session = pgTable("session", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  activeOrganizationId: text("active_organization_id"),
}, (table) => ({
  userIdIdx: index("idx_session_user_id").on(table.userId),
  tokenIdx: index("idx_session_token").on(table.token),
}));

/**
 * Account table
 * OAuth account connections
 */
export const account = pgTable("account", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index("idx_account_user_id").on(table.userId),
  providerAccountIdx: index("idx_account_provider_account").on(
    table.providerId,
    table.accountId
  ),
}));

/**
 * Verification table
 * Email verification tokens
 */
export const verification = pgTable("verification", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  identifierIdx: index("idx_verification_identifier").on(table.identifier),
}));

/**
 * Organization table
 * Multi-tenant organizations
 */
export const organization = pgTable("organization", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name").notNull(),
  slug: text("slug").unique(),
  logo: text("logo"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  metadata: text("metadata"),
}, (table) => ({
  slugIdx: index("idx_organization_slug").on(table.slug),
}));

/**
 * Member table
 * User-organization relationship
 */
export const member = pgTable("member", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  role: text("role").notNull().default("member"), // 'owner', 'admin', 'member'
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index("idx_member_user_id").on(table.userId),
  organizationIdIdx: index("idx_member_organization_id").on(table.organizationId),
  userOrgIdx: index("idx_member_user_org").on(table.userId, table.organizationId),
}));
