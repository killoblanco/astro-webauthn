import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as models from './models';
import { eq } from 'drizzle-orm';

export const setTmpNonce = async (uid: string, nonce: string) => {
    const client = createClient({
        url: import.meta.env.TURSO_URL,
        authToken: import.meta.env.TURSO_TOKEN
    })
    const db = drizzle(client, { schema: models })

    await db.insert(models.authNonce).values({ uid, nonce })
}

export const getTmpNonce = async (uid: string) => {
    const client = createClient({
        url: import.meta.env.TURSO_URL,
        authToken: import.meta.env.TURSO_TOKEN
    })
    const db = drizzle(client, { schema: models })

    const nonce = await db.query.authNonce.findFirst({
        where: (auth, { eq }) => eq(auth.uid, uid)
    });

    await db.delete(models.authNonce).where(eq(models.authNonce.uid, uid))
    return nonce?.nonce;
}

export const saveNewUserCredentials = async (credential: {
    aid: string,
    credentialID: Uint8Array,
    credentialPublicKey: Uint8Array,
    counter: number,
    credentialDeviceType: string,
    credentialBackedUp: boolean,
    transports: string[]
}) => {
    const client = createClient({
        url: import.meta.env.TURSO_URL,
        authToken: import.meta.env.TURSO_TOKEN
    })
    const db = drizzle(client, { schema: models })

    const credUUID = globalThis.crypto.randomUUID();

    await db.insert(models.authCredential).values({
        uid: credUUID,
        credentialID: credential.credentialID.toString(),
        credentialPublicKey: credential.credentialPublicKey.toString(),
        counter: credential.counter,
        credentialDeviceType: credential.credentialDeviceType,
        credentialBackedUp: credential.credentialBackedUp,
        transports: credential.transports,
    });
}