import { ToggleThemeButton } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { useSession } from "@supabase/auth-helpers-react"

export function Header() {
  const session = useSession()

  return (
    <header className="flex items-center justify-center">
      <div className="flex w-full max-w-2xl items-center justify-between px-2 py-2 sm:px-0">
        <Logo />

        <div className="flex gap-2">
          <Button>{session?.user ? "Sign out" : "Sign in"}</Button>
          <ToggleThemeButton />
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
