import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { captureEvent } from "@/lib/analytics"
import { api } from "@/utils/api"
import { useSession } from "@supabase/auth-helpers-react"
import { useTheme } from "next-themes"
import Link from "next/link"

export function SearchHistorySidebar({
  children,
}: {
  children?: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}

export function AppSidebar() {
  const session = useSession()

  const { data } = api.searchRouter.getSearchHistory.useQuery(undefined, {
    enabled: !!session?.user.email,
  })

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="h-screen">
          <SidebarGroupLabel>Search history</SidebarGroupLabel>
          <SidebarGroupContent className="flex h-full flex-col justify-between">
            {session?.user.email ? (
              <div className="flex flex-col gap-4">
                {data?.searchHistory.map((search) => (
                  <div key={search.id}>
                    <Separator />

                    <div className="flex items-center justify-center">
                      <Link href={search.videoUrl} target="_blank">
                        <div className="flex flex-col gap-4">
                          <span>{search.createdAt.toLocaleDateString()}</span>
                          <span>{limitParagraph(search.videoTitle)}</span>
                          <span>{limitParagraph(search.query)}</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                Sign in to see your search history
              </div>
            )}

            <Separator />

            {/* Sidebar Footer */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <BuyMeACoffeeLink />
                <TwitterLink />
                <RequestFeatureLink />
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

function limitParagraph(text: string) {
  const MAX_LENGTH = 50

  if (text.length <= MAX_LENGTH) return text

  let truncatedText = text.slice(0, MAX_LENGTH)

  if (text[MAX_LENGTH] !== " ") {
    const lastSpaceIndex = truncatedText.lastIndexOf(" ")

    if (lastSpaceIndex !== -1) {
      truncatedText = truncatedText.slice(0, lastSpaceIndex)
    }
  }

  return truncatedText + "..."
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

function BuyMeACoffeeLink() {
  return (
    <Link
      className="inline-flex h-9 items-center space-x-2 rounded-md bg-yellow-300 px-3 py-2 text-gray-900"
      onClick={() => captureEvent({ event: "Ko-fi" })}
      href="https://dub.sh/danielkofi"
      target="_blank"
      title="Buy me a coffee"
    >
      <CoffeeIcon />
    </Link>
  )
}

function TwitterLink() {
  const { resolvedTheme } = useTheme()

  return (
    <Link
      onClick={() => captureEvent({ event: "Follow me on twitter" })}
      href="https://dub.sh/danielx"
      target="_blank"
      className="inline-flex h-9 items-center space-x-2 rounded-md bg-black px-3 py-2 text-white transition-colors hover:bg-slate-900 dark:bg-white"
      title="Follow me on twitter"
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
          fill={resolvedTheme === "light" ? "#fff" : "#000"}
          fillRule="nonzero"
          d="M403.229 0h78.506L310.219 196.04 512 462.799H354.002L230.261 301.007 88.669 462.799h-78.56l183.455-209.683L0 0h161.999l111.856 147.88L403.229 0zm-27.556 415.805h43.505L138.363 44.527h-46.68l283.99 371.278z"
        />
      </svg>
    </Link>
  )
}

function RequestFeatureLink() {
  return (
    <Button variant="outline">
      <Link
        onClick={() => captureEvent({ event: "Insigh.to" })}
        href="https://insigh.to/b/searchcomments"
        target="_blank"
        title="Request a feature"
      >
        Feature request
      </Link>
    </Button>
  )
}
