import { Footer } from "@/components/shared/Footer"
import { Navbar } from "@/components/shared/Navbar"
import { SmoothScroll } from "@/components/shared/SmoothScroll"

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
    </>
  )
}
