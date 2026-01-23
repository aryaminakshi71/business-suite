/**
 * Shared Database Connection for Suite
 * 
 * Uses shared database with schema separation or separate databases
 */

import { env } from "@suite/env/server";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema/index.js";

const sql = neon(env.DATABASE_URL);

// Create shared database connection with schema
export const db = drizzle(sql, { schema });

export type Database = typeof db;
export { schema };