import { HeroSection } from "@/components/shared/HeroSection"
import { SectionHeader } from "@/components/shared/SectionHeader"

export default function HomePage() {
  return (
    <>
      <HeroSection
        title="Discover Morocco"
        subtitle="Experiences, stays, and hidden gems — all in one place."
        ctaLabel="Explore Experiences"
        ctaHref="/experiences"
        imageUrl="/images/hero.jpg"
      />
      <section className="container mx-auto py-16 px-4">
        <SectionHeader title="Top Experiences" subtitle="Hand-picked adventures waiting for you" />
      </section>
      <section className="container mx-auto py-16 px-4">
        <SectionHeader title="Places to Stay" subtitle="Find your perfect home in Morocco" />
      </section>
    </>
  )
}
