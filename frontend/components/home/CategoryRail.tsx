import { ScrollReveal, ScrollRevealItem } from "@/components/shared/ScrollReveal"
import { SectionHeader } from "@/components/shared/SectionHeader"
import { Link } from "@/i18n/navigation"
import { EXPERIENCE_CATEGORIES } from "@/lib/constants"
import { getCategoryCover } from "@/lib/images"
import { cn } from "@/lib/utils"
import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import { getTranslations } from "next-intl/server"

export async function CategoryRail({ counts }: { counts: Record<string, number> }) {
  const t = await getTranslations("home")
  const tc = await getTranslations("experienceCategories")
  const tCommon = await getTranslations("common")
  const categories = EXPERIENCE_CATEGORIES.filter((c) => c.value)
  const anyLive = categories.some((c) => (counts[c.value] ?? 0) > 0)

  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <SectionHeader
            eyebrow={t("categoriesEyebrow")}
            title={t("categoriesTitle")}
            subtitle={anyLive ? t("categoriesSubtitle") : t("categoriesSoonSubtitle")}
            className="mb-12"
          />
        </ScrollReveal>
      </div>

      {/* Full-bleed on small screens so the rail can be swiped edge to edge;
          settles into a six-up grid once there is room for all of them. */}
      <ScrollReveal
        variant="stagger"
        className="container mx-auto px-4 flex lg:grid lg:grid-cols-6 gap-4 overflow-x-auto lg:overflow-visible snap-x snap-mandatory no-scrollbar -mb-4 pb-4"
      >
        {categories.map((cat, i) => {
          const live = (counts[cat.value] ?? 0) > 0
          const inner = (
            <>
              <Image
                src={getCategoryCover(cat.value)}
                alt=""
                fill
                className={cn(
                  "object-cover transition-transform duration-[900ms] ease-expo",
                  live ? "opacity-90 group-hover:scale-[1.08]" : "opacity-60 grayscale-[35%]"
                )}
                sizes="(max-width: 640px) 62vw, (max-width: 1024px) 38vw, 16vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" aria-hidden="true" />
              <span className="absolute top-4 left-4 font-heading text-sm text-white/70 tabular-nums" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              {live ? (
                <span className="glass-dark absolute top-3 right-3 h-9 w-9 rounded-full flex items-center justify-center" aria-hidden="true">
                  <ArrowUpRight size={16} />
                </span>
              ) : (
                <span className="glass-dark absolute top-3 right-3 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em]">
                  {tCommon("comingSoon")}
                </span>
              )}
              <span className="absolute bottom-4 left-4 right-4 font-heading text-2xl font-semibold text-white tracking-tight">
                {tc(cat.value)}
              </span>
            </>
          )
          return (
            <ScrollRevealItem key={cat.value} className="snap-start shrink-0 w-[62%] sm:w-[38%] lg:w-auto">
              {live ? (
                <Link
                  href={`/experiences?category=${cat.value}`}
                  className="group relative block aspect-[3/4] overflow-hidden rounded-[20px] bg-loc-night focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-loc-terracotta focus-visible:ring-offset-4"
                >
                  {inner}
                </Link>
              ) : (
                <div className="relative aspect-[3/4] overflow-hidden rounded-[20px] bg-loc-night">{inner}</div>
              )}
            </ScrollRevealItem>
          )
        })}
      </ScrollReveal>
    </section>
  )
}
