import { type User } from "@supabase/supabase-js"
import posthog, { type Properties } from "posthog-js"

export function captureEvent({
  event,
  user,
  properties,
}: {
  event: string
  user?: User
  properties?: Properties
}) {
  let eventName = event

  // capture different event for my user to not mess data
  if (user?.email) eventName = "MYSELF - " + event

  posthog.capture(eventName, properties)
}
