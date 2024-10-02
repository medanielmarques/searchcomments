import { type Config } from "drizzle-kit"

export default {
  schema: "./src/server/db/cache-schema.ts",
  out: "./migrations/cache-schema",
  dialect: "sqlite",
  dbCredentials: {
    url: "file:./cache.sqlite",
  },
} satisfies Config
