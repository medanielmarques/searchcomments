import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { captureEvent } from "@/lib/analytics"
import {
  useActions,
  useCommentId,
  useComments,
  useReplies,
  useSearchSuggestions,
  useSearchTerms,
  useVideo,
  useVideoId,
  useVideoUrl,
} from "@/lib/video-store"
import { type Comment } from "@/server/api/routers/fetch-comments"
import { api } from "@/utils/api"
import { MagnifyingGlassIcon, ReloadIcon } from "@radix-ui/react-icons"
import { formatDistanceStrict } from "date-fns"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function Home() {
  const { video } = useVideo()
  const { comments } = useComments()

  return (
    <>
      <div className="flex items-center justify-center">
        <Header />
      </div>
      <div className="relative flex w-full items-center justify-center bg-white">
        <div className="flex flex-col items-center justify-between py-8 md:gap-16">
          <main className="flex w-11/12 max-w-sm flex-col justify-center gap-8 py-8 md:w-screen md:max-w-2xl md:py-0 lg:max-w-2xl">
            <div className="flex w-full flex-col gap-6">
              <div className="flex flex-col items-center gap-6">
                <Video />
                {video && (
                  <>
                    <Separator />
                    <SearchComments />
                  </>
                )}
              </div>
              {video && <SearchSuggestions />}
            </div>

            {comments && <Comments comments={comments} />}
          </main>
        </div>
      </div>
    </>
  )
}

function CoffeeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 2v2" />
      <path d="M14 2v2" />
      <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" />
      <path d="M6 2v2" />
    </svg>
  )
}

function Header() {
  return (
    <header className="flex w-full max-w-2xl items-center justify-between px-2 py-2 sm:px-0">
      <p className="relative z-20 bg-gradient-to-b from-gray-800 to-gray-800 bg-clip-text text-center font-bold text-transparent sm:text-2xl">
        search
        <span className="mx-[2px] rounded-md bg-gray-800 px-2 text-white">
          comments
        </span>
        <span className="text-sm sm:text-xl">.com</span>
      </p>

      <div className="flex items-center gap-2 sm:gap-4">
        <Link
          className="inline-flex h-9 items-center space-x-2 rounded-md bg-yellow-300 px-3 py-2 text-gray-900 transition-colors hover:bg-yellow-400"
          onClick={() => captureEvent("Ko-fi")}
          href="https://dub.sh/danielkofi"
          target="_blank"
        >
          <CoffeeIcon />
          <span className="hidden text-sm font-semibold sm:block">
            Buy Me a Coffee
          </span>
        </Link>

        <Link
          onClick={() => captureEvent("Follow me on twitter")}
          href="https://dub.sh/danielx"
          target="_blank"
          className="inline-flex h-9 items-center space-x-2 rounded-md bg-black px-3 py-2 text-white transition-colors hover:bg-slate-900"
        >
          <svg
            width="13"
            height="13"
            xmlns="http://www.w3.org/2000/svg"
            shapeRendering="geometricPrecision"
            textRendering="geometricPrecision"
            imageRendering="optimizeQuality"
            fillRule="evenodd"
            clipRule="evenodd"
            viewBox="0 0 512 462.799"
          >
            <path
              fill="#fff"
              fillRule="nonzero"
              d="M403.229 0h78.506L310.219 196.04 512 462.799H354.002L230.261 301.007 88.669 462.799h-78.56l183.455-209.683L0 0h161.999l111.856 147.88L403.229 0zm-27.556 415.805h43.505L138.363 44.527h-46.68l283.99 371.278z"
            />
          </svg>
          <span className="hidden text-sm font-semibold sm:block">Twitter</span>
        </Link>
      </div>
    </header>
  )
}

function Video() {
  const { video, isLoadingVideo } = useVideo()
  const videoUrl = useVideoUrl()
  const videoActions = useActions()
  const videoId = useVideoId()
  const utils = api.useUtils()

  async function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault()
      await utils.videoRouter.fetchVideoInfo.fetch({ videoId })
    }
  }

  return (
    <div className="flex w-full flex-col gap-6 rounded-lg">
      <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
        <div className="relative w-full min-w-72">
          <Input
            type="text"
            placeholder="Video URL"
            onKeyDown={handleKeyDown}
            value={videoUrl}
            onChange={(e) => videoActions.setVideoUrl(e.target.value)}
          />

          <div
            className="absolute right-0 top-0 rounded-md bg-gray-100 hover:cursor-pointer hover:bg-gray-200 md:bg-inherit"
            onClick={async () => {
              await utils.videoRouter.fetchVideoInfo.fetch({ videoId })
            }}
          >
            {isLoadingVideo ? (
              <ReloadIcon className="m-2.5 h-4 w-4 animate-spin" />
            ) : (
              <MagnifyingGlassIcon className="m-2.5 h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </div>

      {!isLoadingVideo && video && (
        <div className="w-full">
          <Link href={video?.videoUrl ?? ""} target="_blank">
            <div className="flex gap-3">
              <div>
                <Image
                  className="rounded-xl"
                  src={video?.thumbnail ?? ""}
                  alt="video thumbnail"
                  width={200}
                  height={112}
                />
              </div>

              <div className="flex w-80 flex-col gap-2 md:w-96">
                <p className="line-clamp-2 text-sm font-semibold">
                  {video?.title}
                </p>

                <div className="flex flex-col gap-1">
                  <span className="text-xs">{video?.channelName}</span>

                  <div className="text-xs">
                    <span>{video?.viewCount}</span> views •{" "}
                    <span>{video?.likeCount}</span> likes •{" "}
                    <span>{video?.commentCount} comments</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}

function SearchComments() {
  const { video } = useVideo()
  const { isLoadingComments } = useComments()
  const searchTerms = useSearchTerms()
  const videoActions = useActions()
  const videoId = useVideoId()
  const videoUrl = useVideoUrl()
  const utils = api.useUtils()

  async function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault()

      await utils.videoRouter.fetchComments.fetch({
        videoId,
        searchTerms,
      })
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-4 md:flex-row md:gap-2">
      <div className="relative w-full">
        <Input
          className="w-full bg-white"
          type="text"
          onChange={(e) => videoActions.setSearchTerms(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search the comments"
          value={searchTerms}
        />

        <div
          className="absolute right-0 top-0 rounded-md bg-gray-100 hover:cursor-pointer hover:bg-gray-200 md:bg-inherit"
          onClick={async () => {
            await utils.videoRouter.fetchComments.fetch({
              videoId,
              searchTerms,
            })

            captureEvent("Video info + search term", {
              videoTitle: video?.title,
              videoUrl,
              searchTerms,
            })
          }}
        >
          {isLoadingComments ? (
            <ReloadIcon className="m-2.5 h-4 w-4 animate-spin" />
          ) : (
            <MagnifyingGlassIcon className="m-2.5 h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>
    </div>
  )
}

function SearchSuggestions() {
  const { video } = useVideo()
  const searchSuggestions = useSearchSuggestions()
  const searchTerms = useSearchTerms()
  const videoId = useVideoId()
  const videoUrl = useVideoUrl()
  const videoActions = useActions()
  const utils = api.useUtils()

  return (
    <div className="flex flex-wrap items-center gap-3">
      {searchSuggestions.map(({ suggestion, selected }) => (
        <Button
          className={`h-8 rounded-lg ${selected ? "bg-black text-white hover:bg-primary/90" : "bg-zinc-100"} text-sm font-semibold hover:bg-zinc-200`}
          key={suggestion}
          variant="secondary"
          onClick={async () => {
            await utils.videoRouter.fetchComments.fetch({
              videoId,
              searchTerms,
            })

            const newSuggestions = searchSuggestions.map((s) => {
              s.suggestion === suggestion &&
                videoActions.setSearchTerms(s.selected ? "" : s.suggestion)

              return {
                ...s,
                selected: s.suggestion === suggestion && !s.selected,
              }
            })

            videoActions.setSearchSuggestions(newSuggestions)

            captureEvent("Search suggestions", {
              videoTitle: video?.title,
              videoUrl,
              searchTerms,
              suggestion,
            })
          }}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  )
}

function Comments({
  comments,
  isReplies = false,
}: {
  comments: Comment[]
  isReplies?: boolean
}) {
  return (
    <div className="flex flex-col gap-6">
      {!isReplies && (
        <span className="text-lg font-medium">
          Comments found ({comments?.length})
        </span>
      )}

      <div className="flex flex-col gap-8">
        {comments?.map((comment) => {
          return <Comment key={comment.comment.id} comment={comment} />
        })}
      </div>
    </div>
  )
}

function Comment({ comment }: { comment: Comment }) {
  const { replies } = useReplies()
  const searchTerms = useSearchTerms()
  const videoActions = useActions()
  const [showReplies, setShowReplies] = useState(false)
  const commentId = useCommentId()
  const utils = api.useUtils()

  return (
    <div>
      <div className="flex gap-4">
        <div className="flex items-start">
          <Image
            className="rounded-full"
            src={comment.author.photo}
            width={40}
            height={40}
            alt="Comments"
          />
        </div>

        <div className="flex w-full flex-col gap-2">
          <div className="flex items-center gap-2">
            <span>{comment.author.name}</span>
            <span className="text-xs">
              {formatDistanceStrict(
                new Date(comment.comment.date),
                new Date(),
                { addSuffix: true },
              )}
            </span>
          </div>
          <div>
            <HighlightText
              text={comment.comment.content}
              wordsToHighlight={searchTerms}
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-blue-600">
            <p>
              {comment.comment.likes}{" "}
              {parseInt(comment.comment.likes) === 1 ? "like" : "likes"}
            </p>
            |
            <Link target="_blank" href={comment.comment.viewCommentUrl}>
              Go to comment
            </Link>
            {comment.comment.repliesCount > 0 && (
              <>
                |
                <div
                  className="hover:cursor-pointer"
                  onClick={async () => {
                    videoActions.setcommentId(comment.comment.id)
                    setShowReplies(!showReplies)

                    if (showReplies) return

                    await utils.videoRouter.fetchComments.fetch({
                      commentId: [comment.comment.id],
                      searchTerms: "",
                      includeReplies: true,
                    })
                  }}
                >
                  <p>
                    {showReplies ? "Hide" : "Show"} replies (
                    {comment.comment.repliesCount})
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {comment.comment.id === commentId && showReplies && (
        <div className="ml-14 mt-6">
          <Comments comments={replies} isReplies />
        </div>
      )}
    </div>
  )
}

function highlightText(text: string, phrase: string) {
  if (!phrase) return text
  const words = phrase.split(" ").filter((word) => word)
  const regex = new RegExp(`\\b(${words.join("|")})\\b`, "gi")

  return text.split(regex).map((part, index) => {
    const lowerCasePart = part.toLowerCase()
    const lowerCaseWords = words.map((word) => word.toLowerCase())
    return lowerCaseWords.includes(lowerCasePart) ? (
      <span key={index} className="rounded-md bg-yellow-300 p-1 font-medium">
        {part}
      </span>
    ) : (
      part
    )
  })
}

function HighlightText({
  text,
  wordsToHighlight,
}: {
  text: string
  wordsToHighlight: string
}) {
  return <div>{highlightText(text, wordsToHighlight)}</div>
}
