import { SEO } from "@/components/seo"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { api } from "@/utils/api"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { GeistMono } from "geist/font/mono"
import { type AppType } from "next/app"

import "../globals.css"

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <ReactQueryDevtools initialIsOpen={false} />

      <main className={GeistMono.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SEO />
          <Component {...pageProps} />
        </ThemeProvider>
        <Toaster />
      </main>
    </>
  )
}

export default api.withTRPC(MyApp)
