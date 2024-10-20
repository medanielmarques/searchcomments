import { env } from "@/env"
import { TRPCError } from "@trpc/server"
import { google } from "googleapis"

const youtube = google.youtube({
  version: "v3",
  auth: env.YOUTUBE_DATA_API_KEY,
})

export type Video = {
  title: string
  channelName: string
  thumbnail: string
  commentCount: string
  likeCount: string
  viewCount: string
  videoUrl: string
}

const formatCountVideoInfo = (count: string): string => {
  const countNumber = Number(count)

  if (countNumber >= 1_000_000_000)
    return `${(countNumber / 1_000_000_000).toFixed(1)}B`
  if (countNumber >= 1_000_000)
    return `${(countNumber / 1_000_000).toFixed(1)}M`
  if (countNumber >= 1_000) return `${(countNumber / 1_000).toFixed(1)}K`
  return count
}

export const fetchVideoInfo = async (videoId: string): Promise<Video> => {
  const response = await youtube.videos
    .list({
      part: ["snippet", "statistics"],
      id: [videoId],
    })
    .catch((error) => {
      console.error("Error fetching video information:", error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch video information",
      })
    })

  if (!response.data.items || response.data.items.length === 0) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Video not found" })
  }

  const video = response.data.items[0]
  const snippet = video!.snippet!
  const statistics = video!.statistics!

  return {
    title: snippet.title!,
    channelName: snippet.channelTitle!,
    thumbnail:
      snippet.thumbnails?.maxres?.url ?? snippet.thumbnails?.high?.url ?? "",
    commentCount: formatCountVideoInfo(statistics.commentCount ?? "0"),
    likeCount: formatCountVideoInfo(statistics.likeCount ?? "0"),
    viewCount: formatCountVideoInfo(statistics.viewCount ?? "0"),
    videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
  }
}
