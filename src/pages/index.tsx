import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { api } from "@/utils/api"
import { ReloadIcon } from "@radix-ui/react-icons"
import { formatDistanceStrict } from "date-fns"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

function getVideoId(videoUrl: string) {
  const videoId = videoUrl.match(/([a-z0-9_-]{11})/gim)
  return videoId ? videoId[0] : ""
}

export default function CommentsPage() {
  const utils = api.useUtils()

  const [videoUrl, setVideoUrl] = useState("")
  const [searchTerms, setSearchTerms] = useState("")
  const [showComments, setShowComments] = useState(false)
  const [searchSuggestions, setSearchSuggestions] = useState([
    { suggestion: "Song name", selected: false },
    { suggestion: "His name", selected: false },
    { suggestion: "Her name", selected: false },
    { suggestion: "Source", selected: false },
    { suggestion: "Link", selected: false },
  ])

  const { data: video, isLoading: isLoadingVideo } =
    api.videoRouter.fetchVideoInfo.useQuery(
      { videoId: getVideoId(videoUrl) },
      { enabled: false },
    )

  const { data, isLoading } = api.videoRouter.fetchComments.useQuery(
    {
      videoId: getVideoId(videoUrl),
      searchTerms,
    },
    { enabled: false },
  )

  return (
    <div className="relative flex w-full items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-between gap-16 py-8 pl-8">
        <header className="flex items-center justify-start">
          <p className="relative z-20 max-w-lg bg-gradient-to-b from-gray-800 to-gray-800 bg-clip-text text-center text-3xl font-bold text-transparent sm:text-4xl">
            search
            <span className="mx-[2px] rounded-md bg-gray-800 px-2 text-white">
              comments
            </span>
            <span className="text-2xl">.com</span>
          </p>
        </header>

        <main className="flex w-5/6 max-w-4xl flex-col items-center gap-8 py-8 md:py-0">
          <div className="flex w-full flex-col gap-6">
            <div className="flex flex-col items-center gap-4">
              <div>
                <span className="text-lg font-medium">Video</span>

                <div className="flex w-full flex-col items-center gap-4 md:flex-row md:gap-2">
                  <Input
                    className="w-full bg-white"
                    type="text"
                    placeholder="Video URL"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />

                  <Button
                    onClick={async () => {
                      const videoId = getVideoId(videoUrl)
                      await utils.videoRouter.fetchVideoInfo.fetch({ videoId })
                    }}
                    className="w-full bg-gray-800 hover:bg-gray-800 md:w-36"
                  >
                    Load video
                  </Button>
                </div>

                {/* VIDEO INFO */}
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
                            <span className="text-xs">
                              {video?.channelName}
                            </span>

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

              <Separator />

              {!isLoadingVideo && video && (
                <div className="flex w-full flex-col items-center gap-4 md:flex-row md:gap-2">
                  <Input
                    className="w-full bg-white"
                    type="text"
                    onChange={(e) => setSearchTerms(e.target.value)}
                    placeholder="Search the comments"
                    value={searchTerms}
                  />

                  <Button
                    className="w-full bg-gray-800 hover:bg-gray-800 md:w-36"
                    disabled={isLoading}
                    onClick={async () => {
                      const videoId = getVideoId(videoUrl)

                      await utils.videoRouter.fetchComments.fetch({
                        videoId,
                        searchTerms,
                      })

                      setShowComments(true)
                    }}
                  >
                    {isLoading ? (
                      <ReloadIcon className="h-4 w-4 animate-spin" />
                    ) : (
                      "Search"
                    )}
                  </Button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              {searchSuggestions.map(({ suggestion, selected }) => (
                <Button
                  className={`h-8 rounded-lg ${selected ? "bg-black text-white hover:bg-primary/90" : "bg-zinc-100"} text-sm font-semibold hover:bg-zinc-200`}
                  key={suggestion}
                  variant="secondary"
                  onClick={async () => {
                    const videoId = getVideoId(videoUrl)

                    await utils.videoRouter.fetchComments.fetch({
                      videoId,
                      searchTerms,
                    })

                    setShowComments(true)

                    setSearchSuggestions((e) =>
                      e.map((s) => {
                        s.suggestion === suggestion &&
                          setSearchTerms(s.selected ? "" : s.suggestion)

                        return {
                          ...s,
                          selected: s.suggestion === suggestion && !s.selected,
                        }
                      }),
                    )
                  }}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>

          {showComments && (
            <div className="flex flex-col gap-6">
              <Separator />

              {/* COMMENTS */}
              <span className="text-lg font-medium">
                Comments found ({data?.comments.length})
              </span>

              <div className="flex flex-col gap-8">
                {data?.comments.map((comment, i) => (
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
                      {/* <span>{comment.comment.content}</span> */}
                      <div className="flex items-center gap-2 text-xs text-blue-600">
                        <p>
                          {comment.comment.likes}{" "}
                          {comment.comment.likes === 1 ? "like" : "likes"}
                        </p>
                        |<p>{comment.comment.repliesCount} replies</p>|
                        <Link
                          target="_blank"
                          href={comment.comment.viewCommentUrl}
                        >
                          Go to comment
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        <footer>
          <Link href="https://ko-fi.com/danielmarques" target="_blank">
            <Image
              src="/buy-me-a-coffee.jpg"
              alt="Buy me a coffee"
              width={220}
              height={80}
            />
          </Link>
        </footer>
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
