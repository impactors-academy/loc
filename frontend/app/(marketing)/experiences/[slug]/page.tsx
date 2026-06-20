import { InquiryForm } from "@/components/shared/InquiryForm"
import { api } from "@/lib/api"
import { formatPriceRange } from "@/lib/types"
import { MapPin, Tag, User } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const exp = await api.experiences.get(slug)
    return {
      title: `${exp.title} | LOC Experiences`,
      description: exp.description,
    }
  } catch {
    return { title: "Experience | LOC" }
  }
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  adventure: "from-amber-950 via-orange-900 to-amber-800",
  wellness: "from-emerald-950 via-teal-900 to-emerald-800",
  cultural: "from-purple-950 via-indigo-900 to-purple-800",
  aerial: "from-sky-950 via-blue-900 to-sky-800",
  water: "from-cyan-950 via-blue-900 to-cyan-800",
}

export default async function ExperienceDetailPage({ params }: Props) {
  const { slug } = await params

  let experience: Awaited<ReturnType<typeof api.experiences.get>> | null = null
  try {
    experience = await api.experiences.get(slug)
  } catch {
    // render skeleton / not-found fallback below
  }

  const gradient =
    experience ? (CATEGORY_GRADIENTS[experience.category] ?? "from-loc-night via-loc-night/80 to-loc-stone") : "from-loc-night via-loc-night/80 to-loc-stone"

  return (
    <main className="pt-24 pb-20">
      {/* Hero banner */}
      <div
        className={`relative h-72 md:h-96 bg-gradient-to-br ${gradient} overflow-hidden`}
      >
        {experience?.images?.[0] && (
          <Image
            src={experience.images[0]}
            alt={experience.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-end container mx-auto px-4 pb-8">
          {experience && (
            <>
              <span className="inline-block mb-3 px-3 py-1 bg-loc-terracotta text-white text-xs font-medium rounded-full uppercase tracking-wide w-fit capitalize">
                {experience.category}
              </span>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-white text-balance">
                {experience.title}
              </h1>
              <p className="mt-2 text-white/70 text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {experience.location}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 mt-10">
        <div className="flex items-center gap-2 text-xs text-loc-stone mb-8">
          <Link href="/" className="hover:text-loc-terracotta transition-colors">Home</Link>
          <span>/</span>
          <Link href="/experiences" className="hover:text-loc-terracotta transition-colors">Experiences</Link>
          <span>/</span>
          <span className="text-loc-night">{experience?.title ?? slug}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content — 2/3 */}
          <div className="lg:col-span-2">
            {experience ? (
              <>
                <p className="text-loc-stone leading-relaxed text-base mb-8">
                  {experience.description}
                </p>
                <div className="flex flex-wrap gap-6 mb-10 border-t border-border pt-6">
                  <div className="flex items-center gap-2 text-sm text-loc-stone">
                    <Tag className="w-4 h-4 text-loc-terracotta" />
                    <span className="font-medium text-loc-night capitalize">{experience.category}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-loc-stone">
                    <MapPin className="w-4 h-4 text-loc-terracotta" />
                    <span>{experience.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-loc-stone">
                    <User className="w-4 h-4 text-loc-terracotta" />
                    <span>{experience.providerName}</span>
                  </div>
                </div>
                <div className="rounded-2xl bg-loc-sand/40 border border-loc-sand p-6">
                  <p className="text-xs text-loc-stone uppercase tracking-widest mb-1">Starting from</p>
                  <p className="font-heading text-2xl font-bold text-loc-terracotta">
                    {formatPriceRange(experience.priceMin, experience.priceMax, "/ person")}
                  </p>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-5 bg-muted rounded animate-pulse" style={{ width: `${75 + i * 5}%` }} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar — 1/3 */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 rounded-2xl border border-border bg-white p-6 shadow-sm">
              <p className="font-heading text-lg font-semibold text-loc-night mb-1">
                Interested in this experience?
              </p>
              <p className="text-loc-stone text-sm mb-6">
                Send a message and the provider will get back to you directly.
              </p>
              <InquiryForm subject={`Inquiry about experience: ${experience?.title ?? slug}`} />
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
