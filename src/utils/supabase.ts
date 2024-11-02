import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs"

export const supabase = createPagesBrowserClient()

export async function signInWithMagicLink(email: string) {
  await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: "http://localhost:3001",
    },
  })
}

export async function signOut() {
  await supabase.auth.signOut()
}

export async function getUserAvatar() {
  const { data } = await supabase.auth.getSession()
  return data.session?.user.user_metadata.avatar_url as string
}
