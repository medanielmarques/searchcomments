import { Button } from "@/components/ui/button"
import { GridBackground } from "@/components/ui/grid-bg"
import { Input } from "@/components/ui/input"
import { PlaceholdersAndVanishInput } from "@/components/ui/vanish-input"
import { api } from "@/utils/api"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/router"
import { useState } from "react"

export default function CommentsPage() {
  const router = useRouter()
  const { "video-id": videoId } = router.query
  const utils = api.useUtils()

  const [searchTerms, setSearchTerms] = useState("")

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
            }}
          >
            {isLoading ? (
              <ReloadIcon className="h-4 w-4 animate-spin" />
            ) : (
              "Search"
            )}
          </Button>
        </div>
      </main>
    </GridBackground>
  )
}
