// For offline coding
import { createId as cuid } from "@paralleldrive/cuid2"

export const mockedVideo = {
  title:
    "City bate Fulham e supera GOLAÇO DE ANDREAS PEREIRA e gol de Rodrigo Muniz com show de Kovacic",
  channelName: "ESPN Brasil",
  thumbnail: "https://i.ytimg.com/vi/1R3Qc-WVaBQ/maxresdefault.jpg",
  commentCount: "2.1K",
  likeCount: "27.9K",
  viewCount: "636.0K",
  videoUrl: "https://www.youtube.com/watch?v=1R3Qc-WVaBQ",
}

export const mockedComment = {
  author: {
    name: "@LuanaAssmann",
    photo:
      "https://yt3.ggpht.com/ytc/AIdro_kPDMU8J-5OP_YtAcKVXOoReR_tew_AUnKDv_uWHEeEUrz_hb-YzHO526b6KJ0TceMuJQ=s48-c-k-c0x00ffffff-no-rj",
  },
  comment: {
    id: "Ugz9iEXf7Ptr3KY3cCB4AaABAg",
    content: "Kovacic, salvando o dia 💎👕💙🫂.",
    date: "10/5/2024",
    likes: "59",
    repliesCount: 0,
    viewCommentUrl:
      "https://www.youtube.com/watch?v=1R3Qc-WVaBQ&lc=Ugz9iEXf7Ptr3KY3cCB4AaABAg",
  },
  replies: [],
}

export const mockedComments = Array.from({ length: 50 }).map(() => ({
  ...mockedComment,
  comment: { ...mockedComment.comment, id: cuid() },
}))
