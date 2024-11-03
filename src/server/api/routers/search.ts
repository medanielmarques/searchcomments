import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { db } from "@/server/db"
import { searchHistoryTable } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { z } from "zod"

export const searchRouter = createTRPCRouter({
  saveSearch: publicProcedure
    .input(
      z.object({
        query: z.string(),
        videoTitle: z.string(),
        videoUrl: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) return

      await db
        .insert(searchHistoryTable)
        .values({ ...input, userId: ctx.user?.id ?? "" })
    }),

  getSearchHistory: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return { searchHistory: [] }

    const searchHistory = await db
      .select()
      .from(searchHistoryTable)
      .where(eq(searchHistoryTable.userId, ctx.user.id ?? ""))
      .limit(20)

    return { searchHistory }
  }),
})
