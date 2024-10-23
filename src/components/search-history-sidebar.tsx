import { Separator } from "@/components/ui/separator"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { api } from "@/utils/api"
import Link from "next/link"

export function SearchHistorySidebar({
  children,
}: {
  children: React.ReactNode
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
  const { data } = api.searchRouter.getSearchHistory.useQuery()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Search history</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="flex flex-col gap-4">
              {data?.searchHistory.map((search) => (
                <>
                  <Separator />

                  <div
                    key={search.id}
                    className="flex items-center justify-center"
                  >
                    <Link href={search.videoUrl} target="_blank">
                      <div className="flex flex-col gap-4">
                        <span>{search.createdAt.toLocaleDateString()}</span>
                        <span>{limitParagraph(search.videoTitle)}</span>
                        <span>{limitParagraph(search.query)}</span>
                      </div>
                    </Link>
                  </div>
                </>
              ))}
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
