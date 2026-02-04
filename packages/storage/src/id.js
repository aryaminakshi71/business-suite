/**
 * ID Generation Utility
 * Creates unique IDs for database records
 */
import { nanoid } from "nanoid";
export function createId() {
    return nanoid(21); // Better Auth compatible ID length
}
