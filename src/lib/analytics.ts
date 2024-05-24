import posthog, { type Properties } from "posthog-js"

export function captureEvent(event: string, properties?: Properties) {
  posthog.capture(event, properties)
}
