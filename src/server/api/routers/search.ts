import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { db } from "@/server/db"
import { searchHistoryTable } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { z } from "zod"

export const searchRouter = createTRPCRouter({
  saveSearch: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        query: z.string(),
        videoTitle: z.string(),
        videoUrl: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await db.insert(searchHistoryTable).values({ ...input })
    }),

  getSearchHistory: publicProcedure.query(async () => {
    const searchHistory = await db
      .select()
      .from(searchHistoryTable)
      .where(eq(searchHistoryTable.userId, "userId"))
      .limit(20)

    return { searchHistory }
  }),
})
