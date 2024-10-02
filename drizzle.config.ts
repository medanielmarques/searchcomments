import { env } from "@/env"
import { type Config } from "drizzle-kit"

const isDev = env.NODE_ENV === "development"

export default {
  schema: "./src/server/db/main-schema.ts",
  out: "./migrations/main-schema",
  dialect: "sqlite",
  ...(isDev
    ? {
        dbCredentials: {
          url: env.DATABASE_URL,
        },
      }
    : {
        driver: "turso",
        dbCredentials: {
          url: env.DATABASE_URL,
          authToken: env.DATABASE_TOKEN,
        },
      }),
} satisfies Config
