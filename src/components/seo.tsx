import { NextSeo } from "next-seo"

export function SEO() {
  return (
    <>
      <NextSeo
        title="Search Youtube Comments"
        description="Search any comment on Youtube videos"
        canonical="https://searchcomments.com"
        additionalMetaTags={[
          {
            name: "keywords",
            content:
              "Search comments, Comment, Finder, View Comment feeds, Youtube, Search, YT",
          },
        ]}
        openGraph={{
          title: "Search Youtube Comments",
          description: "Search any comment on Youtube videos",
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
