import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as models from './models';

export const setTmpNonce = async (uid: string, nonce: string) => {
    const client = createClient({
        url: import.meta.env.TURSO_URL,
        authToken: import.meta.env.TURSO_TOKEN
    })
    const db = drizzle(client, { schema: models })

    await db.insert(models.authNonce).values({ uid, nonce })
}