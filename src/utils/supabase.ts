import { env } from "@/env"
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from "@supabase/supabase-js"
import { NextApiRequest } from "next"

export const supabase = createPagesBrowserClient()
export const supabaseServer = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
)

export async function signInWithMagicLink(email: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || `https://${process.env.VERCEL_URL}`

  await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: baseUrl,
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

export async function getUser(req: NextApiRequest) {
  const accessToken = req.cookies["sb-zgrdlqmodflvfgogztpp-auth-token"]

  if (!accessToken) return null

  const parsedAccessToken = JSON.parse(accessToken)

  const { data } = await supabaseServer.auth.getUser(parsedAccessToken[0])
  return data.user
}
