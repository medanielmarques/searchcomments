import { env } from "@/env"
import { type Client, createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"

import * as cacheSchema from "./cache-schema"
import * as schema from "./schema"

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  client: Client | undefined
}

const globalForCacheDb = globalThis as unknown as {
  client: Client | undefined
}

export const client =
  globalForDb.client ??
  createClient({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_TOKEN,
  })

export const cacheClient =
  globalForCacheDb.client ?? createClient({ url: "file:./cache.sqlite" })

if (env.NODE_ENV !== "production") {
  globalForDb.client = client
  globalForCacheDb.client = cacheClient
}

export const db = drizzle(client, { schema })
export const cacheDB = drizzle(cacheClient, { schema: cacheSchema })
