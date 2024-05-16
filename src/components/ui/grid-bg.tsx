import React, { type ReactNode } from "react"

export function GridBackground({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex w-full items-center justify-center bg-white bg-grid-small-black/[0.1] dark:bg-black dark:bg-grid-small-white/[0.2]">
      {children}
    </div>
  )
}
