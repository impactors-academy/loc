// The Impactors Academy team members who write or review LOC posts. Names,
// roles and slugs mirror impactors-academy/src/lib/team.ts (the source of
// truth, where each person also has a public profile); keep them in sync.
// Photos are local copies, square-cropped, in public/images/team/.

export type Locale = "en" | "fr" | "es" | "pt"
type L10n = Record<Locale, string>

export interface TeamMember {
  slug: string
  name: string
  role: L10n
  photo: string
}

export const PROFILE_BASE = "https://impactorsacademy.com/profiles"

export const TEAM: TeamMember[] = [
  {
    slug: "emmanuel-morris",
    name: "Emmanuel Morris (MENDER)",
    role: { en: "Co-Founder, LOC", fr: "Cofondateur, LOC", es: "Cofundador, LOC", pt: "Cofundador, LOC" },
    photo: "/images/team/emmanuel-morris.jpg",
  },
  {
    slug: "lewis-rogers",
    name: "Lewis Rogers",
    role: { en: "Co-Founder, LOC", fr: "Cofondateur, LOC", es: "Cofundador, LOC", pt: "Cofundador, LOC" },
    photo: "/images/team/lewis-rogers.jpg",
  },
  {
    slug: "kodi-majok-matur",
    name: "Kodi Majok Matur",
    role: { en: "Co-Founder, LOC", fr: "Cofondateur, LOC", es: "Cofundador, LOC", pt: "Cofundador, LOC" },
    photo: "/images/team/kodi-majok-matur.jpg",
  },
  {
    slug: "zayzay-yennego",
    name: "Zayzay Yennego",
    role: { en: "Lead Full-Stack Engineer, IA Pro", fr: "Ingénieur full-stack principal, IA Pro", es: "Ingeniero full-stack principal, IA Pro", pt: "Engenheiro full-stack principal, IA Pro" },
    photo: "/images/team/zayzay-yennego.jpg",
  },
  {
    slug: "varney-fahnbulleh",
    name: "Varney Fahnbulleh",
    role: { en: "Engineer, IA Pro", fr: "Ingénieur, IA Pro", es: "Ingeniero, IA Pro", pt: "Engenheiro, IA Pro" },
    photo: "/images/team/varney-fahnbulleh.jpg",
  },
]

export function getMember(slug: string | null | undefined): TeamMember | undefined {
  return slug ? TEAM.find((m) => m.slug === slug) : undefined
}
