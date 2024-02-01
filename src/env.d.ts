/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly TURSO_URL: string;
    readonly TURSO_TOKEN: string;
    readonly AUTH_SECURE_SOURCE: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
declare namespace App {
    interface Locals {
    }
}