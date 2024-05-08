import { Button } from "@/components/ui/button"
import { GridBackground } from "@/components/ui/grid-bg"
import { Input } from "@/components/ui/input"
import { PlaceholdersAndVanishInput } from "@/components/ui/vanish-input"
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

  const { data, isLoading } = api.fetchComments.newShit.useQuery(
    {
      videoId: typeof videoId === "string" ? videoId : "",
      searchTerms,
    },
    { enabled: false },
  )

  return (
    <GridBackground>
      {/* <PlaceholdersAndVanishInput
        placeholders={["Song name?", "Their IG?"]}
        onChange={() => {}}
        onSubmit={() => {}}
      /> */}

      <main className="flex flex-col items-center gap-8 py-8 md:py-0">
        <p className="relative z-20 max-w-lg bg-gradient-to-b from-red-300 to-red-500 bg-clip-text text-center text-3xl font-bold text-transparent sm:text-4xl">
          Search for comments on any video
        </p>

        <div className="flex w-5/6 flex-col items-center gap-4 md:flex-row md:gap-2">
          <Input
            className="w-full bg-white"
            type="text"
            placeholder="Comment"
            value={searchTerms}
            onChange={(e) => setSearchTerms(e.target.value)}
          />

          <Button
            className="w-full bg-red-400 hover:bg-red-500 md:w-20"
            disabled={isLoading}
            onClick={async () => {
              videoId &&
                (await utils.fetchComments.newShit.fetch({
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

        {showComments && (
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

                <div className="flex flex-col gap-2">
                  <p>{comment.author.name}</p>
                  <p>{comment.comment.content}</p>

                  <div className="flex items-center gap-2 text-xs text-blue-600">
                    <Link target="_blank" href={comment.comment.viewCommentUrl}>
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
        )}
      </main>
    </GridBackground>
  )
}
