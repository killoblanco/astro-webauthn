import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv'

dotenv.config()

interface env {
    TURSO_URL: string;
    TURSO_TOKEN: string;
}

const env: env = process.env as any;

export default {
    schema: './src/**/**/models.ts',
    out: './migrations',
    driver: 'turso',
    dbCredentials: {
        url: env.TURSO_URL,
        authToken: env.TURSO_TOKEN,
    }
} satisfies Config