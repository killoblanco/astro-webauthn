import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer, blob, primaryKey } from "drizzle-orm/sqlite-core";

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

export const authRelations = relations(auth, ({ many }) => ({
    authCredentials: many(authToCredentials)
}))

export const authCredential = sqliteTable('auth_credential', {
    uid: text('uid').primaryKey(),
    credentialID: text('credential_id').notNull(),
    credentialPublicKey: text('credential_public_key').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credential_device_type').notNull(),
    credentialBackedUp: integer('credential_backed_up', { mode: 'boolean' }).notNull(),
    transports: text('transports', { mode: 'json' }).notNull(),
})

export const authCredentialRelations = relations(authCredential, ({ many }) => ({
    authCredentials: many(authToCredentials)
}))

export const authToCredentials = sqliteTable('auth_credentials', {
    auth: text('auth_uid').notNull().references(() => auth.uid),
    credential: text('credential_uid').notNull().references(() => authCredential.uid),
}, (table) => ({ pk: primaryKey({ columns: [table.auth, table.credential] }) }))

export const authToCredentialRelations = relations(authToCredentials, ({ one }) => ({
    auth: one(auth, {
        fields: [authToCredentials.auth],
        references: [auth.uid]
    }),
    credential: one(authCredential, {
        fields: [authToCredentials.credential],
        references: [authCredential.uid]
    })
}))