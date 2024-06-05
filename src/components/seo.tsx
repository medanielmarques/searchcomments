import { NextSeo } from "next-seo"

export function SEO() {
  return (
    <>
      <NextSeo
        title="Search Comments"
        description="Search Comments: The ultimate comment searcher."
        canonical="https://searchcomments.com"
        openGraph={{
          title: "Search Comments",
          description: "Search Comments: The ultimate comment searcher.",
          url: "https://searchcomments.com",
          // images: [
          //   {
          //     url: "https://searchcomments.com/og.png",
          //     width: 800,
          //     height: 600,
          //     alt: "Search Comments",
          //     type: "image/png",
          //   },
          // ],
        }}
      />
    </>
  )
}
