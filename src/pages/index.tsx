import { Button } from "@/components/ui/button"
import { GridBackground } from "@/components/ui/grid-bg"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/router"
import { useState } from "react"

function getVideoId(videoUrl: string) {
  const videoId = videoUrl.match(/([a-z0-9_-]{11})/gim)
  return videoId ? videoId[0] : ""
}

export default function Home() {
  const router = useRouter()

  const [videoUrl, setVideoUrl] = useState("")

  return (
    <GridBackground>
      <main className="flex flex-col items-center gap-8 py-8 md:py-0">
        <p className="relative z-20 max-w-lg bg-gradient-to-b from-red-300 to-red-500 bg-clip-text text-center text-3xl font-bold text-transparent sm:text-4xl">
          Search for comments on any video
        </p>

        <div className="flex w-5/6 flex-col items-center gap-4 md:flex-row md:gap-2">
          <Input
            className="w-full bg-white"
            type="text"
            placeholder="Video URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />

          <Button
            onClick={() => {
              const videoId = getVideoId(videoUrl)

              router.push(`/comments/${videoId}`)
            }}
            className="w-full bg-red-400 hover:bg-red-500 md:w-20"
          >
            Search
          </Button>
        </div>
      </main>
    </GridBackground>
  )
}
