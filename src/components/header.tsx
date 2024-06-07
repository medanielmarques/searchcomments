import { ToggleThemeButton } from "@/components/theme-provider"
import { captureEvent } from "@/lib/analytics"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"

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

export function Header() {
  return (
    <header className="flex items-center justify-center">
      <div className="flex w-full max-w-2xl items-center justify-between px-2 py-2 sm:px-0">
        <Logo />

        <div className="flex items-center gap-2 sm:gap-3">
          <BuyMeACoffeeLink />
          <TwitterLink />

          <div className="hidden sm:block">
            <RequestFeatureLink />
          </div>

          <div className="hidden sm:block">
            <ToggleThemeButton />
          </div>
        </div>
      </div>
    </header>
  )
}

function Logo() {
  return (
    <p className="font-bold text-gray-800 dark:text-gray-200 sm:text-2xl">
      search
      <span className="mx-[2px] rounded-md bg-gray-800 px-2 text-white">
        comments
      </span>
      <span className="text-sm sm:text-xl">.com</span>
    </p>
  )
}

function BuyMeACoffeeLink() {
  return (
    <Link
      className="inline-flex h-9 items-center space-x-2 rounded-md bg-yellow-300 px-3 py-2 text-gray-900"
      onClick={() => captureEvent("Ko-fi")}
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
      onClick={() => captureEvent("Follow me on twitter")}
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
    <>
      <Link
        onClick={() => captureEvent("Insigh.to")}
        href="https://app.searchcomments.com/feature"
        target="_blank"
        className="hidden h-9 items-center space-x-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-accent sm:block"
        title="Request a feature"
      >
        Request a feature
      </Link>

      <Link
        onClick={() => captureEvent("Insigh.to")}
        href="https://app.searchcomments.com/feature"
        target="_blank"
        className="sm:hidden"
        title="Request a feature"
      >
        <Image
          className="rounded-md"
          src="/insighto.png"
          width={36}
          height={36}
          alt="Request a feature"
        />
      </Link>
    </>
  )
}
