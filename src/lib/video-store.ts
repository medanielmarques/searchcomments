import { type Comment, type Video } from "@/server/api/routers/fetch-comments"
import { api } from "@/utils/api"
import { create } from "zustand"

type Suggestion = {
  suggestion: string
  selected: boolean
}

type VideoStore = {
  video: Video
  comments: Comment[]

  videoUrl: string
  searchTerms: string
  showComments: boolean
  searchSuggestions: Suggestion[]

  actions: {
    setVideo: (video: Video) => void
    setComments: (comments: Comment[]) => void
    setVideoUrl: (videoUrl: string) => void
    setSearchTerms: (searchTerms: string) => void
    setShowComments: (showComments: boolean) => void
    setSearchSuggestions: (searchSuggestions: Suggestion[]) => void
  }
}

const searchSuggestions = [
  { suggestion: "Song name", selected: false },
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

  videoUrl: "",
  searchTerms: "",
  showComments: false,
  searchSuggestions,

  actions: {
    setVideo: (video) => set({ video }),
    setComments: (comments) => set({ comments }),
    setVideoUrl: (videoUrl) => set({ videoUrl }),
    setSearchTerms: (searchTerms) => set({ searchTerms }),
    setShowComments: (showComments) => set({ showComments }),
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

  const {
    data: video,
    isLoading: isLoadingVideo,
    error: errorVideo,
  } = api.videoRouter.fetchVideoInfo.useQuery({ videoId }, { enabled: false })

  return { video, isLoadingVideo, errorVideo }
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

export const useVideoUrl = () => useVideoStore((state) => state.videoUrl)

export const useSearchTerms = () => useVideoStore((state) => state.searchTerms)

export const useShowComments = () =>
  useVideoStore((state) => state.showComments)

export const useSearchSuggestions = () =>
  useVideoStore((state) => state.searchSuggestions)

export const useActions = () => useVideoStore((state) => state.actions)
