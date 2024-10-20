import { env } from "@/env"
import { db } from "@/server/db"
import { rateLimitsTable } from "@/server/db/schema"
import { TRPCError } from "@trpc/server"
import { eq } from "drizzle-orm"

const RATE_LIMIT = 5
const TIME_WINDOW = 10000

type RateLimit = {
  ip: string
  rateLimit?: number
  timeWindow?: number
}

export async function rateLimit({
  ip,
  rateLimit = RATE_LIMIT,
  timeWindow = TIME_WINDOW,
}: RateLimit) {
  if (env.NODE_ENV !== "production") return

  const now = Date.now()

  const [existingLimit] = await db
    .select()
    .from(rateLimitsTable)
    .where(eq(rateLimitsTable.ip, ip))

  if (existingLimit) {
    if (now - existingLimit.lastAccess > TIME_WINDOW) {
      // Reset if the time window has passed
      await db
        .update(rateLimitsTable)
        .set({ count: 1, lastAccess: now })
        .where(eq(rateLimitsTable.ip, ip))
    } else if (existingLimit.count < RATE_LIMIT) {
      // Increment the count
      await db
        .update(rateLimitsTable)
        .set({ count: existingLimit.count + 1, lastAccess: now })
        .where(eq(rateLimitsTable.ip, ip))
    } else {
      // Rate limit exceeded
      throw new TRPCError({ code: "TOO_MANY_REQUESTS" })
    }
  } else {
    // Create a new rate limit record
    await db.insert(rateLimitsTable).values({
      ip,
      count: 1,
      lastAccess: now,
    })
  }
}
