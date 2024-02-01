import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const authNonce = sqliteTable('auth_nonce', {
    uid: text('uid', { mode: 'text' }).primaryKey(),
    nonce: text('nonce').notNull(),
})

export const auth = sqliteTable('auth', {
    uid: text('uid').primaryKey(),
    passphrase: text('passphrase').notNull().unique(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).default(sql`CURRENT_TIMESTAMP`),
})