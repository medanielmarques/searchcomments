import { SEO } from "@/components/seo"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { api } from "@/utils/api"
import { supabase } from "@/utils/supabase"
import { SessionContextProvider } from "@supabase/auth-helpers-react"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { GeistMono } from "geist/font/mono"
import { type AppType } from "next/app"
import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"

import "../globals.css"

const isProduction = process.env.NODE_ENV === "production"

if (isProduction && typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
  })
}

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <PostHogProvider>
      <ReactQueryDevtools initialIsOpen={false} />

      <main className={GeistMono.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionContextProvider
            initialSession={pageProps.initialSession}
            supabaseClient={supabase}
          >
            <SEO />
            <Component {...pageProps} />
          </SessionContextProvider>
        </ThemeProvider>
        <Toaster />
      </main>
    </PostHogProvider>
  )
}

export default api.withTRPC(MyApp)
