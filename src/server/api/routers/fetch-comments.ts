import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { google } from "googleapis"
import { z } from "zod"

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_DATA_API_KEY,
})

export const fetchCommentsRouter = createTRPCRouter({
  newShit: publicProcedure
    .input(z.object({ videoId: z.string(), searchTerms: z.string() }))
    .query(async ({ input }) => {
      const commentsResponse = await fetchCommentsWithSearchTerm(input)

      const comments: Comment[] = commentsResponse.data.items.map((item) =>
        formatComment(item),
      )

      return { comments }
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

type Comment = {
  author: {
    name: string
    photo: string
  }
  comment: {
    content: string
    date: string
    likes: number
    repliesCount: number
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
  const date = new Date(comment.publishedAt).toLocaleString()

  return {
    author: {
      name: comment.authorDisplayName,
      photo: comment.authorProfileImageUrl,
    },
    comment: {
      content: comment.textDisplay,
      date,
      likes: comment.likeCount,
      repliesCount: item.snippet.totalReplyCount,
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
            likes: reply.likeCount,
            viewCommentUrl: `https://www.youtube.com/watch?v=${reply.videoId}&lc=${item.id}`,
          },
        }
      })
    : []
}
