import { useToast } from "@/components/ui/use-toast"
import { type Comment, type Video } from "@/server/api/routers/fetch-comments"
import { api } from "@/utils/api"
import { useEffect } from "react"
import { create } from "zustand"

type Suggestion = {
  suggestion: string
  selected: boolean
}

type VideoStore = {
  video: Video
  comments: Comment[]
  commentId: string

  videoUrl: string
  searchTerms: string
  searchSuggestions: Suggestion[]

  actions: {
    setVideo: (video: Video) => void
    setComments: (comments: Comment[]) => void
    setcommentId: (commentId: string) => void

    setVideoUrl: (videoUrl: string) => void
    setSearchTerms: (searchTerms: string) => void
    setSearchSuggestions: (searchSuggestions: Suggestion[]) => void
  }
}

const searchSuggestions = [
  { suggestion: "Song name", selected: false },
  { suggestion: "Product name", selected: false },
  { suggestion: "His name", selected: false },
  { suggestion: "Her name", selected: false },
  { suggestion: "Source", selected: false },
  { suggestion: "Link", selected: false },
]

const useVideoStore = create<VideoStore>((set) => ({
  video: {
    title: "",
    channelName: "",
    thumbnail: "",
    commentCount: "",
    likeCount: "",
    viewCount: "",
    videoUrl: "",
  },
  comments: [],
  commentId: "",

  videoUrl: "",
  searchTerms: "",
  searchSuggestions,

  actions: {
    setVideo: (video) => set({ video }),
    setComments: (comments) => set({ comments }),
    setcommentId: (commentId) => set({ commentId }),
    setVideoUrl: (videoUrl) => set({ videoUrl }),
    setSearchTerms: (searchTerms) => set({ searchTerms }),
    setSearchSuggestions: (searchSuggestions) => set({ searchSuggestions }),
  },
}))

export function useVideoId() {
  const videoUrl = useVideoUrl()

  const videoId = videoUrl.match(/([a-z0-9_-]{11})/gim)
  return videoId ? videoId[0] : ""
}

export const useVideo = () => {
  const videoId = useVideoId()
  const { toast } = useToast()

  const {
    data: video,
    isLoading: isLoadingVideo,
    error: errorVideo,
    isError: isErrorVideo,
  } = api.videoRouter.fetchVideoInfo.useQuery({ videoId }, { enabled: false })

  useEffect(() => {
    if (isErrorVideo) {
      toast({
        title: errorVideo.message,
        description: "Please provide a valid URL",
      })
    }
  }, [isErrorVideo, errorVideo, toast])

  return { video, isLoadingVideo, errorVideo, isErrorVideo }
}

export const useComments = () => {
  const videoId = useVideoId()
  const searchTerms = useSearchTerms()

  const {
    data,
    isLoading: isLoadingComments,
    error: errorComments,
  } = api.videoRouter.fetchComments.useQuery(
    { videoId, searchTerms },
    { enabled: false },
  )

  const comments = data?.comments

  return { comments, isLoadingComments, errorComments }
}

export const useReplies = () => {
  const commentId = useCommentId()

  const {
    data,
    isLoading: isLoadingReplies,
    error: errorReplies,
  } = api.videoRouter.fetchComments.useQuery(
    {
      commentId: [commentId],
      searchTerms: "",
      includeReplies: true,
    },
    { enabled: false },
  )

  const replies = data?.comments[0]?.replies

  return { replies, isLoadingReplies, errorReplies }
}

export const useCommentId = () => useVideoStore((state) => state.commentId)

export const useVideoUrl = () => useVideoStore((state) => state.videoUrl)

export const useSearchTerms = () => useVideoStore((state) => state.searchTerms)

export const useSearchSuggestions = () =>
  useVideoStore((state) => state.searchSuggestions)

export const useActions = () => useVideoStore((state) => state.actions)
