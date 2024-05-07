import React, { type ReactNode } from "react"

export function GridBackground({ children }: { children: ReactNode }) {
  return (
    <div className="dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2] relative flex h-screen w-full items-center justify-center bg-white dark:bg-black">
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
      {children}
    </div>
  )
}
