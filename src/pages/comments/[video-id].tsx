import { Button } from "@/components/ui/button"
import { GridBackground } from "@/components/ui/grid-bg"
import { Input } from "@/components/ui/input"
import { api } from "@/utils/api"
import { ReloadIcon } from "@radix-ui/react-icons"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"

export default function CommentsPage() {
  const router = useRouter()
  const { "video-id": videoId } = router.query
  const utils = api.useUtils()

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
    api.videoRouter.fetchVideoInfo.useQuery({
      videoId: typeof videoId === "string" ? videoId : "",
    })

  const { data, isLoading } = api.videoRouter.fetchComments.useQuery(
    {
      videoId: typeof videoId === "string" ? videoId : "",
      searchTerms,
    },
    { enabled: false },
  )

  return (
    <div className="relative flex w-full items-center justify-center bg-white bg-grid-small-black/[0.1] dark:bg-black dark:bg-grid-small-white/[0.2]">
      <div className="flex flex-col items-center justify-between gap-16 py-8 pl-8">
        <header className="flex items-center justify-start">
          <p className="relative z-20 max-w-lg bg-gradient-to-b from-red-300 to-red-500 bg-clip-text text-center text-3xl font-bold text-transparent sm:text-4xl">
            SearchComments<span>.com</span>
          </p>
        </header>

        <main className="flex w-5/6 max-w-4xl flex-col items-center gap-8 py-8 md:py-0">
          <div className="flex w-full flex-col gap-6">
            <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
              <Input
                className="w-full bg-white"
                type="text"
                onChange={(e) => setSearchTerms(e.target.value)}
                placeholder="Search the comments"
                value={searchTerms}
              />

              <Button
                className="w-full bg-red-400 hover:bg-red-500 md:w-20"
                disabled={isLoading}
                onClick={async () => {
                  videoId &&
                    (await utils.videoRouter.fetchComments.fetch({
                      videoId: typeof videoId === "string" ? videoId : "",
                      searchTerms,
                    }))

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
            <div className="flex items-center gap-3">
              {searchSuggestions.map(({ suggestion, selected }) => (
                <Button
                  className={`h-8 rounded-lg ${selected ? "bg-black text-white hover:bg-primary/90" : "bg-zinc-100"} text-sm font-semibold hover:bg-zinc-200`}
                  key={suggestion}
                  variant="secondary"
                  onClick={async () => {
                    videoId &&
                      (await utils.videoRouter.fetchComments.fetch({
                        videoId: typeof videoId === "string" ? videoId : "",
                        searchTerms,
                      }))

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

          {/* VIDEO INFO */}
          {!isLoadingVideo && (
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

          {showComments && (
            <div className="flex flex-col gap-6">
              {/* COMMENTS */}
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
                      <p>{comment.author.name}</p>
                      <p>{comment.comment.content}</p>

                      <div className="flex items-center gap-2 text-xs text-blue-600">
                        <Link
                          target="_blank"
                          href={comment.comment.viewCommentUrl}
                        >
                          Go to comment
                        </Link>
                        |
                        <p>
                          {comment.comment.likes}{" "}
                          {comment.comment.likes === 1 ? "like" : "likes"}
                        </p>
                        |<p>{comment.comment.repliesCount} replies</p>|
                        <p>{comment.comment.date}</p>
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
