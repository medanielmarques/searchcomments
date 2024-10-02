import { env } from "@/env"
import { type Client, createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"

import * as cacheSchema from "./cache-schema.js"
import * as mainSchema from "./main-schema.js"

const schema = {
  ...cacheSchema,
  ...mainSchema,
}

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  client: Client | undefined
}

export const client =
  globalForDb.client ??
  createClient({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_TOKEN,
  })
if (env.NODE_ENV !== "production") globalForDb.client = client

export const db = drizzle(client, { schema })
