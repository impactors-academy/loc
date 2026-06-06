import { InquiryForm } from "@/components/shared/InquiryForm"
import type { Metadata } from "next"

interface Props {
  params: { slug: string }
}

export const metadata: Metadata = { title: "Property Detail" }

export default function PropertyDetailPage({ params }: Props) {
  return (
    <div className="container mx-auto py-12 px-4">
      <p className="text-sm text-muted-foreground">Property: {params.slug}</p>
      <InquiryForm subject={`Inquiry about property: ${params.slug}`} />
    </div>
  )
}
