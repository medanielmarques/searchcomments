import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const rateLimitsTable = sqliteTable(
  "rate_limits",
  {
    ip: text("ip").primaryKey(),
    count: integer("count").notNull(),
    lastAccess: integer("last_access").notNull(),
  },
  (rateLimitsTable) => ({ ipIndex: index("ip_idx").on(rateLimitsTable.ip) }),
)
