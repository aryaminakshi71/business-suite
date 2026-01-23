/**
 * Environment variables
 * Automatically uses client or server based on context
 */

// In browser/client context, use client env
// In server context, use server env
export { env, clientSchema } from "./client.js";
export type { ClientEnv } from "./client.js";
export { env as serverEnv, serverSchema } from "./server.js";
export type { ServerEnv } from "./server.js";
