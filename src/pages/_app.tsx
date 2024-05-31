import { Toaster } from "@/components/ui/toaster"
import { api } from "@/utils/api"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
// import { supabase } from "@/utils/supabase";
// import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { type AppType } from "next/app"
import { Montserrat } from "next/font/google"
import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"

// OPTIONAL
// import { HighlightInit } from "@highlight-run/next/client"
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
      {/* OPTIONAL */}
      {/* {isProduction && (
        <HighlightInit
          projectId={process.env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID}
          serviceName={process.env.NEXT_PUBLIC_HIGHLIGHT_SERVICE_NAME}
          tracingOrigins
          networkRecording={{
            enabled: true,
            recordHeadersAndBody: true,
            urlBlocklist: [],
          }}
        />
      )} */}

      <ReactQueryDevtools initialIsOpen={false} />

      <main className={montserrat.className}>
        {/* <SessionContextProvider supabaseClient={supabase}> */}
        <Component {...pageProps} />
        <Toaster />

        {/* </SessionContextProvider> */}
      </main>
    </PostHogProvider>
  )
}

export default api.withTRPC(MyApp)
