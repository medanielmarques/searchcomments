import { Input } from "@/components/ui/input"
import { api } from "@/utils/api"
import { useState } from "react"

export default function Home() {
  const [videoUrl, setVideoUrl] = useState(
    "https://www.youtube.com/watch?v=VCxP8MU1ZeE",
  )

  const { data } = api.fetchComments.newShit.useQuery({
    videoUrl,
    searchTerm: "bro",
  })

  return (
    <main>
      <div>
        <Input
          type="text"
          placeholder="Video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
      </div>
    </main>
  )
}
