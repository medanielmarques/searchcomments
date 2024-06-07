import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { api } from "@/utils/api"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { type AppType } from "next/app"
import { Montserrat } from "next/font/google"
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

const montserrat = Montserrat({ subsets: ["latin"] })

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <PostHogProvider>
      <ReactQueryDevtools initialIsOpen={false} />

      <main className={montserrat.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Component {...pageProps} />
        </ThemeProvider>
        <Toaster />
      </main>
    </PostHogProvider>
  )
}

export default api.withTRPC(MyApp)
