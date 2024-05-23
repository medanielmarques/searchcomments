import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"
import { google } from "googleapis"
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

async function fetchVideoInfo(videoId: string) {
  const response = await youtube.videos
    .list({
      part: ["snippet", "statistics"],
      id: videoId,
    })
    .catch((error) => {
      console.error("Error fetching video information:", error)
      return null
    })

  if (response.data.items.length === 0) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Video not found" })
  }

  const video = response.data.items[0]

  const title = video.snippet.title
  const channelName = video.snippet.channelTitle
  const thumbnail = video.snippet.thumbnails.maxres
    ? video.snippet.thumbnails.maxres.url
    : video.snippet.thumbnails.high.url
  const commentCount = formatCount(video.statistics.commentCount)
  const likeCount = formatCount(video.statistics.likeCount)
  const viewCount = formatCount(video.statistics.viewCount)
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`

  return {
    title,
    channelName,
    thumbnail,
    commentCount,
    likeCount,
    viewCount,
    videoUrl,
  } as Video
}

export const videoRouter = createTRPCRouter({
  fetchComments: publicProcedure
    .input(z.object({ videoId: z.string(), searchTerms: z.string() }))
    .query(async ({ input }) => {
      const commentsResponse = await fetchCommentsWithSearchTerm(input)

      const comments: Comment[] = commentsResponse.data.items.map((item) =>
        formatComment(item),
      )

      return { comments }
    }),

  fetchVideoInfo: publicProcedure
    .input(z.object({ videoId: z.string() }))
    .query(async ({ input }) => {
      const video = await fetchVideoInfo(input.videoId)

      return video
    }),
})

async function fetchCommentsWithSearchTerm({
  videoId,
  searchTerms,
}: {
  videoId: string
  searchTerms: string
}) {
  const response = await youtube.commentThreads
    .list({
      part: ["snippet", "replies"],
      videoId,
      searchTerms,
      maxResults: 10,
    })
    .catch((error) => {
      console.error("Error fetching comments:", error)
      return []
    })

  return response
}

type Reply = Omit<Comment, "replies">

export type Comment = {
  author: {
    name: string
    photo: string
  }
  comment: {
    content: string
    date: string
    likes: string
    repliesCount: string
    viewCommentUrl: string
  }
  replies: Reply[]
}

function formatComment(item) {
  return {
    ...mapComment(item),
    replies: mapReplies(item),
  } as Comment
}

function mapComment(item) {
  const comment = item.snippet.topLevelComment.snippet
  const date = new Date(comment.publishedAt).toLocaleDateString()

  return {
    author: {
      name: comment.authorDisplayName,
      photo: comment.authorProfileImageUrl,
    },
    comment: {
      content: comment.textDisplay,
      date,
      likes: formatCount(comment.likeCount),
      repliesCount: formatCount(item.snippet.totalReplyCount),
      viewCommentUrl: `https://www.youtube.com/watch?v=${comment.videoId}&lc=${item.snippet.topLevelComment.id}`,
    },
  }
}

function mapReplies(item) {
  return item.replies
    ? item.replies.comments.map((item) => {
        const reply = item.snippet

        return {
          author: {
            name: reply.authorDisplayName,
            photo: reply.authorProfileImageUrl,
          },
          comment: {
            content: reply.textDisplay,
            date: reply.publishedAt,
            likes: formatCount(reply.likeCount),
            viewCommentUrl: `https://www.youtube.com/watch?v=${reply.videoId}&lc=${item.id}`,
          },
        }
      })
    : []
}

function formatCount(count: string) {
  const number = parseInt(count)

  if (number >= 1_000_000_000) return (number / 1_000_000_000).toFixed(1) + "B"
  if (number >= 1_000_000) return (number / 1_000_000).toFixed(1) + "M"
  if (number >= 1_000) return (number / 1_000).toFixed(1) + "K"
  return count
}
