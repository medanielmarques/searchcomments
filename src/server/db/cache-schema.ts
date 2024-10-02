import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const rateLimits = sqliteTable("rate_limits", {
  ip: text("ip").primaryKey(),
  count: integer("count").notNull(),
  lastAccess: integer("last_access").notNull(),
})
