import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { google } from "googleapis"
import { z } from "zod"

export const fetchCommentsRouter = createTRPCRouter({
  newShit: publicProcedure
    .input(z.object({ videoUrl: z.string(), searchTerm: z.string() }))
    .query(async ({ input }) => {
      const videoId = input.videoUrl.match(/([a-z0-9_-]{11})/gim)[0]

      // Set up the YouTube API
      const youtube = google.youtube({
        version: "v3",
        auth: process.env.YOUTUBE_DATA_API_KEY,
      })

      async function fetchCommentsWithKeyword() {
        const response = await youtube.commentThreads
          .list({
            part: ["snippet"],
            videoId,
            searchTerms: input.searchTerm,
            maxResults: 1,
          })
          .catch((error) => {
            console.error("Error fetching comments:", error)
            return []
          })

        const comments = response.data.items.map((item) => {
          return {
            author: item.snippet.topLevelComment.snippet.authorDisplayName,
            text: item.snippet.topLevelComment.snippet.textDisplay,
          }
        })

        console.log(comments)
      }

      const comments = await fetchCommentsWithKeyword()

      return { comments }
    }),
})
