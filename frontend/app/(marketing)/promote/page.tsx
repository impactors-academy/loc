import { InquiryForm } from "@/components/shared/InquiryForm"
import { SectionHeader } from "@/components/shared/SectionHeader"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Promote Your Business" }

export default function PromotePage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <SectionHeader
        title="Grow Your Tourism Business"
        subtitle="Reach thousands of travelers through LOC's platform and audience"
      />
      <InquiryForm subject="Business promotion inquiry" />
    </div>
  )
}
