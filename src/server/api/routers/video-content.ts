import { env } from "@/env"
import { mockedComments, mockedVideo } from "@/lib/mock"
import { rateLimit } from "@/lib/rate-limit"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { fetchComments } from "@/server/api/use-cases/fetch-comments"
import { fetchVideoInfo } from "@/server/api/use-cases/fetch-video"
import { createId as cuid } from "@paralleldrive/cuid2"
import { z } from "zod"

const shouldUseMockedData = ({ videoId }: { videoId?: string }) =>
  env.NODE_ENV === "development" && !Boolean(videoId)

export const videoContentRouter = createTRPCRouter({
  getVideoComments: publicProcedure
    .input(
      z.object({
        videoId: z.string().optional(),
        searchTerms: z.string(),
        commentId: z.array(z.string()).optional(),
        includeReplies: z.boolean().optional(),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      await rateLimit({ ip: ctx.ip })

      if (shouldUseMockedData(input)) {
        return {
          comments: mockedComments,
          nextPageToken: cuid(),
        }
      }

      const { comments, nextPageToken } = await fetchComments(input)

      return { comments, nextPageToken }
    }),

  getVideoInfo: publicProcedure
    .input(z.object({ videoId: z.string() }))
    .query(async ({ input, ctx }) => {
      await rateLimit({ ip: ctx.ip, rateLimit: 3 })

      if (shouldUseMockedData(input)) {
        return mockedVideo
      }

      return await fetchVideoInfo(input.videoId)
    }),
})
