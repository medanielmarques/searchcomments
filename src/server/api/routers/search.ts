import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { db } from "@/server/db"
import { searchHistory } from "@/server/db/schema"
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
      await db.insert(searchHistory).values({ ...input })

      return {}
    }),
})
