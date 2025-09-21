import { ToggleThemeButton } from "@/components/theme-provider"

export function Header() {
  return (
    <header className="flex items-center justify-center">
      <div className="flex w-full max-w-2xl items-center justify-between gap-4 px-2 py-2 sm:gap-0 sm:px-0">
        <Logo />
        <ToggleThemeButton />
      </div>
    </header>
  )
}

function Logo() {
  return (
    <p className="font-bold sm:text-2xl">
      <span className="mx-[2px] rounded-md bg-accent-foreground px-1 text-muted sm:px-2">
        searchcomments.com
      </span>
    </p>
  )
}
