import type { D1Database } from "@cloudflare/workers-types";
import { drizzle } from "drizzle-orm/d1";
import * as models from './models'

export const setTmpNonce = async (connection: D1Database, uid: string, nonce: string) => {
    const db = drizzle(connection, { schema: models })

    await db.insert(models.authNonce).values({ uid, nonce })
}