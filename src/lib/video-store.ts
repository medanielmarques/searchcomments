import { useToast } from "@/components/ui/use-toast"
import { type Comment } from "@/server/api/use-cases/fetch-comments"
import { type Video } from "@/server/api/use-cases/fetch-video"
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

const initialVideo: Video = {
  title: "",
  channelName: "",
  thumbnail: "",
  commentCount: "",
  likeCount: "",
  viewCount: "",
  videoUrl: "",
}

const initialSearchSuggestions: Suggestion[] = [
  { suggestion: "Song name", selected: false },
  { suggestion: "Product name", selected: false },
  { suggestion: "Thumbnail", selected: false },
  { suggestion: "Source", selected: false },
  { suggestion: "Link", selected: false },
]

const useVideoStore = create<VideoStore>((set) => ({
  video: initialVideo,
  comments: [],
  commentId: "",
  videoUrl: "",
  searchTerms: "",
  searchSuggestions: initialSearchSuggestions,

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
  } = api.videoContentRouter.getVideoInfo.useQuery(
    { videoId },
    { enabled: false },
  )

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
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = api.videoContentRouter.getVideoComments.useInfiniteQuery(
    { videoId, searchTerms },
    {
      enabled: false,
      getNextPageParam: (lastPage) => lastPage.nextPageToken,
    },
  )

  const comments = data?.pages.flatMap((page) => page.comments)

  return {
    comments,
    isLoadingComments,
    errorComments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  }
}

export const useReplies = () => {
  const commentId = useCommentId()

  const {
    data,
    isLoading: isLoadingReplies,
    error: errorReplies,
  } = api.videoContentRouter.getVideoComments.useQuery(
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
export const useActions = () => useVideoStore((state) => state.actions)
export const useSearchSuggestions = () =>
  useVideoStore((state) => state.searchSuggestions)
