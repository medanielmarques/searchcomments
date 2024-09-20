import { env } from "@/env"
import { type Config } from "drizzle-kit"

const isDev = env.NODE_ENV === "development"

export default {
  schema: "./src/server/db/schema.ts",
  out: "./migrations",
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
