// Structured data rendered as a plain <script> in the server HTML, per the
// Next.js JSON-LD guide. next/script injected it after load, so crawlers that
// don't run JavaScript (most AI crawlers) never saw it. "<" is escaped so a
// value from the CMS can't close the tag early.
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  )
}
