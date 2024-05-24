import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { captureEvent } from "@/lib/analytics"
import {
  useActions,
  useComments,
  useSearchSuggestions,
  useSearchTerms,
  useVideo,
  useVideoId,
  useVideoUrl,
} from "@/lib/video-store"
import { api } from "@/utils/api"
import { MagnifyingGlassIcon, ReloadIcon } from "@radix-ui/react-icons"
import { formatDistanceStrict } from "date-fns"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  const { video } = useVideo()
  const { comments } = useComments()

  return (
    <div className="relative flex w-full items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-between py-8 md:gap-16">
        <Header />

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

          {comments && <Comments />}
        </main>

        {video && <Footer />}
      </div>
    </div>
  )
}

function Header() {
  return (
    <header className="flex items-center justify-start">
      <p className="relative z-20 bg-gradient-to-b from-gray-800 to-gray-800 bg-clip-text text-center text-2xl font-bold text-transparent sm:text-4xl">
        search
        <span className="mx-[2px] rounded-md bg-gray-800 px-2 text-white">
          comments
        </span>
        <span className="text-2xl">.com</span>
      </p>
    </header>
  )
}

function Footer() {
  return (
    <footer className="flex flex-col items-center gap-4">
      <Link
        onClick={() => captureEvent("Ko-fi")}
        href="https://dub.sh/danielkofi"
        target="_blank"
      >
        <Image
          src="/buy-me-a-coffee.jpg"
          alt="Buy me a coffee"
          width={220}
          height={80}
        />
      </Link>

      <Link
        onClick={() => captureEvent("Follow me on twitter")}
        href="https://dub.sh/danielx"
        target="_blank"
        rel="noreferrer"
        className="animate-fade-up mx-auto mb-5 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-gray-100 px-7 py-2 transition-colors hover:bg-gray-50"
      >
        <svg
          width="300"
          height="300"
          viewBox="0 0 300 300"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 p-px text-gray-600"
        >
          <path
            stroke="currentColor"
            d="M178.57 127.15 290.27 0h-26.46l-97.03 110.38L89.34 0H0l117.13 166.93L0 300.25h26.46l102.4-116.59 81.8 116.59h89.34M36.01 19.54H76.66l187.13 262.13h-40.66"
          />
        </svg>
        <p className="text-sm font-semibold text-gray-600">
          Follow me on twitter
        </p>
      </Link>
    </footer>
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
        <div className="relative w-full">
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

function Comments() {
  const { comments } = useComments()
  const searchTerms = useSearchTerms()

  return (
    <div className="flex flex-col gap-6">
      <span className="text-lg font-medium">
        Comments found ({comments?.length})
      </span>

      <div className="flex flex-col gap-8">
        {comments?.map((comment, i) => (
          <div key={i} className="flex gap-4">
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
                |<p>{comment.comment.repliesCount} replies</p>|
                <Link target="_blank" href={comment.comment.viewCommentUrl}>
                  Go to comment
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const highlightText = (text: string, phrase: string) => {
  if (!phrase) return text
  const words = phrase.split(" ").filter((word) => word)
  const regex = new RegExp(`\\b(${words.join("|")})\\b`, "gi")

  return text.split(regex).map((part, index) =>
    words.includes(part.toLowerCase()) ? (
      <span key={index} className="rounded-md bg-yellow-300 p-1 font-medium">
        {part}
      </span>
    ) : (
      part
    ),
  )
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
