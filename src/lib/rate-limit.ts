import { env } from "@/env"
import { cacheDB } from "@/server/db"
import { rateLimits } from "@/server/db/cache-schema"
import { TRPCError } from "@trpc/server"
import { eq } from "drizzle-orm"

const RATE_LIMIT = 5
const TIME_WINDOW = 10000

export async function rateLimit({ ip }: { ip: string }) {
  const now = Date.now()

  if (env.NODE_ENV === "production") {
    const [existingLimit] = await cacheDB
      .select()
      .from(rateLimits)
      .where(eq(rateLimits.ip, ip))

    if (existingLimit) {
      if (now - existingLimit.lastAccess > TIME_WINDOW) {
        // Reset if the time window has passed
        await cacheDB
          .update(rateLimits)
          .set({ count: 1, lastAccess: now })
          .where(eq(rateLimits.ip, ip))
      } else if (existingLimit.count < RATE_LIMIT) {
        // Increment the count
        await cacheDB
          .update(rateLimits)
          .set({ count: existingLimit.count + 1, lastAccess: now })
          .where(eq(rateLimits.ip, ip))
      } else {
        // Rate limit exceeded
        throw new TRPCError({ code: "TOO_MANY_REQUESTS" })
      }
    } else {
      // Create a new rate limit record
      await cacheDB.insert(rateLimits).values({
        ip,
        count: 1,
        lastAccess: now,
      })
    }
  }
}
