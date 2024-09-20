import { createId as cuid } from "@paralleldrive/cuid2"
import { sql } from "drizzle-orm"
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const placeholder = sqliteTable(
  "placeholder",
  {
    id: text("id", { mode: "text" }).primaryKey().$default(cuid),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
      () => new Date(),
    ),
  },
  // (table) => ({ nameIndex: index("name_idx").on(table.name) })
)
