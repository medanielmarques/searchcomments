import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs"

export const supabase = createPagesBrowserClient()

export async function signInWithEmail() {
  await supabase.auth.signInWithOtp({
    email: "daniel.brz2009@gmail.com",
    options: {
      // set this to false if you do not want the user to be automatically signed up
      shouldCreateUser: true,
      emailRedirectTo: "http://localhost:3000",
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
