import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    YOUTUBE_DATA_API_KEY: z.string(),

    DATABASE_URL: z.string().url(),
    DATABASE_TOKEN: z.string().optional(),
  },

  client: {
    NEXT_PUBLIC_POSTHOG_KEY: z.string(),
    NEXT_PUBLIC_POSTHOG_HOST: z.string(),

    // OPTIONAL
    // NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID: z.string(),
    // NEXT_PUBLIC_HIGHLIGHT_SERVICE_NAME: z.string(),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    YOUTUBE_DATA_API_KEY: process.env.YOUTUBE_DATA_API_KEY,

    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_TOKEN: process.env.DATABASE_TOKEN,

    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,

    // OPTIONAL
    // NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID:
    //   process.env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID,
    // NEXT_PUBLIC_HIGHLIGHT_SERVICE_NAME:
    //   process.env.NEXT_PUBLIC_HIGHLIGHT_SERVICE_NAME,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
})
