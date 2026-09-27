import { ScrollReveal, ScrollRevealItem } from "@/components/shared/ScrollReveal"
import { SectionHeader } from "@/components/shared/SectionHeader"
import { Link } from "@/i18n/navigation"
import { COUNTRIES } from "@/lib/constants"
import { getDestinationImage } from "@/lib/images"
import type { Experience, Property } from "@/lib/types"
import { cn } from "@/lib/utils"
import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import { getTranslations } from "next-intl/server"

interface Props {
  properties: Property[]
  experiences: Experience[]
}

// Counts are computed from the live listings on every render rather than
// written into copy, so they can never claim more than the site holds.
export async function Destinations({ properties, experiences }: Props) {
  const t = await getTranslations("home")
  const tc = await getTranslations("countries")
  const tCommon = await getTranslations("common")

  const tiles = COUNTRIES.map((c) => {
    const stays = properties.filter((p) => p.country === c.value).length
    const exps = experiences.filter((e) => e.country === c.value).length
    return {
      country: c.value,
      stays,
      exps,
      live: stays + exps > 0,
      href: stays > 0 ? `/stays?country=${c.value}` : `/experiences?country=${c.value}`,
    }
  })

  return (
    <section className="py-24 md:py-32 bg-loc-cream">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <SectionHeader
            eyebrow={t("destinationsEyebrow")}
            title={t("destinationsTitle")}
            subtitle={t("destinationsSubtitle")}
            className="mb-12"
          />
        </ScrollReveal>

        <ScrollReveal variant="stagger" className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-4 md:h-[640px]">
          {tiles.map((tile, i) => {
            const counts = [
              tile.stays > 0 ? t("staysCount", { count: tile.stays }) : null,
              tile.exps > 0 ? t("experiencesCount", { count: tile.exps }) : null,
            ].filter(Boolean)
            return (
              <ScrollRevealItem key={tile.country} className={cn(i === 0 && "md:row-span-2")}>
                {(() => {
                  const body = (
                    <>
                      <Image
                        src={getDestinationImage(tile.country, i === 0 ? 1600 : 1000)}
                        alt=""
                        fill
                        className={cn(
                          "object-cover transition-transform duration-[1200ms] ease-expo",
                          tile.live ? "group-hover:scale-[1.06]" : "grayscale-[40%] opacity-70"
                        )}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" aria-hidden="true" />
                      <div className="relative mt-auto w-full p-6 md:p-8 flex items-end justify-between gap-4">
                        <div>
                          {counts.length > 0 && <p className="text-white/75 text-sm mb-2">{counts.join(" · ")}</p>}
                          <h3
                            className={cn(
                              "font-heading font-semibold text-white tracking-[-0.03em] leading-[0.9]",
                              i === 0 ? "text-6xl md:text-8xl" : "text-5xl md:text-6xl"
                            )}
                          >
                            {tc(tile.country)}
                          </h3>
                        </div>
                        {tile.live ? (
                          <span className="glass-dark shrink-0 h-12 w-12 rounded-full flex items-center justify-center transition-transform duration-500 ease-expo group-hover:rotate-45" aria-hidden="true">
                            <ArrowUpRight size={20} />
                          </span>
                        ) : (
                          <span className="glass-dark shrink-0 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em]">
                            {tCommon("comingSoon")}
                          </span>
                        )}
                      </div>
                    </>
                  )
                  const frame = cn(
                    "relative flex h-full overflow-hidden rounded-[24px] bg-loc-night",
                    i === 0 ? "min-h-[440px]" : "min-h-[300px]"
                  )
                  return tile.live ? (
                    <Link
                      href={tile.href}
                      className={cn(frame, "group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-loc-terracotta focus-visible:ring-offset-4")}
                    >
                      {body}
                    </Link>
                  ) : (
                    <div className={frame}>{body}</div>
                  )
                })()}
              </ScrollRevealItem>
            )
          })}
        </ScrollReveal>
      </div>
    </section>
  )
}
