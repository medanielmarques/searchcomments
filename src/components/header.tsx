import { ToggleThemeButton } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast"
import { signInWithMagicLink, signOut } from "@/utils/supabase"
import { PaperPlaneIcon } from "@radix-ui/react-icons"
import { useSession } from "@supabase/auth-helpers-react"
import { useState } from "react"

export function Header() {
  const session = useSession()
  const { toast } = useToast()
  const [email, setEmail] = useState("")

  async function handleClickSignIn() {
    if (session?.user.email) await signOut()

    await signInWithMagicLink(email)

    toast({
      className: "bg-green-100 text-green-900 font-bold",
      title: "✅ We've just sent you a magic link. Please check your e-mail.",
    })
  }

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
    <p className="font-bold text-gray-800 dark:text-gray-200 sm:text-2xl">
      <span className="mx-[2px] rounded-md bg-gray-800 px-1 text-white dark:bg-gray-200 dark:text-gray-800 sm:px-2">
        searchcomments.com
      </span>
    </p>
  )
}
