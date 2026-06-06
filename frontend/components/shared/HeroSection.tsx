import Link from "next/link"

interface HeroSectionProps {
  title: string
  subtitle: string
  ctaLabel: string
  ctaHref: string
  imageUrl: string
}

export function HeroSection({ title, subtitle, ctaLabel, ctaHref, imageUrl }: HeroSectionProps) {
  return (
    <section
      className="relative min-h-[85vh] flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">{title}</h1>
        <p className="text-lg md:text-xl text-white/80 mb-8">{subtitle}</p>
        <Link
          href={ctaHref}
          className="inline-block bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-white/90 transition-colors"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  )
}
