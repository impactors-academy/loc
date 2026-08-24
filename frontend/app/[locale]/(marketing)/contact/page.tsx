import { InquiryForm } from "@/components/shared/InquiryForm"
import { SectionHeader } from "@/components/shared/SectionHeader"
import type { Metadata } from "next"

// English only, for now — same call as /privacy and the existing /promote
// precedent in this route group.
export const metadata: Metadata = {
  title: "Contact Us | LOC",
  description: "Get in touch with the LOC team — questions, feedback, or anything else.",
  alternates: { canonical: "/contact" },
}

export default function ContactPage() {
  return (
    <main className="pt-24 pb-20">
      <section className="container mx-auto px-4 text-center max-w-2xl mb-16">
        <SectionHeader
          eyebrow="Get in touch"
          title="Contact Us"
          subtitle="Questions about an experience, a stay, or anything else — send us a message and we'll get back to you."
          center
        />
      </section>

      <section className="container mx-auto px-4 max-w-2xl">
        <div className="rounded-2xl bg-white border border-border p-8 shadow-sm">
          <InquiryForm subject="General contact" />
        </div>
      </section>
    </main>
  )
}
