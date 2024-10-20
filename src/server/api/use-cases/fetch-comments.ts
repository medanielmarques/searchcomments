import { env } from "@/env"
import { TRPCError } from "@trpc/server"
import { google, type youtube_v3 } from "googleapis"

const youtube = google.youtube({
  version: "v3",
  auth: env.YOUTUBE_DATA_API_KEY,
})

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

export const fetchComments = async ({
  videoId,
  searchTerms,
  commentId,
  includeReplies = false,
  cursor,
}: {
  videoId?: string
  searchTerms: string
  commentId?: string[]
  includeReplies?: boolean
  cursor?: string
}) => {
  const response = await youtube.commentThreads
    .list({
      part: includeReplies ? ["snippet", "replies"] : ["snippet"],
      videoId,
      pageToken: cursor,
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

  const comments = response.data.items?.map(formatComment) ?? []

  return { comments, nextPageToken: response.data.nextPageToken }
}
