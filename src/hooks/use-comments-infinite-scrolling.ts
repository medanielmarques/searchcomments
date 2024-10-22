import { useComments } from "@/lib/video-store"
import { useEffect, useRef } from "react"

export function useCommentsInfiniteScrolling() {
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = useComments()

  const commentsInfiniteScrollingObserverTarget = useRef(null)

  useEffect(() => {
    const currentTarget = commentsInfiniteScrollingObserverTarget.current

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage()
        }
      },
      { threshold: 1 },
    )

    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  return {
    commentsInfiniteScrollingObserverTarget,
  }
}
