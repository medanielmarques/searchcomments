import { env } from "@/env"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { google, type youtube_v3 } from "googleapis"
import { z } from "zod"

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_DATA_API_KEY,
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

export type Comment = {
  author: {
    name: string
    photo: string
  }
  comment: {
    id: string
    content: string
    date: string
    likes: string
    repliesCount: number
    viewCommentUrl: string
  }
  replies: Reply[]
}

type Reply = {
  author: Comment["author"]
  comment: Omit<Comment["comment"], "repliesCount">
}

const formatCountCommentThread = (count: number): string => {
  if (count >= 1_000_000_000) return `${(count / 1_000_000_000).toFixed(1)}B`
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`
  return count.toString()
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

const mapComment = (
  item: youtube_v3.Schema$CommentThread,
): Omit<Comment, "replies"> => {
  const comment = item.snippet!.topLevelComment!.snippet!
  const date = new Date(comment.publishedAt!).toLocaleDateString()

  return {
    author: {
      name: comment.authorDisplayName!,
      photo: comment.authorProfileImageUrl!,
    },
    comment: {
      id: item.snippet!.topLevelComment!.id!,
      content: comment.textOriginal!,
      date,
      likes: formatCountCommentThread(comment.likeCount!),
      repliesCount: item.snippet!.totalReplyCount!,
      viewCommentUrl: `https://www.youtube.com/watch?v=${comment.videoId}&lc=${item.snippet!.topLevelComment!.id}`,
    },
  }
}

const mapReplies = (item: youtube_v3.Schema$CommentThread): Reply[] => {
  return (
    item.replies?.comments?.map((replyItem) => {
      const reply = replyItem.snippet!

      return {
        author: {
          name: reply.authorDisplayName!,
          photo: reply.authorProfileImageUrl!,
        },
        comment: {
          id: replyItem.id!,
          content: reply.textOriginal!,
          date: reply.publishedAt!,
          likes: formatCountCommentThread(reply.likeCount!),
          viewCommentUrl: `https://www.youtube.com/watch?v=${reply.videoId}&lc=${replyItem.id}`,
        },
      }
    }) ?? []
  )
}

const formatComment = (item: youtube_v3.Schema$CommentThread): Comment => ({
  ...mapComment(item),
  replies: mapReplies(item),
})

const fetchVideoInfo = async (videoId: string): Promise<Video> => {
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

const fetchCommentsWithSearchTerm = async ({
  videoId,
  searchTerms,
  commentId,
  includeReplies = false,
  pageToken,
}: {
  videoId?: string
  searchTerms: string
  commentId?: string[]
  includeReplies?: boolean
  pageToken?: string
}): Promise<youtube_v3.Schema$CommentThreadListResponse> => {
  const response = await youtube.commentThreads
    .list({
      part: includeReplies ? ["snippet", "replies"] : ["snippet"],
      videoId,
      pageToken,
      id: commentId,
      ...(searchTerms ? { searchTerms } : { order: "relevance" }),
      maxResults: 50,
    })
    .catch((error) => {
      console.error("Error fetching comments:", error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch comments",
      })
    })

  return response.data
}

export const videoRouter = createTRPCRouter({
  fetchComments: publicProcedure
    .input(
      z.object({
        videoId: z.string().optional(),
        searchTerms: z.string(),
        commentId: z.array(z.string()).optional(),
        includeReplies: z.boolean().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      if (env.NODE_ENV === "production") {
        const ratelimit = new Ratelimit({
          redis: Redis.fromEnv(),
          limiter: Ratelimit.slidingWindow(5, "10 s"),
        })

        const identifier = ctx.userIp
        const { success } = await ratelimit.limit(identifier)

        if (!success) {
          throw new TRPCError({ code: "TOO_MANY_REQUESTS" })
        }
      }

      const commentsResponse = await fetchCommentsWithSearchTerm(input)

      const comments: Comment[] =
        commentsResponse.items?.map(formatComment) ?? []

      return { comments, nextPageToken: commentsResponse.nextPageToken }
    }),

  fetchVideoInfo: publicProcedure
    .input(z.object({ videoId: z.string() }))
    .query(async ({ input }) => {
      return await fetchVideoInfo(input.videoId)
    }),
})
